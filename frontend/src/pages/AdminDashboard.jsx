import { useState, useEffect, useCallback } from 'react';
import { documentApi } from '../services/api';
import { Search, Download, FileText, Calendar, User, Mail, Shield, Crown, Users, Database, Clock, Activity, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
// import AdminMessageBox from '../components/AdminMessageBox';

export default function AdminDashboard() {
  const [searchType, setSearchType] = useState('email');
  const [searchValue, setSearchValue] = useState('');
  const [searching, setSearching] = useState(false);
  const [userData, setUserData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [allDocuments, setAllDocuments] = useState([]); // NEW: all docs
  const [showBoard, setShowBoard] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastActivity, setLastActivity] = useState(null);
  const [showMessages, setShowMessages] = useState(false);

  // Fetch all documents on mount
  useEffect(() => {
    fetchAllDocuments();
  }, []);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update last activity when documents change
  useEffect(() => {
    if (documents.length > 0) {
      const latestDoc = documents.reduce((latest, doc) => {
        return new Date(doc.upload_date) > new Date(latest.upload_date) ? doc : latest;
      });
      setLastActivity(latestDoc.upload_date);
    }
  }, [documents]);

  const fetchAllDocuments = async () => {
    try {
      // You may need to adjust this endpoint to your backend route for all documents
      const response = await documentApi.getAllDocuments();
      setAllDocuments(response.data.data.documents);
      setDocuments(response.data.data.documents);
      setUserData(null);
    } catch (error) {
      toast.error('Failed to fetch all documents');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchValue.trim()) {
      toast.error('Please enter a search value');
      return;
    }

    setSearching(true);
    try {
      const response = await documentApi.getDocumentsByUser(
        searchType === 'userId' ? parseInt(searchValue) : null,
        searchType === 'email' ? searchValue : null
      );
      
      const { user, documents } = response.data.data;
      setUserData(user);
      setDocuments(documents);
      
      if (documents.length === 0) {
        toast.info('No documents found for this user');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Search failed');
      setUserData(null);
      setDocuments([]);
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setUserData(null);
    setDocuments(allDocuments);
    setSearchValue('');
  };

  const handleDownload = async (doc) => {
    try {
      console.log('Starting download for document:', doc);
      
      const response = await documentApi.download(doc.id);
      console.log('Download response received:', response);
      
      // Create blob from response data
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || doc.mime_type 
      });
      
      console.log('Blob created:', blob);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.original_filename);
      link.style.display = 'none';
      
      // Add to DOM and trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast.success('Download started successfully!');
      
    } catch (error) {
      console.error('Download error:', error);
      console.error('Error response:', error.response);
      
      if (error.response?.status === 404) {
        toast.error('Document not found on server');
      } else if (error.response?.status === 403) {
        toast.error('Access denied to this document');
      } else if (error.response?.status === 500) {
        toast.error('Server error during download');
      } else {
        toast.error(`Download failed: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    // Format for display
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Add relative time
    let relativeTime = '';
    if (diffInMinutes < 1) {
      relativeTime = 'Just now';
    } else if (diffInMinutes < 60) {
      relativeTime = `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      relativeTime = `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      relativeTime = `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      relativeTime = formattedDate;
    }

    return {
      full: formattedDate,
      relative: relativeTime,
      timestamp: date.getTime()
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 p-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Control Buttons */}
        <div className="flex justify-end space-x-4 mb-4">
          <button
            onClick={() => setShowMessages(!showMessages)}
            className={`bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-out flex items-center space-x-2 ${showMessages ? 'opacity-70' : ''}`}
          >
            <MessageSquare className="h-5 w-5" />
            <span>{showMessages ? 'Hide Messages' : 'Messages'}</span>
          </button>
          <button
            onClick={() => setShowBoard((prev) => !prev)}
            className={`bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-out ${showBoard ? 'opacity-70' : ''}`}
          >
            {showBoard ? 'Hide Board' : 'Show Board'}
          </button>
        </div>

        {/* Messages Section */}
        {/* {showMessages && <AdminMessageBox />} */}

        {/* CEO and Board Section (conditionally rendered) */}
        {showBoard && (
          <>
            {/* CEO Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">Mrs. Ramya</h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-400/20 text-yellow-200 border border-yellow-400/30">
                    CEO
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-violet-200 text-lg font-semibold">Welcome to the Admin Board</span>
              </div>
            </div>

            {/* Board Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 mb-4">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-violet-300" />
                Board
              </h2>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Demo Message</h3>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-white">Project Manager</span>
                    <span className="ml-2 text-xs bg-blue-400/20 text-blue-200 px-2 py-0.5 rounded-full border border-blue-400/30">Manager</span>
                  </div>
                </div>
                <p className="text-violet-200 text-base">All systems are running smoothly. Please review the latest document uploads and user activity. Let me know if you need any reports or analytics!</p>
              </div>
            </div>
          </>
        )}

        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <Shield className="w-8 h-8 mr-3 text-violet-300" />
                Admin Dashboard
                <div className="ml-3">
                  <Crown className="w-6 h-6 text-yellow-400" />
                </div>
              </h1>
              <p className="text-violet-200 text-lg">Search and manage user documents</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-violet-300">{documents.length}</div>
              <div className="text-violet-200 text-sm">Documents Found</div>
            </div>
          </div>
          
          {/* Real-time Timestamp Section */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-violet-300" />
                  <span className="text-violet-200 font-medium">Current Time</span>
                </div>
                <div className="text-white font-mono text-lg">
                  {currentTime.toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
                <div className="text-violet-300 text-sm">
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="h-5 w-5 text-green-300" />
                  <span className="text-violet-200 font-medium">Last Upload</span>
                </div>
                <div className="text-white font-mono text-lg">
                  {lastActivity ? formatDate(lastActivity).relative : 'No activity'}
                </div>
                <div className="text-violet-300 text-sm">
                  {lastActivity ? formatDate(lastActivity).full : 'No documents uploaded'}
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-5 w-5 text-blue-300" />
                  <span className="text-violet-200 font-medium">Total Documents</span>
                </div>
                <div className="text-white font-mono text-2xl font-bold">
                  {allDocuments.length}
                </div>
                <div className="text-violet-300 text-sm">
                  Across all users
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Search className="w-6 h-6 mr-3 text-violet-300" />
            Search User Documents
          </h2>
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-violet-200 mb-3">
                  Search Type
                </label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 bg-white/10 border border-violet-300/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="email" className="bg-violet-900">Email</option>
                  <option value="userId" className="bg-violet-900">User ID</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-violet-200 mb-3">
                  Search Value
                </label>
                <input
                  type={searchType === 'userId' ? 'number' : 'email'}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={searchType === 'userId' ? 'Enter User ID' : 'Enter Email'}
                  className="w-full pl-4 pr-4 py-3 bg-white/10 border border-violet-300/30 rounded-xl text-white placeholder-violet-300/70 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={searching}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
              >
                {searching ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    <span>Search Documents</span>
                  </>
                )}
              </button>
              {userData && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-out flex items-center space-x-2"
                >
                  Clear Search
                </button>
              )}
            </div>
          </form>
        </div>

        {/* User Information */}
        {userData && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Users className="w-6 h-6 mr-3 text-violet-300" />
              User Information
            </h2>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{userData.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-violet-200 mt-1">
                      <span className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {userData.email}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-violet-500/20 text-violet-200 border border-violet-400/30">
                    <Database className="h-4 w-4 mr-1" />
                    User ID: {userData.id}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <FileText className="w-6 h-6 mr-3 text-violet-300" />
            {userData ? `User Documents (${documents.length})` : `All Documents (${documents.length})`}
          </h2>
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-6">
                <FileText className="h-12 w-12 text-violet-300" />
              </div>
              <p className="text-violet-200 text-lg mb-2">No documents found{userData ? ' for this user' : ''}</p>
              <p className="text-violet-300">{userData ? "This user hasn't uploaded any documents yet" : 'No documents have been uploaded yet.'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center relative">
                        <FileText className="h-6 w-6 text-white" />
                        {/* Upload timestamp indicator */}
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">{doc.original_filename}</h3>
                        <div className="flex items-center space-x-4 text-sm text-violet-200 mt-1">
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-violet-400 rounded-full mr-2"></span>
                            {formatFileSize(doc.file_size)}
                          </span>
                          <span className="flex items-center group relative">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className="cursor-help" title={formatDate(doc.upload_date).full}>
                              {formatDate(doc.upload_date).relative}
                            </span>
                            <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                              {formatDate(doc.upload_date).full}
                            </div>
                          </span>
                          {/* Upload time badge */}
                          <span className="flex items-center px-2 py-1 bg-green-500/20 text-green-200 text-xs rounded-full border border-green-400/30">
                            <Clock className="h-3 w-3 mr-1" />
                            Uploaded {formatDate(doc.upload_date).relative}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-2 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-out flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        {!userData && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-6">
                <Search className="h-12 w-12 text-violet-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Search for User Documents</h3>
              <p className="text-violet-200 text-lg">
                Enter a user's email or ID to view their uploaded documents.
              </p>
              <p className="text-violet-300 mt-2">
                You can search by email address or user ID to access any user's document library.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 