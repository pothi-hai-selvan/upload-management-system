import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Upload, FileText, Search, Shield, Crown, FolderOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const navigation = isAdmin ? [
    { name: 'Admin Dashboard', href: '/dashboard', icon: Search },
  ] : [
    { name: 'My Documents', href: '/dashboard', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                  {isAdmin ? (
                    <Shield className="h-6 w-6 text-white" />
                  ) : (
                    <FolderOpen className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Docify
                  </h1>
                  <p className="text-violet-200 text-sm">
                    {isAdmin ? 'Administrative Panel' : 'Document Management'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{user?.name}</div>
                  <div className="flex items-center space-x-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-500/20 text-violet-200 border border-violet-400/30">
                      {isAdmin ? (
                        <>
                          <Crown className="h-3 w-3 mr-1 text-yellow-400" />
                          Admin
                        </>
                      ) : (
                        'User'
                      )}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-violet-200 hover:text-white transition-colors duration-200 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20 hover:bg-white/20"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
              <nav className="space-y-3">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
                          : 'text-violet-200 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 