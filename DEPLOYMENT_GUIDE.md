# 🚀 Deployment Guide - Tiarkhali M.M High School Website

## ⚠️ IMPORTANT: Two-Part Deployment Required

This application has **TWO components** that need separate hosting:

1. **Frontend** (HTML/CSS/JS) - Static files
2. **Backend API** (Node.js/Express) - Server with database

---

## 📋 **Option 1: Netlify (Frontend) + Render.com (Backend)** ✅ RECOMMENDED

### **Step A: Deploy Backend API to Render.com**

1. **Go to Render.com**
   - Visit https://render.com
   - Sign up for free account (use GitHub to connect)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Or manually deploy:
     - Name: `tiarkhali-api`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `node server.js`
     - Plan: **Free**

3. **Configure Environment**
   - No environment variables needed (uses default settings)
   - Render will auto-detect `server.js`

4. **Get Your API URL**
   - After deployment, you'll get a URL like:
   - `https://tiarkhali-api.onrender.com`
   - **COPY THIS URL** - you'll need it!

---

### **Step B: Update Frontend API Configuration**

1. **Open `src/utils/api.js`**

2. **Find the line** (around line 6):
   ```javascript
   const BASE = '/api';
   ```

3. **Replace with**:
   ```javascript
   const isDevelopment = window.location.hostname === 'localhost';
   const BASE = isDevelopment ? '/api' : 'https://YOUR-RENDER-URL.onrender.com/api';
   ```
   **IMPORTANT:** Replace `YOUR-RENDER-URL` with your actual Render.com URL!

4. **Save the file**

---

### **Step C: Deploy Frontend to Netlify**

1. **Build Your Project**
   ```bash
   npm run build
   ```
   This creates a `dist` folder with optimized files

2. **Go to Netlify**
   - Visit https://netlify.com
   - Sign up for free account

3. **Deploy Methods:**

   **Method 1: Drag & Drop (Easiest)**
   - Go to Netlify Dashboard
   - Drag the `dist` folder onto the deployment area
   - Done! ✅

   **Method 2: GitHub Integration**
   - Connect GitHub repository
   - Configure:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Deploy

4. **Configure Netlify**
   - The `netlify.toml` file is already configured
   - It handles SPA routing automatically

5. **Get Your Site URL**
   - Netlify provides: `https://your-site-name.netlify.app`
   - You can customize the subdomain or add custom domain

---

## 🔧 **Configuration Files Explained**

### `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/app.html"
  status = 200
```
- Builds the project
- Serves from `dist` folder
- Handles SPA routing

### `render.yaml`
```yaml
services:
  - type: web
    name: tiarkhali-api
    env: node
    startCommand: node server.js
```
- Configures Node.js server
- Auto-restarts on changes
- Free tier available

---

## 📱 **Option 2: Vercel (Both Frontend + Backend)** 

Vercel supports both static sites AND serverless functions.

### **Deploy to Vercel:**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure**
   - Framework: `Other`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Move Backend to Serverless**
   - Create `api/` folder
   - Move `server.js` endpoints to serverless functions
   - Requires code refactoring

---

## 🐳 **Option 3: Railway.app (Full Stack Hosting)**

Railway supports Node.js apps with databases.

1. **Go to Railway.app**
   - Visit https://railway.app
   - Sign up with GitHub

2. **New Project**
   - "New Project" → "Deploy from GitHub"
   - Select your repository

3. **Configure**
   - Railway auto-detects Node.js
   - Runs `npm start` automatically
   - Both frontend and backend hosted together

4. **Get URL**
   - Railway provides: `https://your-app.up.railway.app`

---

## ⚙️ **Environment Variables (If Needed)**

If you add features requiring API keys:

### Netlify
```bash
netlify env:set API_URL https://your-api.onrender.com
```

### Render.com
- Go to service → Environment
- Add key-value pairs

### Vercel
```bash
vercel env add API_URL
```

---

## 🔐 **Security Considerations**

### Before Deploying:

1. **Update CORS Settings** in `server.js`:
   ```javascript
   app.use(cors({
     origin: ['https://your-netlify-site.netlify.app', 'http://localhost:5173'],
     credentials: true
   }));
   ```

2. **Add Environment Variables** for sensitive data:
   - Email API keys
   - Database credentials (when you add a real DB)

3. **Use HTTPS** - Both Netlify and Render provide free SSL

---

## 📊 **Expected Deployment Costs**

| Service | Frontend | Backend | Database | Total |
|---------|----------|---------|----------|-------|
| **Netlify + Render** | FREE | FREE | FREE (JSON files) | $0/month |
| **Vercel** | FREE | FREE | FREE | $0/month |
| **Railway** | FREE | FREE | FREE (500 hours) | $0/month |

**All options support custom domains!**

---

## 🚀 **Quick Deploy Commands**

### Build Production
```bash
npm run build
```

### Test Production Build Locally
```bash
npm run preview
```

### Start Development
```bash
npm run dev          # Frontend (port 5173)
npm run server       # Backend (port 3001)
```

Or use the batch file:
```bash
START_BOTH.bat
```

---

## 📝 **Post-Deployment Checklist**

- [ ] Backend API deployed and accessible
- [ ] Frontend deployed and loading
- [ ] API URL updated in `api.js`
- [ ] CORS configured correctly
- [ ] Test login functionality
- [ ] Test data persistence
- [ ] Test all user roles (student, teacher, staff, alumni, admin)
- [ ] Mobile responsiveness working
- [ ] Custom domain configured (optional)

---

## 🆘 **Troubleshooting**

### "API calls failing"
- Check API URL in `api.js`
- Verify CORS settings in `server.js`
- Check Render.com logs

### "Site not updating"
- Clear browser cache
- Check Netlify deploy logs
- Rebuild and redeploy

### "Server sleeping" (Render.com free tier)
- Free tier sleeps after 15 min inactivity
- First request wakes it up (30-60 seconds)
- Consider paid tier ($7/month) for always-on

---

## 🎉 **Success!**

Your school management system is now live!

**Frontend URL**: https://your-site.netlify.app
**Backend API**: https://your-api.onrender.com

Share the URL with your school! 🏫
