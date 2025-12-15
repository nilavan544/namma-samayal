# 🔐 Recipe Finder Backend

Traditional Node.js + Express + MongoDB backend with JWT authentication.

## 🚀 Quick Setup

### 1. Install MongoDB

**Windows:**
- Download from: https://www.mongodb.com/try/download/community
- Install and run MongoDB service
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

**Quick MongoDB Atlas Setup:**
1. Create free account at mongodb.com/cloud/atlas
2. Create cluster (free tier)
3. Get connection string
4. Replace in `.env`: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/recipe-finder`

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Start Server

```bash
npm run dev
```

Server runs on: http://localhost:5000

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Favorites
- `GET /api/favorites` - Get user favorites (protected)
- `POST /api/favorites` - Add favorite (protected)
- `DELETE /api/favorites/:recipeId` - Remove favorite (protected)

## 🧪 Test API

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"123456\",\"role\":\"user\"}"
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john@example.com\",\"password\":\"123456\"}"
```

## 🔒 Security Features

✅ Password hashing with bcrypt
✅ JWT token authentication
✅ Role-based access control (user/admin)
✅ Protected routes middleware
✅ CORS enabled

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js      # Auth logic
│   │   └── favoriteController.js  # Favorites logic
│   ├── middleware/
│   │   └── auth.js                # JWT verification
│   ├── models/
│   │   └── User.js                # User schema
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoints
│   │   └── favoriteRoutes.js      # Favorites endpoints
│   └── server.js                  # Main server
├── .env                           # Environment variables
└── package.json
```

## 🎯 User Roles

- **user**: Regular user (search recipes, save favorites)
- **admin**: Admin user (all user features + admin panel access)

## 🔧 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/recipe-finder
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

## 🚀 Production Deployment

1. Set strong JWT_SECRET
2. Use MongoDB Atlas for database
3. Enable HTTPS
4. Set NODE_ENV=production
5. Deploy to Heroku, Railway, or AWS
