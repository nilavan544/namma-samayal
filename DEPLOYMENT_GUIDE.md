# 🚀 Deployment Guide - Namma Samayal

## Backend Deployment (Render)

### Step 1: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `namma_samayal_backend`
4. Configure:
   - **Name**: `namma-samayal-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:
   - `MONGO_URI` = `your_mongodb_atlas_connection_string`
   - `JWT_SECRET` = `your_secret_key_here`
   - `NODE_ENV` = `production`
   - `PORT` = `5001`

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. **Copy your backend URL**: `https://namma-samayal-backend.onrender.com`

### Step 2: Update Backend CORS

After deployment, your backend URL will be something like:
`https://namma-samayal-backend.onrender.com`

Make sure your backend `server.js` has CORS configured to allow your frontend domain.

---

## Frontend Deployment (Vercel)

### Step 1: Update Frontend Environment Variables

1. Go to your frontend repo on GitHub
2. Update `.env` file locally (don't commit):
   ```env
   VITE_EDAMAM_APP_ID=8f3e3664
   VITE_EDAMAM_APP_KEY=62d422a179d79894be34a53564c3819f
   VITE_API_URL=https://namma-samayal-backend.onrender.com/api
   ```

### Step 2: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository: `namma-samayal`
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `Recipe-Finder`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables in Vercel:
   - `VITE_EDAMAM_APP_ID` = `8f3e3664`
   - `VITE_EDAMAM_APP_KEY` = `62d422a179d79894be34a53564c3819f`
   - `VITE_API_URL` = `https://namma-samayal-backend.onrender.com/api`

6. Click "Deploy"
7. Wait for deployment (2-3 minutes)

---

## Post-Deployment Steps

### 1. Create Admin User

SSH into Render or use Render Shell:
```bash
npm run create-admin
```

### 2. Test the Application

1. Visit your Vercel URL: `https://namma-samayal.vercel.app`
2. Try to register a new user
3. Try to login
4. Search for recipes
5. Test favorites functionality

### 3. Update CORS (if needed)

If you get CORS errors, update backend `server.js`:

```javascript
app.use(cors({
  origin: ['https://namma-samayal.vercel.app', 'http://localhost:5173'],
  credentials: true
}))
```

Then redeploy backend.

---

## Troubleshooting

### Backend Issues

**Problem**: Backend not starting
- Check Render logs
- Verify environment variables are set
- Ensure MongoDB connection string is correct

**Problem**: CORS errors
- Add your Vercel domain to CORS whitelist
- Redeploy backend after changes

### Frontend Issues

**Problem**: Can't connect to backend
- Verify `VITE_API_URL` is set correctly in Vercel
- Check backend is running on Render
- Open browser console to see exact error

**Problem**: Build fails on Vercel
- Check Root Directory is set to `Recipe-Finder`
- Verify all dependencies are in package.json
- Check build logs for specific errors

---

## Environment Variables Summary

### Backend (Render)
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
NODE_ENV=production
PORT=5001
```

### Frontend (Vercel)
```
VITE_EDAMAM_APP_ID=8f3e3664
VITE_EDAMAM_APP_KEY=62d422a179d79894be34a53564c3819f
VITE_API_URL=https://namma-samayal-backend.onrender.com/api
```

---

## Important Notes

1. **Render Free Tier**: Backend may sleep after 15 minutes of inactivity. First request will be slow (30s).
2. **MongoDB Atlas**: Make sure to whitelist Render's IP (0.0.0.0/0 for all IPs).
3. **Environment Variables**: Never commit `.env` files to GitHub.
4. **HTTPS**: Both Render and Vercel provide free HTTPS.

---

## Success Checklist

- [ ] Backend deployed on Render
- [ ] Backend URL copied
- [ ] Frontend environment variables updated
- [ ] Frontend deployed on Vercel
- [ ] CORS configured correctly
- [ ] Admin user created
- [ ] Registration works
- [ ] Login works
- [ ] Recipe search works
- [ ] Favorites work

🎉 Your application is now live!
