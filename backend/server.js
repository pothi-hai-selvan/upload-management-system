const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// Load environment variables - only load config.env if it exists (for local development)
try {
  require('dotenv').config({ path: './config.env' });
} catch (error) {
  console.log('No config.env file found, using environment variables from system');
}

const { connectDB } = require('./config/database');
const { User } = require('./models');
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const messageRoutes = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 3000;
console.log('Environment PORT:', process.env.PORT);
console.log('Using PORT:', PORT);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// CORS configuration for production
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'];

// Add common Render domains to allowed origins
const renderDomains = [
  'https://upload-management-frontend.onrender.com',
  'https://upload-management-frontend-web.onrender.com',
  'https://upload-management-system.onrender.com'
];

const allAllowedOrigins = [...allowedOrigins, ...renderDomains];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all localhost origins for development
    if (process.env.NODE_ENV === 'development' && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      return callback(null, true);
    }
    
    // Allow Render domains
    if (origin.includes('onrender.com')) {
      return callback(null, true);
    }
    
    if (allAllowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/messages', messageRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: process.env.NODE_ENV
  });
});

// Database test endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const userCount = await User.count();
    res.json({
      success: true,
      message: 'Database test successful',
      userCount: userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      message: 'Database test failed',
      error: error.message
    });
  }
});

// Root endpoint for Render health checks
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Upload Management System API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  
  if (error.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: error.message
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Initialize database with default users
const initializeDatabase = async () => {
  try {
    console.log('Initializing database with default users...');
    
    // Test users data
    const users = [
      {
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        name: 'Test User',
        email: 'user@gmail.com',
        password: 'user123',
        role: 'user'
      },
      {
        name: 'John Doe',
        email: 'john@gmail.com',
        password: 'john123',
        role: 'user'
      }
    ];

    for (const userData of users) {
      // Check if user already exists
      const existingUser = await User.findOne({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`User already exists: ${userData.email}`);
      } else {
        console.log(`Creating user: ${userData.email}`);
        await User.create(userData);
      }
    }

    const userCount = await User.count();
    console.log(`Database initialized with ${userCount} users`);
    
  } catch (error) {
    console.error('Error initializing database:', error);
    // Don't exit, just log the error
  }
};

// Start server
const startServer = async () => {
  try {
    console.log('Starting server initialization...');
    
    // Connect to database
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');
    
    // Initialize database with default users
    await initializeDatabase();
    
    // Start listening
    console.log('Starting HTTP server...');
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Binding to: 0.0.0.0:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Server is ready to accept connections`);
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 