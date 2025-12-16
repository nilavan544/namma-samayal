# 🍳 Namma Samayal - Recipe Finder Application

A professional full-stack recipe finder application with 3M+ recipes from multiple APIs, built with React, Node.js, Express, and MongoDB.

## ✨ Features

### Frontend
- 🔍 **Smart Search** - Search from 3M+ recipes (Edamam, Recipe Puppy, TheMealDB)
- 🎤 **Voice Search** - Search recipes using voice commands
- 💾 **Recipe Caching** - Automatic database caching for faster searches
- ❤️ **Favorites** - Save and manage favorite recipes
- 📊 **Recipe Comparison** - Compare up to 3 recipes side-by-side
- 📅 **Meal Planner** - Weekly meal planning with localStorage
- 🛒 **Shopping List** - Create shopping lists from recipes
- ⏰ **Recipe Timer** - Built-in cooking timer
- 🧮 **Calorie Calculator** - Calculate nutritional information
- 📱 **Responsive Design** - Professional blue-themed UI
- 🔐 **Authentication** - JWT-based user authentication
- 👨‍💼 **Admin Dashboard** - User and recipe management

### Backend
- 🔒 **Secure Authentication** - JWT tokens with bcrypt password hashing
- 👥 **User Management** - Role-based access control (user/admin)
- 📦 **Recipe Caching** - MongoDB storage for faster searches
- 🔍 **Text Search** - Full-text search on cached recipes
- 📊 **Admin Analytics** - Dashboard statistics and user management

## 🚀 Tech Stack

**Frontend:**
- React 18
- Vite
- CSS3 (Professional Blue Theme)
- Web Speech API (Voice Search)

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

**APIs:**
- Edamam API (2.3M recipes)
- Recipe Puppy API (1M+ recipes)
- TheMealDB API (300+ recipes)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Edamam API credentials (free tier)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/namma-samayal.git
cd namma-samayal
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Frontend Setup
```bash
cd Recipe-Finder
npm install

# Create .env file
cp .env.example .env
# Edit .env with your Edamam API credentials
```

### 4. Create Admin User
```bash
cd backend
npm run create-admin
```
Default admin credentials:
- Email: `admin@test.com`
- Password: `admin123`

## 🏃 Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5001

### Start Frontend (Terminal 2)
```bash
cd Recipe-Finder
npm run dev
```
Frontend runs on: http://localhost:5173

## 📁 Project Structure

```
RECIPE-FINDER/
├── backend/                 # Backend server
│   ├── config/             # Database configuration
│   ├── middleware/         # Auth middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── .env.example        # Environment variables template
│   ├── createAdmin.js      # Admin user creation script
│   └── server.js           # Main server file
│
├── Recipe-Finder/          # Frontend application
│   ├── src/
│   │   ├── api/           # API integration
│   │   ├── components/    # React components
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # Global styles
│   ├── .env.example       # Environment variables template
│   └── vite.config.js     # Vite configuration
│
└── README.md              # This file
```

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_EDAMAM_APP_ID=your_edamam_app_id
VITE_EDAMAM_APP_KEY=your_edamam_app_key
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Favorites
- `GET /api/favorites` - Get user favorites (protected)
- `POST /api/favorites` - Add favorite (protected)
- `DELETE /api/favorites/:recipeId` - Remove favorite (protected)

### Cached Recipes
- `GET /api/cached-recipes/search?q=query` - Search cached recipes
- `POST /api/cached-recipes/bulk` - Save recipes to database
- `GET /api/cached-recipes/stats` - Get cache statistics

### Admin (Admin Only)
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get dashboard statistics

## 🎨 Features in Detail

### Recipe Search
- Searches across 3 major recipe APIs
- Automatic caching in MongoDB
- Database-first search for speed
- Fallback to APIs if not cached

### User Roles
- **User**: Search recipes, save favorites, meal planning
- **Admin**: All user features + admin dashboard access

### Admin Dashboard
- View total users and recipes
- Manage user accounts
- Approve/reject user-submitted recipes
- View system statistics

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes middleware
- Role-based access control
- CORS enabled

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Deploy backend folder
3. Ensure MongoDB connection

### Frontend Deployment (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist` folder
3. Set environment variables

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

Built with ❤️ by Namma Samayal Team

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if you like this project!
