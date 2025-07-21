import React, { useState, useEffect } from 'react';
import { 
  LightBulbIcon, 
  CheckIcon, 
  XMarkIcon, 
  PencilIcon,
  CodeBracketIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  GitBranchIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import Editor from '@monaco-editor/react';
import clsx from 'clsx';

interface CodeSuggestion {
  id: string;
  line: number;
  type: 'improvement' | 'bug' | 'style' | 'performance';
  title: string;
  description: string;
  originalCode: string;
  suggestedCode: string;
  confidence: number;
  applied: boolean;
}

interface CodeFile {
  name: string;
  language: string;
  content: string;
}

export default function CodeReviewAnalysis() {
  const { theme } = useTheme();
  const [activeFile, setActiveFile] = useState(0);
  const [viewMode, setViewMode] = useState<'editor' | 'diff'>('editor');
  const [autoApplySuggestions, setAutoApplySuggestions] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data - in real app this would come from props or API
  const [codeFiles] = useState<CodeFile[]>([
    {
      name: 'src/components/UserAuth.tsx',
      language: 'typescript',
      content: `import React, { useState } from 'react';
import { validateEmail } from '../utils/validation';

interface UserAuthProps {
  onLogin: (user: User) => void;
}

export const UserAuth: React.FC<UserAuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Add proper validation
    if (!email || !password) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const user = await response.json();
      onLogin(user);
    } catch (error) {
      console.log('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};`
    }
  ]);

  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([
    {
      id: '1',
      line: 16,
      type: 'improvement',
      title: 'Replace alert with proper error handling',
      description: 'Using alert() is not user-friendly. Consider using a toast notification or error state.',
      originalCode: `    if (!email || !password) {
      alert('Please fill all fields');
      return;
    }`,
      suggestedCode: `    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }`,
      confidence: 95,
      applied: false
    },
    {
      id: '2',
      line: 14,
      type: 'bug',
      title: 'Add email validation',
      description: 'Email validation is imported but not used. This could lead to invalid email submissions.',
      originalCode: `    // TODO: Add proper validation
    if (!email || !password) {`,
      suggestedCode: `    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!email || !password) {`,
      confidence: 88,
      applied: false
    },
    {
      id: '3',
      line: 30,
      type: 'improvement',
      title: 'Improve error handling',
      description: 'Console.log for errors is not ideal for production. Consider proper error reporting.',
      originalCode: `      console.log('Login failed:', error);`,
      suggestedCode: `      setError('Login failed. Please try again.');
      console.error('Login failed:', error);`,
      confidence: 92,
      applied: false
    },
    {
      id: '4',
      line: 37,
      type: 'style',
      title: 'Add proper form styling and accessibility',
      description: 'Form inputs lack proper styling, labels, and accessibility attributes.',
      originalCode: `      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />`,
      suggestedCode: `      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>`,
      confidence: 85,
      applied: false
    }
  ]);

  const [modifiedCode, setModifiedCode] = useState(codeFiles[activeFile]?.content || '');

  useEffect(() => {
    setModifiedCode(codeFiles[activeFile]?.content || '');
  }, [activeFile, codeFiles]);

  const applySuggestion = (suggestionId: string) => {
    setSuggestions(prev => 
      prev.map(s => s.id === suggestionId ? { ...s, applied: true } : s)
    );

    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      const newCode = modifiedCode.replace(suggestion.originalCode, suggestion.suggestedCode);
      setModifiedCode(newCode);
    }
  };

  const revertSuggestion = (suggestionId: string) => {
    setSuggestions(prev => 
      prev.map(s => s.id === suggestionId ? { ...s, applied: false } : s)
    );

    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      const newCode = modifiedCode.replace(suggestion.suggestedCode, suggestion.originalCode);
      setModifiedCode(newCode);
    }
  };

  const applyAllSuggestions = () => {
    setIsProcessing(true);
    setTimeout(() => {
      let newCode = modifiedCode;
      suggestions.forEach(suggestion => {
        if (!suggestion.applied) {
          newCode = newCode.replace(suggestion.originalCode, suggestion.suggestedCode);
        }
      });
      setModifiedCode(newCode);
      setSuggestions(prev => prev.map(s => ({ ...s, applied: true })));
      setIsProcessing(false);
    }, 1500);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'improvement': return LightBulbIcon;
      case 'bug': return XMarkIcon;
      case 'style': return PencilIcon;
      case 'performance': return ArrowPathIcon;
      default: return LightBulbIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'improvement': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900';
      case 'bug': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
      case 'style': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900';
      case 'performance': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const createPullRequest = () => {
    // In real app, this would create a PR with the modified code
    console.log('Creating PR with modified code:', modifiedCode);
    alert('Pull Request created successfully! 🎉');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <SparklesIcon className="w-8 h-8 text-blue-600" />
                AI Code Review Analysis
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Review AI suggestions and improve your code quality
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Auto Apply Toggle */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Auto Apply Suggestions
                </span>
                <button
                  onClick={() => setAutoApplySuggestions(!autoApplySuggestions)}
                  className={clsx(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    autoApplySuggestions 
                      ? "bg-blue-600" 
                      : "bg-gray-200 dark:bg-gray-700"
                  )}
                >
                  <span
                    className={clsx(
                      "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                      autoApplySuggestions ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
              
              {/* Apply All Button */}
              <button
                onClick={applyAllSuggestions}
                disabled={isProcessing || suggestions.every(s => s.applied)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                {isProcessing ? (
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckIcon className="w-4 h-4" />
                )}
                Apply All
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Panel - Suggestions */}
          <div className="xl:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <LightBulbIcon className="w-5 h-5 text-yellow-500" />
                  AI Suggestions ({suggestions.length})
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('editor')}
                    className={clsx(
                      "p-2 rounded-lg transition-colors",
                      viewMode === 'editor' 
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    )}
                  >
                    <CodeBracketIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('diff')}
                    className={clsx(
                      "p-2 rounded-lg transition-colors",
                      viewMode === 'diff' 
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    )}
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {suggestions.map((suggestion) => {
                  const TypeIcon = getTypeIcon(suggestion.type);
                  return (
                    <div
                      key={suggestion.id}
                      className={clsx(
                        "p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md",
                        suggestion.applied
                          ? "border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700"
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={clsx("p-1.5 rounded-lg", getTypeColor(suggestion.type))}>
                            <TypeIcon className="w-4 h-4" />
                          </div>
                          <span className={clsx("text-xs px-2 py-1 rounded-full font-medium", getTypeColor(suggestion.type))}>
                            {suggestion.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {suggestion.confidence}%
                          </span>
                          <div className="w-12 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${suggestion.confidence}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {suggestion.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {suggestion.description}
                      </p>

                      <div className="flex gap-2">
                        {!suggestion.applied ? (
                          <button
                            onClick={() => applySuggestion(suggestion.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors"
                          >
                            <CheckIcon className="w-3 h-3" />
                            Apply
                          </button>
                        ) : (
                          <button
                            onClick={() => revertSuggestion(suggestion.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg font-medium transition-colors"
                          >
                            <XMarkIcon className="w-3 h-3" />
                            Revert
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="xl:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              {/* File Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {codeFiles.map((file, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveFile(index)}
                        className={clsx(
                          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          activeFile === index
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                            : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                        )}
                      >
                        <DocumentDuplicateIcon className="w-4 h-4" />
                        {file.name}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {suggestions.filter(s => s.applied).length} of {suggestions.length} applied
                    </span>
                  </div>
                </div>
              </div>

              {/* Code Editor */}
              <div className="h-96">
                <Editor
                  height="100%"
                  language={codeFiles[activeFile]?.language || 'typescript'}
                  value={modifiedCode}
                  onChange={(value) => setModifiedCode(value || '')}
                  theme={theme === 'dark' ? 'vs-dark' : 'light'}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 }
                  }}
                />
              </div>

              {/* Action Bar */}
              <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <AdjustmentsHorizontalIcon className="w-4 h-4" />
                      <span>{suggestions.filter(s => s.applied).length} suggestions applied</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CodeBracketIcon className="w-4 h-4" />
                      <span>{modifiedCode.split('\n').length} lines</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={createPullRequest}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <GitBranchIcon className="w-5 h-5" />
                    Create Pull Request
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <LightBulbIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {suggestions.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total Suggestions
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {suggestions.filter(s => s.applied).length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Applied
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(suggestions.reduce((acc, s) => acc + s.confidence, 0) / suggestions.length)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Avg Confidence
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}