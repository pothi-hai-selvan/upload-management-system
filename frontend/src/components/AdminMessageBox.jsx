import { useState, useEffect } from 'react';
import { messageApi } from '../services/api';
import { Send, MessageSquare, Inbox, Mail, Trash2, Eye, Clock, Users, Broadcast, Reply } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMessageBox() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [replyData, setReplyData] = useState({
    subject: '',
    content: '',
    priority: 'medium'
  });
  const [broadcastData, setBroadcastData] = useState({
    subject: '',
    content: '',
    priority: 'medium'
  });

  useEffect(() => {
    fetchMessages();
  }, [activeTab]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await messageApi.getAllMessages();
      setMessages(response.data.data.messages);
    } catch (error) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!selectedMessage) return;

    setLoading(true);
    try {
      await messageApi.sendMessage({
        receiver_id: selectedMessage.sender_id,
        subject: replyData.subject,
        content: replyData.content,
        priority: replyData.priority,
        message_type: 'admin_to_user'
      });

      toast.success('Reply sent successfully!');
      setReplyData({ subject: '', content: '', priority: 'medium' });
      fetchMessages();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await messageApi.sendBroadcast(broadcastData);
      toast.success('Broadcast message sent successfully!');
      setBroadcastData({ subject: '', content: '', priority: 'medium' });
      setActiveTab('inbox');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send broadcast');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, formType) => {
    const data = formType === 'reply' ? replyData : broadcastData;
    const setData = formType === 'reply' ? setReplyData : setBroadcastData;
    
    setData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const viewMessage = async (messageId) => {
    try {
      const response = await messageApi.getMessage(messageId);
      setSelectedMessage(response.data.data.message);
      
      // Auto-fill reply subject
      setReplyData(prev => ({
        ...prev,
        subject: `Re: ${response.data.data.message.subject}`
      }));
    } catch (error) {
      toast.error('Failed to load message');
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await messageApi.deleteMessage(messageId);
      toast.success('Message deleted');
      fetchMessages();
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-100';
      case 'high': return 'text-orange-500 bg-orange-100';
      case 'medium': return 'text-blue-500 bg-blue-100';
      case 'low': return 'text-green-500 bg-green-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getUnreadCount = () => {
    return messages.filter(msg => !msg.is_read).length;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <MessageSquare className="w-6 h-6 mr-3 text-violet-300" />
        Admin Messages
        {getUnreadCount() > 0 && (
          <span className="ml-3 px-2 py-1 bg-red-500 text-white text-sm rounded-full">
            {getUnreadCount()} unread
          </span>
        )}
      </h2>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-white/10 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'inbox'
              ? 'bg-violet-600 text-white shadow-lg'
              : 'text-violet-200 hover:text-white'
          }`}
        >
          <Inbox className="w-4 h-4 inline mr-2" />
          Inbox
        </button>
        <button
          onClick={() => setActiveTab('broadcast')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === 'broadcast'
              ? 'bg-violet-600 text-white shadow-lg'
              : 'text-violet-200 hover:text-white'
          }`}
        >
          <Broadcast className="w-4 h-4 inline mr-2" />
          Broadcast
        </button>
      </div>

      {/* Broadcast Tab */}
      {activeTab === 'broadcast' && (
        <form onSubmit={handleBroadcast} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-violet-200 mb-2">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={broadcastData.subject}
              onChange={(e) => handleChange(e, 'broadcast')}
              required
              className="w-full px-4 py-3 bg-white/10 border border-violet-300/30 rounded-xl text-white placeholder-violet-300/70 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter broadcast subject"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-violet-200 mb-2">
              Priority
            </label>
            <select
              name="priority"
              value={broadcastData.priority}
              onChange={(e) => handleChange(e, 'broadcast')}
              className="w-full px-4 py-3 bg-white/10 border border-violet-300/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
            >
              <option value="low" className="bg-violet-900">Low</option>
              <option value="medium" className="bg-violet-900">Medium</option>
              <option value="high" className="bg-violet-900">High</option>
              <option value="urgent" className="bg-violet-900">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-violet-200 mb-2">
              Message
            </label>
            <textarea
              name="content"
              value={broadcastData.content}
              onChange={(e) => handleChange(e, 'broadcast')}
              required
              rows={6}
              className="w-full px-4 py-3 bg-white/10 border border-violet-300/30 rounded-xl text-white placeholder-violet-300/70 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Type your broadcast message here..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Sending Broadcast...</span>
              </>
            ) : (
              <>
                <Broadcast className="h-5 w-5" />
                <span>Send Broadcast to All Users</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Inbox Tab */}
      {activeTab === 'inbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">
              User Messages
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-400 mx-auto"></div>
                <p className="text-violet-200 mt-2">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-violet-300 mx-auto mb-4" />
                <p className="text-violet-200">No messages found</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => viewMessage(message.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedMessage?.id === message.id
                        ? 'bg-violet-600/30 border border-violet-400'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm truncate">
                          {message.subject}
                        </h4>
                        <p className="text-violet-200 text-xs mt-1">
                          From: {message.sender?.name} ({message.sender?.email})
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                            {message.priority}
                          </span>
                          {!message.is_read && (
                            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-violet-300 text-xs">
                          {formatDate(message.created_at)}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMessage(message.id);
                          }}
                          className="mt-2 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Detail and Reply */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="space-y-6">
                {/* Message Detail */}
                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {selectedMessage.subject}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-violet-200">
                        <span>
                          From: {selectedMessage.sender?.name} ({selectedMessage.sender?.email})
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedMessage.priority)}`}>
                        {selectedMessage.priority}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4 mb-4">
                    <p className="text-white whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-violet-300">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(selectedMessage.created_at)}
                      </span>
                      {selectedMessage.is_read && (
                        <span className="flex items-center text-green-400">
                          <Eye className="w-4 h-4 mr-1" />
                          Read
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reply Form */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Reply className="w-5 h-5 mr-2" />
                    Reply to User
                  </h4>
                  
                  <form onSubmit={handleReply} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-violet-200 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={replyData.subject}
                        onChange={(e) => handleChange(e, 'reply')}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-violet-300/30 rounded-xl text-white placeholder-violet-300/70 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter reply subject"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-violet-200 mb-2">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={replyData.priority}
                        onChange={(e) => handleChange(e, 'reply')}
                        className="w-full px-4 py-3 bg-white/10 border border-violet-300/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="low" className="bg-violet-900">Low</option>
                        <option value="medium" className="bg-violet-900">Medium</option>
                        <option value="high" className="bg-violet-900">High</option>
                        <option value="urgent" className="bg-violet-900">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-violet-200 mb-2">
                        Reply Message
                      </label>
                      <textarea
                        name="content"
                        value={replyData.content}
                        onChange={(e) => handleChange(e, 'reply')}
                        required
                        rows={4}
                        className="w-full px-4 py-3 bg-white/10 border border-violet-300/30 rounded-xl text-white placeholder-violet-300/70 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Type your reply here..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Sending Reply...</span>
                        </>
                      ) : (
                        <>
                          <Reply className="h-5 w-5" />
                          <span>Send Reply</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl p-6 flex items-center justify-center h-64">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-violet-300 mx-auto mb-4" />
                  <p className="text-violet-200">Select a message to view details and reply</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 