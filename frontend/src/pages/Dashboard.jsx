import { useState, useEffect } from 'react';
import { documentApi } from '../services/api';
import { Upload, Download, Trash2, FileText, Calendar, User, Plus, FolderOpen, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
// import MessageBox from '../components/MessageBox';

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showMessages, setShowMessages] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await documentApi.getUserDocuments();
      setDocuments(response.data.data.documents);
    } catch (error) {
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setUploading(true);
    try {
      await documentApi.upload(selectedFile);
      toast.success('Document uploaded successfully!');
      setSelectedFile(null);
      fetchDocuments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (document) => {
    try {
      const response = await documentApi.download(document.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.original_filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await documentApi.delete(documentId);
      toast.success('Document deleted successfully!');
      fetchDocuments();
    } catch (error) {
      toast.error('Delete failed');
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-400 mx-auto"></div>
          <p className="text-violet-200 mt-4 text-center">Loading your documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 p-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <FolderOpen className="w-8 h-8 mr-3 text-violet-300" />
                My Documents
              </h1>
              <p className="text-violet-200 text-lg">Manage and organize your uploaded documents</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMessages(!showMessages)}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-out flex items-center space-x-2"
              >
                <MessageSquare className="h-5 w-5" />
                <span>{showMessages ? 'Hide Messages' : 'Messages'}</span>
              </button>
              <div className="text-right">
                <div className="text-3xl font-bold text-violet-300">{documents.length}</div>
                <div className="text-violet-200 text-sm">Documents</div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Section */}
        {/* {showMessages && <MessageBox />} */}

        {/* Upload Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Upload className="w-6 h-6 mr-3 text-violet-300" />
            Upload New Document
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-violet-200 mb-3">
                Select File
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt"
                  className="w-full pl-4 pr-4 py-4 bg-white/10 border border-violet-300/30 rounded-xl text-white placeholder-violet-300/70 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-500 file:text-white hover:file:bg-violet-600 file:cursor-pointer"
                />
              </div>
              <p className="text-sm text-violet-300 mt-2">
                Supported formats: PDF, Images (JPG, PNG, GIF), Documents (DOC, DOCX), Text files. Max size: 10MB
              </p>
            </div>
            
            {selectedFile && (
              <div className="flex items-center space-x-3 text-sm text-violet-200 bg-white/10 rounded-xl p-4">
                <FileText className="h-5 w-5 text-violet-300" />
                <span className="font-medium">{selectedFile.name}</span>
                <span className="text-violet-300">({formatFileSize(selectedFile.size)})</span>
              </div>
            )}
            
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>Upload Document</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <FileText className="w-6 h-6 mr-3 text-violet-300" />
            Your Documents
          </h2>
          
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-6">
                <FileText className="h-12 w-12 text-violet-300" />
              </div>
              <p className="text-violet-200 text-lg mb-2">No documents uploaded yet</p>
              <p className="text-violet-300">Upload your first document to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-lg">{doc.original_filename}</h3>
                        <div className="flex items-center space-x-4 text-sm text-violet-200 mt-1">
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-violet-400 rounded-full mr-2"></span>
                            {formatFileSize(doc.file_size)}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(doc.upload_date)}
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
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-out flex items-center space-x-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 