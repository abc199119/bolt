import express from "express";
import axios from "axios";

import { graphql } from '@octokit/graphql';

export const getAuth = async (req, res,) => {
      const {code} = req.body;

      if(!code) return res.status(400).json({"error" : "No or Invalid code"});

      try {
         const tokenRes = await axios.post("https://github.com/login/oauth/access_token", {
             client_id: process.env.GITHUB_CLIENT_ID,
             client_secret: process.env.GITHUB_CLIENT_SECRET,
             code: code
         }, {
             headers: { Accept: "application/json" }
         });
 
         const accessToken = tokenRes.data.access_token;
         
         if (!accessToken) return res.status(400).send("Failed to get access token.");
 
          res.status(200).json({"data" : {
            "access_token" : accessToken,
            "type" : "bearer",
            "code" : code
          }});
     } catch (error) {
         console.error("Token Exchange Error:", error);
         res.status(500).send("Failed to exchange code for access token.");
     }
}


// export const getPr = async (req, res) => {
//   const { accessToken, username } = req.body;

//   if (!accessToken || !username) {
//     return res.status(400).json({ error: "accessToken and username are required" });
//   }

//   const octokit = new Octokit({ auth: accessToken });

//   let page = 1;
//   let allPRs = [];

//   try {
//     while (true) {
//       const response = await octokit.request('GET /search/issues',{
//         q: `type:pr author:${username}`,
//         per_page: 100,
//         page,
//       });

//       allPRs.push(...response.data.items);

//       if (response.data.items.length < 100) break;
//       page++;
//     }

//     // Return to client
//     res.json({
//       count: allPRs.length,
//       pullRequests: allPRs.map(pr => ({
//         title: pr.title,
//         number: pr.number,
//         url: pr.html_url,
//         repo: pr.repository_url.split('/').slice(-2).join('/'),
//         state: pr.state
//       }))
//     });

//   } catch (error) {
//     console.error("Error fetching PRs:", error.message);
//     res.status(500).json({ error: "Failed to fetch pull requests" });
//   }
// };



const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_TOKEN}`,
  },
});

export const getPR = async (req, res) => {
     
    const {username} = req.body;

  try {
    const response = await graphqlWithAuth(`
      query ($searchQuery: String!) {
        search(query: $searchQuery, type: ISSUE, first: 100) {
          nodes {
            ... on PullRequest {
              title
              url
              state
              createdAt
              mergedAt
              repository {
                nameWithOwner
              }
            }
          }
        }
      }
    `, {
      searchQuery: `type:pr author:${username}`
    });

    res.json({
      user: username,
      pullRequests: response.search.nodes,
    });

  } catch (err) {
    console.error("GraphQL Error:", err);
    res.status(500).json({ error: "Failed to fetch pull requests" });
  }
}

export const getReview = async (req, res) => {
  const { owner, repo, prnum } = req.body;

  try {
    const query = `
      query($owner: String!, $repo: String!, $prNumber: Int!) {
        repository(owner: $owner, name: $repo) {
          pullRequest(number: $prNumber) {
            title

            reviews(first: 10) {
              nodes {
                author { login }
                body
                state
                submittedAt
                comments(first: 10) {
                  nodes {
                    body
                    path
                    position
                    createdAt
                    author {
                      login
                    }
                  }
                }
              }
            }

            reviewRequests(first: 10) {
              nodes {
                requestedReviewer {
                  ... on User {
                    login
                  }
                }
              }
            }

            comments(first: 10) {
              nodes {
                author { login }
                body
                createdAt
              }
            }
          }
        }
      }
    `;

    const response = await graphqlWithAuth(query, {
      owner,
      repo,
      prNumber: parseInt(prnum, 10),
    });

    const pr = response.repository.pullRequest;

    res.json({
      title: pr.title,
      reviews: pr.reviews.nodes,
      comments: pr.comments.nodes,
      reviewRequests: pr.reviewRequests.nodes.map(r => r.requestedReviewer?.login),
    });

  } catch (error) {
    console.error("Error fetching PR feedback:", error);
    res.status(500).json({ error });
  }
};



export const getGitHubUserProfile = async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ error: "Missing accessToken" });
  }

  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${accessToken}`,
    },
  });

  const query = `
    query {
      viewer {
        login
        name
        bio
        avatarUrl
        company
        location
        createdAt
        followers {
          totalCount
        }
        following {
          totalCount
        }
      }
    }
  `;

  try {
    const data = await graphqlWithAuth(query);
    res.json({ user: data.viewer });
  } catch (error) {
    console.error("GitHub GraphQL error:", error.message);
    res.status(500).json({ error: "Failed to fetch user info" });
  }
};
