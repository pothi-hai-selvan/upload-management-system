# 🚀 Complete Render Deployment Guide - Frontend, Backend & Database

## 📋 Overview
This guide will help you deploy your Upload Management System on Render with:
- **Backend API** (Node.js + SQLite)
- **Frontend** (React + Vite)
- **Database** (SQLite - embedded with backend)

## 🎯 Prerequisites
- GitHub repository: `pothi-hai-selvan/upload-management-system`
- Render account: https://dashboard.render.com
- All code pushed to GitHub (✅ Already done)

---

## 🗄️ Database Setup

### Current Database Configuration
Your application uses **SQLite** which is embedded with the backend:
- **Database File:** `backend/database.sqlite`
- **Type:** SQLite (file-based, no external setup needed)
- **Location:** Embedded with backend service

### Database Initialization
The database will be automatically created and initialized when the backend starts:
- Default users will be created automatically
- Tables will be created via Sequelize sync
- No manual database setup required

---

## 🔧 Backend Deployment

### Step 1: Create Backend Service
1. Go to https://dashboard.render.com
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository: `pothi-hai-selvan/upload-management-system`

### Step 2: Configure Backend Service
```
Name: upload-management-backend
Root Directory: backend
Build Command: npm install
Start Command: npm start
Environment: Node
Node Version: 20.x
```

### Step 3: Set Environment Variables
Add these environment variables in the backend service:

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Production environment |
| `JWT_SECRET` | `5bd104f850cf8775410f8ad342efe2ea937c481d701acc5f73cfecb99138e4798ae767b10022317f6e24ebf02cdaf6a534d59ad0d53ecedfa997480645e938f6` | JWT signing secret |
| `JWT_EXPIRES_IN` | `24h` | Token expiration time |
| `PORT` | `10000` | Server port (Render will override) |
| `UPLOAD_PATH` | `./uploads` | File upload directory |
| `MAX_FILE_SIZE` | `10485760` | Max file size (10MB) |
| `ALLOWED_ORIGINS` | `https://upload-management-frontend.onrender.com` | CORS allowed origins |

### Step 4: Deploy Backend
1. Click **"Create Web Service"**
2. Wait for deployment to complete (2-3 minutes)
3. Note the backend URL: `https://upload-management-backend.onrender.com`

---

## 🎨 Frontend Deployment

### Step 1: Create Frontend Service
1. Go to https://dashboard.render.com
2. Click **"New"** → **"Static Site"**
3. Connect your GitHub repository: `pothi-hai-selvan/upload-management-system`

### Step 2: Configure Frontend Service
```
Name: upload-management-frontend
Root Directory: frontend
Build Command: npm install --production=false && npm run build
Publish Directory: dist
Environment: Static
```

### Step 3: Set Environment Variables
Add this environment variable in the frontend service:

| Key | Value | Description |
|-----|-------|-------------|
| `VITE_API_URL` | `https://upload-management-backend.onrender.com` | Backend API URL |

### Step 4: Deploy Frontend
1. Click **"Create Static Site"**
2. Wait for deployment to complete (3-5 minutes)
3. Note the frontend URL: `https://upload-management-frontend.onrender.com`

---

## 🔄 Alternative: Blueprint Deployment

### One-Click Deployment
1. Go to https://dashboard.render.com
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository
4. Click **"Apply"**
5. Both services will be deployed automatically

---

## 🧪 Testing Your Deployment

### Test Backend API
```bash
# Health check
curl https://upload-management-backend.onrender.com/health

# Database test
curl https://upload-management-backend.onrender.com/api/test-db

# Root endpoint
curl https://upload-management-backend.onrender.com/
```

### Test Frontend
1. Visit: `https://upload-management-frontend.onrender.com`
2. You should see the login page
3. Test with default users:
   - **Admin:** `admin@gmail.com` / `admin123`
   - **User:** `user@gmail.com` / `user123`
   - **John:** `john@gmail.com` / `john123`

---

## 🗄️ Database Management

### Database Location
- **File:** `backend/database.sqlite`
- **Access:** Through backend API only
- **Backup:** Automatic with Render's file system

### Database Operations
All database operations are handled through the API:
- **User Management:** `/api/auth/*`
- **Document Management:** `/api/documents/*`
- **Messages:** `/api/messages/*`

### Database Reset (if needed)
1. Go to backend service in Render
2. Click **"Environment"**
3. Add environment variable: `RESET_DB=true`
4. Redeploy the service
5. Remove the variable after reset

---

## 🔍 Monitoring & Logs

### View Logs
1. Go to your service in Render dashboard
2. Click **"Logs"** tab
3. Monitor real-time logs

### Health Monitoring
- Backend health: `https://upload-management-backend.onrender.com/health`
- Database status: `https://upload-management-backend.onrender.com/api/test-db`

---

## 🛠️ Troubleshooting

### Common Issues

#### 1. Build Failures
**Problem:** Frontend build fails
**Solution:** 
- Check Node.js version (should be 20.x)
- Verify build command: `npm install --production=false && npm run build`

#### 2. CORS Errors
**Problem:** Frontend can't connect to backend
**Solution:**
- Verify `ALLOWED_ORIGINS` includes frontend URL
- Check `VITE_API_URL` in frontend environment variables

#### 3. Database Connection Issues
**Problem:** Database not working
**Solution:**
- Check backend logs for database errors
- Verify SQLite file permissions
- Ensure backend has write access to database directory

#### 4. File Upload Issues
**Problem:** Can't upload files
**Solution:**
- Check `UPLOAD_PATH` environment variable
- Verify backend has write permissions
- Check `MAX_FILE_SIZE` setting

### Debug Commands
```bash
# Test backend connectivity
curl -X POST https://upload-management-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"admin123"}'

# Test frontend build locally
cd frontend && npm install && npm run build
```

---

## 📊 Service URLs Summary

After successful deployment:

| Service | URL | Purpose |
|---------|-----|---------|
| **Backend API** | `https://upload-management-backend.onrender.com` | API endpoints, database |
| **Frontend App** | `https://upload-management-frontend.onrender.com` | Web interface |
| **Health Check** | `https://upload-management-backend.onrender.com/health` | Service status |
| **Database Test** | `https://upload-management-backend.onrender.com/api/test-db` | Database status |

---

## 🔐 Security Notes

### Environment Variables
- Keep `JWT_SECRET` secure and unique
- Never commit sensitive data to Git
- Use Render's environment variable encryption

### Database Security
- SQLite database is file-based and secure
- Access only through authenticated API endpoints
- Automatic backup with Render's infrastructure

---

## 📞 Support

### Render Support
- Documentation: https://render.com/docs
- Community: https://community.render.com

### Application Support
- Check logs in Render dashboard
- Test endpoints individually
- Verify environment variables

---

## ✅ Deployment Checklist

- [ ] Backend service created and deployed
- [ ] Frontend service created and deployed
- [ ] Environment variables set correctly
- [ ] Backend health check passes
- [ ] Database test endpoint works
- [ ] Frontend loads without errors
- [ ] User login works
- [ ] File upload/download works
- [ ] Messages system works

🎉 **Congratulations! Your Upload Management System is now live on Render!** 