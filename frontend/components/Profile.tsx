import React, { useState } from 'react';
import { 
  MapPinIcon, 
  BuildingOfficeIcon, 
  CalendarIcon, 
  LinkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  StarIcon,
  EyeIcon,
  HeartIcon,
  EnvelopeIcon,
  ClipboardDocumentIcon,
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { mockUser, mockPRs } from '../data/mockData';
import { format } from 'date-fns';

export default function Profile() {
  const user = mockUser;
  const [currentPage, setCurrentPage] = useState(1);
  const [showTooltip, setShowTooltip] = useState(false);
  const itemsPerPage = 5;
  
  // Calculate stats
  const totalPRs = mockPRs.length;
  const mergedPRs = mockPRs.filter(pr => pr.status === 'accepted').length;
  const rejectedPRs = mockPRs.filter(pr => pr.status === 'rejected').length;
  const openPRs = mockPRs.filter(pr => pr.status === 'pending').length;
  
  const totalLinesAdded = mockPRs.reduce((sum, pr) => sum + pr.linesAdded, 0);
  const totalLinesRemoved = mockPRs.reduce((sum, pr) => sum + pr.linesRemoved, 0);
  
  // Contribution data for charts
  const contributionData = [
    { name: 'Merged', value: mergedPRs, color: '#10B981' },
    { name: 'Open', value: openPRs, color: '#F59E0B' },
    { name: 'Rejected', value: rejectedPRs, color: '#EF4444' }
  ];

  // Sentiment analysis data
  const sentimentData = [
    { sentiment: 'Positive', count: 45, color: '#10B981' },
    { sentiment: 'Neutral', count: 12, color: '#6B7280' },
    { sentiment: 'Negative', count: 3, color: '#EF4444' }
  ];

  // Activity data (mock heatmap data)
  const activityData = Array.from({ length: 52 }, (_, week) => 
    Array.from({ length: 7 }, (_, day) => ({
      week,
      day,
      count: Math.floor(Math.random() * 5),
      date: new Date(2024, 0, week * 7 + day + 1)
    }))
  ).flat();

  // Top repositories
  const topRepos = [
    { name: 'techcorp/backend-api', stars: 1247, prs: 15, languages: ['TypeScript', 'Node.js'], tags: ['Backend', 'API', 'Microservices'] },
    { name: 'techcorp/frontend-app', stars: 892, prs: 12, languages: ['React', 'TypeScript'], tags: ['Frontend', 'React', 'UI/UX'] },
    { name: 'techcorp/data-pipeline', stars: 456, prs: 8, languages: ['Python', 'SQL'], tags: ['Data', 'ETL', 'Analytics'] },
    { name: 'techcorp/utils-lib', stars: 234, prs: 6, languages: ['JavaScript', 'TypeScript'], tags: ['Utils', 'Library', 'NPM'] }
  ];

  // Comment insights
  const commonPraise = [
    'Well-documented functions',
    'Clean code structure',
    'Comprehensive testing',
    'Good error handling',
    'Performance optimization'
  ];

  const commonIssues = [
    'Needs better testing',
    'Style consistency',
    'Error handling',
    'Documentation gaps',
    'Performance concerns'
  ];

  // Paginated PRs
  const paginatedPRs = mockPRs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(mockPRs.length / itemsPerPage);

  const getActivityColor = (count: number) => {
    if (count === 0) return '#F3F4F6';
    if (count <= 1) return '#C6F6D5';
    if (count <= 2) return '#68D391';
    if (count <= 3) return '#38A169';
    return '#2F855A';
  };

  const copyBadgeCode = () => {
    const badgeCode = `![ContribuScore](https://contribuscore.io/badge/${user.username}.svg)`;
    navigator.clipboard.writeText(badgeCode);
  };

  const downloadPDF = () => {
    // In a real app, this would generate and download a PDF
    console.log('Downloading PDF...');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover shadow-lg"
            />
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{user.name}</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">@{user.username}</p>
              <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl">{user.bio}</p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" />
                  {user.location}
                </div>
                <div className="flex items-center gap-1">
                  <BuildingOfficeIcon className="w-4 h-4" />
                  {user.company}
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  Joined {format(new Date(user.joinedDate), 'MMMM yyyy')}
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">ContribuScore</span>
                  <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="text-white/80 hover:text-white"
                  >
                    <InformationCircleIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-3xl font-bold">{user.score}/100</div>
                {showTooltip && (
                  <div className="absolute top-full mt-2 right-0 w-64 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-lg z-10">
                    ContribuScore is calculated based on PR quality, review feedback, contribution consistency, and community impact.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Section 1 - Contribution Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Contribution Summary</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalPRs}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total PRs</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{mergedPRs}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Merged</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{rejectedPRs}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Rejected</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{openPRs}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Open</div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Lines of Code Changed</div>
                <div className="flex items-center gap-4">
                  <span className="text-green-600 dark:text-green-400 font-mono">+{totalLinesAdded.toLocaleString()}</span>
                  <span className="text-red-600 dark:text-red-400 font-mono">-{totalLinesRemoved.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {contributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Section 2 - PR Comment Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">PR Comment Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Common Praise</h3>
              <div className="space-y-2">
                {commonPraise.map((praise, index) => (
                  <div key={index} className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-3 py-2 rounded-lg text-sm">
                    {praise}
                  </div>
                ))}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 mt-6">Areas for Improvement</h3>
              <div className="space-y-2">
                {commonIssues.map((issue, index) => (
                  <div key={index} className="bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 px-3 py-2 rounded-lg text-sm">
                    {issue}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Review Sentiment</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sentimentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="sentiment" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 - Recent Pull Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Pull Requests</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {paginatedPRs.map((pr) => (
              <div key={pr.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pr.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        pr.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        pr.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {pr.status === 'accepted' ? 'Merged' : pr.status === 'rejected' ? 'Closed' : 'Open'}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{pr.repo}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span>{format(new Date(pr.date), 'MMM dd, yyyy')}</span>
                      <span>•</span>
                      <span className="text-green-600">+{pr.linesAdded}</span>
                      <span className="text-red-600">-{pr.linesRemoved}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {pr.comments.length > 0 ? pr.comments[0].content : 'No review comments yet.'}
                    </p>
                  </div>
                  <a
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4 - Top Repositories */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Top Repositories Contributed To</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topRepos.map((repo, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{repo.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-4 h-4" />
                        {repo.stars.toLocaleString()}
                      </div>
                      <span>{repo.prs} PRs</span>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {repo.languages.map((lang, langIndex) => (
                      <span key={langIndex} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 text-xs rounded">
                        {lang}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {repo.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5 - Activity Graph */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Contribution Activity</h2>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-53 gap-1 min-w-max">
              {Array.from({ length: 52 }, (_, week) => (
                <div key={week} className="grid grid-rows-7 gap-1">
                  {Array.from({ length: 7 }, (_, day) => {
                    const activity = activityData.find(a => a.week === week && a.day === day);
                    return (
                      <div
                        key={day}
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: getActivityColor(activity?.count || 0) }}
                        title={`${activity?.count || 0} contributions`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-600"></div>
                <div className="w-3 h-3 rounded-sm bg-green-200"></div>
                <div className="w-3 h-3 rounded-sm bg-green-400"></div>
                <div className="w-3 h-3 rounded-sm bg-green-600"></div>
                <div className="w-3 h-3 rounded-sm bg-green-800"></div>
              </div>
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Section 6 - Resume Badge & Socials */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Share & Export</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resume Badge</h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
                <code className="text-sm text-gray-800 dark:text-gray-200 break-all">
                  ![ContribuScore](https://contribuscore.io/badge/{user.username}.svg)
                </code>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={copyBadgeCode}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <ClipboardDocumentIcon className="w-4 h-4" />
                  Copy Badge
                </button>
                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
              <div className="space-y-3">
                <a
                  href={user.githubUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <LinkIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">GitHub Profile</span>
                </a>
                <button className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">Contact for Opportunities</span>
                </button>
                <button className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full">
                  <HeartIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">Endorse Developer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}