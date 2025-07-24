# ⚡ Quick Deploy Reference Card

## 🚀 One-Click Deployment (Recommended)
1. Go to https://dashboard.render.com
2. Click **"New"** → **"Blueprint"**
3. Connect: `pothi-hai-selvan/upload-management-system`
4. Click **"Apply"**

---

## 🔧 Manual Deployment

### Backend Service
```
Type: Web Service
Name: upload-management-backend
Root Dir: backend
Build: npm install
Start: npm start
```

**Environment Variables:**
```
NODE_ENV=production
JWT_SECRET=5bd104f850cf8775410f8ad342efe2ea937c481d701acc5f73cfecb99138e4798ae767b10022317f6e24ebf02cdaf6a534d59ad0d53ecedfa997480645e938f6
JWT_EXPIRES_IN=24h
PORT=10000
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_ORIGINS=https://upload-management-frontend.onrender.com
```

### Frontend Service
```
Type: Static Site
Name: upload-management-frontend
Root Dir: frontend
Build: npm install --production=false && npm run build
Publish: dist
```

**Environment Variables:**
```
VITE_API_URL=https://upload-management-backend.onrender.com
```

---

## 🗄️ Database Info
- **Type:** SQLite (embedded)
- **File:** `backend/database.sqlite`
- **Auto-initialized:** Yes
- **Default Users:** Created automatically

---

## 🧪 Quick Test
```bash
# Backend Health
curl https://upload-management-backend.onrender.com/health

# Database Test
curl https://upload-management-backend.onrender.com/api/test-db

# Frontend
https://upload-management-frontend.onrender.com
```

---

## 👤 Default Users
- **Admin:** `admin@gmail.com` / `admin123`
- **User:** `user@gmail.com` / `user123`
- **John:** `john@gmail.com` / `john123`

---

## 📞 URLs After Deployment
- **Backend:** `https://upload-management-backend.onrender.com`
- **Frontend:** `https://upload-management-frontend.onrender.com` 