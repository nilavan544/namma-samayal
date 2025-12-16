# 🍳 Recipe Finder

A modern, interactive recipe search application built with React and Vite. Search thousands of recipes, save favorites, and discover new dishes with a beautiful glassmorphism UI.

## ✨ Features

- **🔍 Smart Search** - Find recipes by name with real-time results
- **⚡ Quick Search** - One-click buttons for popular ingredients
- **❤️ Favorites** - Save and manage your favorite recipes locally
- **📱 Responsive** - Works perfectly on desktop and mobile
- **🎨 Modern UI** - Beautiful glassmorphism design with smooth animations
- **🌐 API Integration** - Powered by TheMealDB API
- **♿ Accessible** - Built with accessibility in mind

## 🚀 Quick Start

```bash
# Navigate to project directory
cd Recipe-Finder

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🛠️ Tech Stack

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **CSS3** - Custom glassmorphism styling
- **TheMealDB API** - Recipe data source
- **Local Storage** - Persistent favorites

## 📖 Usage

1. **Search Recipes** - Type any ingredient or dish name
2. **Quick Search** - Click preset buttons for common ingredients
3. **View Details** - Click "View instructions" for full recipe
4. **Save Favorites** - Click the heart icon to save recipes
5. **Browse Favorites** - Favorited recipes appear at the top of results

## 🎯 Project Structure

```
Recipe-Finder/
├── src/
│   ├── components/
│   │   └── RecipeCard.jsx    # Recipe display component
│   ├── App.jsx               # Main application logic
│   ├── App.css              # Component-specific styles
│   ├── index.css            # Global styles & theme
│   └── main.jsx             # React entry point
├── public/
│   └── vite.svg             # Vite logo
└── package.json             # Dependencies & scripts
```

## 🌟 Key Features Explained

### Search Functionality
- Real-time API calls to TheMealDB
- Error handling for network issues
- Loading states with animated spinner

### Favorites System
- Persistent storage using localStorage
- Toggle favorites with heart icon
- Favorites counter in header

### Responsive Design
- Mobile-first approach
- Flexible grid layout
- Touch-friendly interactions

## 🎨 Design System

The app uses a custom CSS design system with:
- **Dark theme** with gradient backgrounds
- **Glassmorphism** effects with backdrop blur
- **Smooth animations** and hover effects
- **Accessible colors** and contrast ratios

## 📝 License

This project is open source and available under the MIT License.

---

Built with ❤️ using React + Vite