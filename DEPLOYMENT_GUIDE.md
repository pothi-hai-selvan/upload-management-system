# 🚀 Upload Management System - Render Deployment Guide

## 📋 Prerequisites
- GitHub repository: `pothi-hai-selvan/upload-management-system`
- Render account: https://dashboard.render.com

## 🎯 Deployment Options

### Option 1: Blueprint Deployment (Recommended)
1. Go to https://dashboard.render.com
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository
4. Click **"Apply"** to deploy both services automatically

### Option 2: Manual Deployment

#### Step 1: Deploy Backend Service
1. Click **"New"** → **"Web Service"**
2. Connect GitHub repository: `pothi-hai-selvan/upload-management-system`
3. **Configuration:**
   - **Name:** `upload-management-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** `Node`

#### Step 2: Deploy Frontend Service
1. Click **"New"** → **"Static Site"**
2. Connect GitHub repository: `pothi-hai-selvan/upload-management-system`
3. **Configuration:**
   - **Name:** `upload-management-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install --production=false && npm run build`
   - **Publish Directory:** `dist`
   - **Environment:** `Static`

## 🔧 Environment Variables

### Backend Service Environment Variables:
```
NODE_ENV=production
JWT_SECRET=5bd104f850cf8775410f8ad342efe2ea937c481d701acc5f73cfecb99138e4798ae767b10022317f6e24ebf02cdaf6a534d59ad0d53ecedfa997480645e938f6
JWT_EXPIRES_IN=24h
PORT=10000
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_ORIGINS=https://upload-management-frontend.onrender.com
```

### Frontend Service Environment Variables:
```
VITE_API_URL=https://upload-management-backend.onrender.com
```

## 🌐 Service URLs

After deployment, your services will be available at:
- **Backend API:** `https://upload-management-backend.onrender.com`
- **Frontend App:** `https://upload-management-frontend.onrender.com`

## 🔍 Testing Deployment

### Test Backend:
```bash
curl https://upload-management-backend.onrender.com/health
```

### Test Frontend:
Visit: `https://upload-management-frontend.onrender.com`

## 🛠️ Troubleshooting

### Common Issues:
1. **CORS Errors:** Backend automatically allows Render domains
2. **Build Failures:** Check Node.js version (20.x)
3. **Start Command Errors:** Frontend uses static deployment

### Default Users:
- **Admin:** `admin@gmail.com` / `admin123`
- **User:** `user@gmail.com` / `user123`
- **John:** `john@gmail.com` / `john123`

## 📞 Support
If you encounter issues, check the Render logs in the dashboard. 