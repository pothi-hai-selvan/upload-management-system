# Deployment Guide for Upload Management System

This guide will walk you through deploying your Upload Management System to Render.

## Prerequisites

1. A GitHub account with your project repository
2. A Render account (free tier available)
3. Your project should be pushed to GitHub

## Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Verify your repository structure**:
   ```
   upload-management/
   ├── backend/
   │   ├── package.json
   │   ├── server.js
   │   └── ...
   ├── frontend/
   │   ├── package.json
   │   ├── vite.config.js
   │   └── ...
   ├── render.yaml
   └── README.md
   ```

## Step 2: Deploy to Render

### Option A: Using render.yaml (Recommended)

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" and select "Blueprint"**
3. **Connect your GitHub repository**
4. **Select your repository**
5. **Render will automatically detect the `render.yaml` file**
6. **Click "Apply" to deploy both services**

### Option B: Manual Deployment

#### Deploy Backend First:

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" and select "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `upload-management-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

5. **Add Environment Variables:**
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: Generate a secure random string
   - `JWT_EXPIRES_IN`: `24h`
   - `PORT`: `10000`
   - `UPLOAD_PATH`: `./uploads`
   - `MAX_FILE_SIZE`: `10485760`
   - `ALLOWED_ORIGINS`: `https://your-frontend-url.onrender.com`

6. **Click "Create Web Service"**

#### Deploy Frontend:

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" and select "Static Site"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `upload-management-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Plan**: Free

5. **Add Environment Variables:**
   - `VITE_API_URL`: `https://your-backend-url.onrender.com`

6. **Click "Create Static Site"**

## Step 3: Update Environment Variables

After deployment, update the environment variables:

### Backend Environment Variables:
```bash
NODE_ENV=production
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRES_IN=24h
PORT=10000
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_ORIGINS=https://your-frontend-url.onrender.com
```

### Frontend Environment Variables:
```bash
VITE_API_URL=https://your-backend-url.onrender.com
```

## Step 4: Test Your Deployment

1. **Test the backend health endpoint**: `https://your-backend-url.onrender.com/health`
2. **Test the frontend**: Navigate to your frontend URL
3. **Test user registration and login**
4. **Test file upload functionality**

## Step 5: Database Setup

The application uses SQLite which will be automatically created. For production, consider:

1. **Using a managed database service** (PostgreSQL on Render)
2. **Setting up database backups**
3. **Monitoring database performance**

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check the build logs in Render dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **CORS Errors**:
   - Update `ALLOWED_ORIGINS` in backend environment variables
   - Ensure frontend URL is correctly set

3. **File Upload Issues**:
   - Check upload directory permissions
   - Verify file size limits
   - Ensure proper CORS configuration

4. **Database Connection Issues**:
   - SQLite file permissions
   - Database path configuration

### Useful Commands:

```bash
# Check backend logs
# Use Render dashboard logs

# Test API endpoints
curl https://your-backend-url.onrender.com/health

# Check frontend build
cd frontend && npm run build
```

## Security Considerations

1. **JWT Secret**: Use a strong, randomly generated secret
2. **Environment Variables**: Never commit sensitive data to Git
3. **CORS**: Restrict origins to your frontend domain only
4. **File Uploads**: Implement proper validation and sanitization
5. **Rate Limiting**: Already configured in the application

## Monitoring and Maintenance

1. **Set up logging**: Monitor application logs in Render dashboard
2. **Performance monitoring**: Use Render's built-in monitoring
3. **Regular updates**: Keep dependencies updated
4. **Backup strategy**: Implement database and file backups

## Support

If you encounter issues:
1. Check Render's documentation
2. Review application logs
3. Test locally first
4. Verify environment variables
5. Check CORS configuration

Your application should now be successfully deployed on Render! 