# 📁 Upload Management System

A modern, full-stack document upload and management system with user authentication, admin panel, and messaging capabilities.

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration & Login** - Secure user authentication
- **Admin Panel** - Separate admin interface with elevated privileges
- **JWT Token Authentication** - Secure session management
- **Role-based Access Control** - User and admin roles

### 📄 Document Management
- **File Upload** - Support for multiple file types (PDF, Images, Documents, Text)
- **File Download** - Secure file downloading with proper permissions
- **File Organization** - User-specific document libraries
- **File Metadata** - Track file size, upload date, and type
- **Admin Document Access** - Admins can view and download any user's documents

### 💬 Messaging System
- **User-Admin Communication** - Direct messaging between users and admin
- **Message Priority Levels** - Low, Medium, High, Urgent
- **Read/Unread Status** - Track message status
- **Admin Broadcast** - Send announcements to all users
- **Message History** - View sent and received messages

### 🎨 Modern UI/UX
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Theme** - Beautiful gradient design with glassmorphism effects
- **Real-time Updates** - Live timestamps and activity indicators
- **Interactive Elements** - Hover effects, animations, and smooth transitions

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing
- **React Hot Toast** - Toast notifications
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Sequelize** - ORM for database management
- **SQLite** - Lightweight database
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload middleware
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd upload-management
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # In backend directory, create config.env
   cd ../backend
   cp config.env.example config.env
   ```
   
   Edit `backend/config.env`:
   ```env
   JWT_SECRET=your-secret-key-here
   JWT_EXPIRES_IN=24h
   NODE_ENV=development
   PORT=3000
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   ```

4. **Initialize the database**
   ```bash
   cd backend
   node scripts/init-db.js
   node scripts/add-admin.js
   node scripts/init-messages.js
   ```

5. **Start the servers**
   ```bash
   # Start backend server (in backend directory)
   npm start

   # Start frontend server (in frontend directory, new terminal)
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 👥 Default Users

### Admin Account
- **Email**: admin@gmail.com
- **Password**: admin123
- **Role**: Admin

### User Account
- **Email**: user@gmail.com
- **Password**: 123
- **Role**: User

## 📁 Project Structure

```
upload-management/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── documentController.js
│   │   └── messageController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Document.js
│   │   ├── Message.js
│   │   └── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── documents.js
│   │   └── messages.js
│   ├── scripts/
│   │   ├── init-db.js
│   │   ├── add-admin.js
│   │   └── init-messages.js
│   ├── uploads/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── MessageBox.jsx
│   │   │   └── AdminMessageBox.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── UserLogin.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── .gitignore
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/admin-users` - Get admin users

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/my-documents` - Get user's documents
- `GET /api/documents/download/:id` - Download document
- `DELETE /api/documents/:id` - Delete document
- `POST /api/documents/admin/user-documents` - Get user documents (admin)
- `GET /api/documents/admin/all-documents` - Get all documents (admin)

### Messages
- `POST /api/messages/send` - Send message
- `GET /api/messages/inbox` - Get inbox
- `GET /api/messages/sent` - Get sent messages
- `GET /api/messages/:id` - Get specific message
- `PATCH /api/messages/:id/read` - Mark as read
- `DELETE /api/messages/:id` - Delete message
- `GET /api/messages/admin/all` - Get all messages (admin)
- `POST /api/messages/admin/broadcast` - Send broadcast (admin)

## 🎯 Usage

### For Users
1. **Register/Login** - Create an account or login
2. **Upload Documents** - Upload files from the dashboard
3. **Manage Documents** - View, download, and delete your documents
4. **Send Messages** - Communicate with admin through the messaging system

### For Admins
1. **Admin Login** - Login with admin credentials
2. **View All Documents** - Access any user's document library
3. **Manage Messages** - View and reply to user messages
4. **Send Broadcasts** - Send announcements to all users
5. **Monitor Activity** - Track uploads and user activity

## 🔒 Security Features

- **Password Hashing** - bcryptjs for secure password storage
- **JWT Authentication** - Secure token-based authentication
- **File Type Validation** - Only allowed file types can be uploaded
- **File Size Limits** - Configurable file size restrictions
- **CORS Protection** - Cross-origin request protection
- **Helmet Security** - Security headers and protection
- **Rate Limiting** - API rate limiting to prevent abuse

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables for production
2. Use a production database (PostgreSQL, MySQL)
3. Set up proper file storage (AWS S3, Google Cloud Storage)
4. Configure reverse proxy (Nginx)
5. Use PM2 for process management

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, AWS S3)
3. Configure environment variables
4. Set up custom domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**Built with ❤️ using React, Node.js, and Express** 