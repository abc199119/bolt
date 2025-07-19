import { PullRequest, UserProfile, DashboardStats } from '../types';

export const mockUser: UserProfile = {
  username: 'akshaaybs',
  name: 'Akshay BS',
  avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  bio: 'Full-stack developer passionate about open source and clean code',
  location: 'San Francisco, CA',
  company: 'TechCorp',
  totalPRs: 147,
  acceptedPRs: 132,
  rejectedPRs: 12,
  pendingPRs: 3,
  score: 87,
  joinedDate: '2022-01-15'
};

export const mockPRs: PullRequest[] = [
  {
    id: '1',
    title: 'Add user authentication middleware',
    repo: 'techcorp/backend-api',
    status: 'accepted',
    author: 'akshaaybs',
    date: '2024-01-15',
    filesChanged: 8,
    linesAdded: 245,
    linesRemoved: 32,
    reviewers: ['johndoe', 'janesmith'],
    score: 92,
    url: 'https://github.com/techcorp/backend-api/pull/123',
    comments: [
      {
        id: '1',
        author: 'johndoe',
        content: 'Great implementation! The middleware is clean and well-documented.',
        sentiment: 'positive',
        date: '2024-01-16',
        isReviewer: true
      },
      {
        id: '2',
        author: 'janesmith',
        content: 'Minor: Consider adding more error handling for edge cases.',
        sentiment: 'neutral',
        date: '2024-01-16',
        isReviewer: true
      }
    ]
  },
  {
    id: '2',
    title: 'Implement dark mode toggle',
    repo: 'techcorp/frontend-app',
    status: 'pending',
    author: 'akshaaybs',
    date: '2024-01-14',
    filesChanged: 12,
    linesAdded: 189,
    linesRemoved: 45,
    reviewers: ['mikewilson'],
    score: 85,
    url: 'https://github.com/techcorp/frontend-app/pull/456',
    comments: [
      {
        id: '3',
        author: 'mikewilson',
        content: 'The color scheme looks good. Need to test on mobile devices.',
        sentiment: 'neutral',
        date: '2024-01-15',
        isReviewer: true
      }
    ]
  },
  {
    id: '3',
    title: 'Fix memory leak in data processing',
    repo: 'techcorp/data-pipeline',
    status: 'rejected',
    author: 'akshaaybs',
    date: '2024-01-12',
    filesChanged: 5,
    linesAdded: 67,
    linesRemoved: 23,
    reviewers: ['sarahconnor'],
    score: 45,
    url: 'https://github.com/techcorp/data-pipeline/pull/789',
    comments: [
      {
        id: '4',
        author: 'sarahconnor',
        content: 'This approach might cause issues with concurrent operations. Please consider using a different pattern.',
        sentiment: 'negative',
        date: '2024-01-13',
        isReviewer: true
      }
    ]
  },
  {
    id: '4',
    title: 'Add comprehensive test suite',
    repo: 'techcorp/utils-lib',
    status: 'accepted',
    author: 'akshaaybs',
    date: '2024-01-10',
    filesChanged: 15,
    linesAdded: 432,
    linesRemoved: 12,
    reviewers: ['alexchen', 'mariagonzalez'],
    score: 95,
    url: 'https://github.com/techcorp/utils-lib/pull/321',
    comments: [
      {
        id: '5',
        author: 'alexchen',
        content: 'Excellent test coverage! This will really help with maintainability.',
        sentiment: 'positive',
        date: '2024-01-11',
        isReviewer: true
      }
    ]
  }
];

export const mockDashboardStats: DashboardStats = {
  totalPRs: 147,
  acceptedPRs: 132,
  rejectedPRs: 12,
  pendingPRs: 3,
  score: 87,
  prData: [
    { date: '2024-01-01', count: 12 },
    { date: '2024-01-02', count: 8 },
    { date: '2024-01-03', count: 15 },
    { date: '2024-01-04', count: 10 },
    { date: '2024-01-05', count: 18 },
    { date: '2024-01-06', count: 14 },
    { date: '2024-01-07', count: 22 },
    { date: '2024-01-08', count: 16 },
    { date: '2024-01-09', count: 19 },
    { date: '2024-01-10', count: 13 },
    { date: '2024-01-11', count: 25 },
    { date: '2024-01-12', count: 20 },
    { date: '2024-01-13', count: 17 },
    { date: '2024-01-14', count: 21 },
    { date: '2024-01-15', count: 24 }
  ]
};