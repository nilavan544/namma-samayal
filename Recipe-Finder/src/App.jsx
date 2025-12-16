import React, { useEffect, useState } from 'react'
import RecipeCard from './components/RecipeCard'
import Auth from './components/Auth'
import AdminDashboard from './components/AdminDashboard'
import SubmitRecipe from './components/SubmitRecipe'
import CalorieCalculator from './components/CalorieCalculator'
import FavoritesPage from './components/FavoritesPage'
import Contact from './components/Contact'
import Feedback from './components/Feedback'
import RecipeDetail from './components/RecipeDetail'
import RecipeTimer from './components/RecipeTimer'
import ShoppingList from './components/ShoppingList'
import RecipeComparison from './components/RecipeComparison'
import VoiceSearch from './components/VoiceSearch'
import MealPlanner from './components/MealPlanner'
import * as api from './api/auth'

export default function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('home')
  const [showAuth, setShowAuth] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [query, setQuery] = useState('')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [showAdmin, setShowAdmin] = useState(false)
  const [showSubmit, setShowSubmit] = useState(false)
  const [showCalc, setShowCalc] = useState(false)
  const [showTimer, setShowTimer] = useState(false)
  const [showShopping, setShowShopping] = useState(false)
  const [userRecipes, setUserRecipes] = useState([])
  const [filters, setFilters] = useState({ category: '', area: '', ingredient: '' })
  const [displayCount, setDisplayCount] = useState(12)
  const [sortBy, setSortBy] = useState('default')
  const [viewMode, setViewMode] = useState('grid')
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [showMealPlanner, setShowMealPlanner] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
      loadFavorites(token)
      loadUserRecipes()
    }
    setAuthLoading(false)
  }, [])

  const loadFavorites = async (token) => {
    try {
      const data = await api.getFavorites(token)
      setFavorites(data.favorites || [])
    } catch (err) {
      console.error(err)
    }
  }

  const loadUserRecipes = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/recipes')
      const data = await res.json()
      setUserRecipes(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSearch = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()
    if (!user) {
      setShowAuth(true)
      return
    }
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setRecipes([])
    setCurrentPage('recipes')

    try {
      let allRecipes = []
      const searchTerm = query.trim()
      const token = localStorage.getItem('token')

      // First, try to get from database
      try {
        const dbRes = await fetch(`http://localhost:5001/api/cached-recipes/search?q=${encodeURIComponent(searchTerm)}&limit=100`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (dbRes.ok) {
          const dbData = await dbRes.json()
          if (dbData.length > 0) {
            const dbRecipes = dbData.map(r => ({
              idMeal: r.recipeId,
              strMeal: r.name,
              strMealThumb: r.image,
              strCategory: r.category,
              strArea: r.cuisine,
              strInstructions: r.instructions,
              strTags: r.tags,
              strIngredient1: r.ingredients[0] || '',
              strIngredient2: r.ingredients[1] || '',
              strIngredient3: r.ingredients[2] || '',
              strIngredient4: r.ingredients[3] || ''
            }))
            allRecipes.push(...dbRecipes)
            console.log(`Found ${dbRecipes.length} recipes from database`)
          }
        }
      } catch (err) {
        console.log('Database search error:', err)
      }

      // 1. Edamam API (2.3M recipes)
      try {
        const appId = import.meta.env.VITE_EDAMAM_APP_ID
        const appKey = import.meta.env.VITE_EDAMAM_APP_KEY
        const edamamRes = await fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(searchTerm)}&app_id=${appId}&app_key=${appKey}&to=100`)
        const edamamData = await edamamRes.json()
        if (edamamData.hits) {
          edamamData.hits.forEach(hit => {
            const recipe = hit.recipe
            allRecipes.push({
              idMeal: 'ed_' + recipe.uri.split('#recipe_')[1],
              strMeal: recipe.label,
              strMealThumb: recipe.image,
              strCategory: recipe.dishType?.[0] || 'Main',
              strArea: recipe.cuisineType?.[0] || 'International',
              strInstructions: `Calories: ${Math.round(recipe.calories)}\\n\\nIngredients:\\n${recipe.ingredientLines.join('\\n')}`,
              strTags: recipe.healthLabels?.slice(0,2).join(','),
              strIngredient1: recipe.ingredientLines?.[0] || '',
              strIngredient2: recipe.ingredientLines?.[1] || '',
              strIngredient3: recipe.ingredientLines?.[2] || '',
              strIngredient4: recipe.ingredientLines?.[3] || '',
              strMeasure1: '', strMeasure2: '', strMeasure3: '', strMeasure4: ''
            })
          })
        }
      } catch (err) {
        console.log('Edamam error:', err)
      }

      // 2. Recipe Puppy API (1M+ recipes, unlimited)
      try {
        const puppyRes = await fetch(`http://www.recipepuppy.com/api/?q=${encodeURIComponent(searchTerm)}`)
        const puppyData = await puppyRes.json()
        if (puppyData.results) {
          puppyData.results.forEach(recipe => {
            allRecipes.push({
              idMeal: 'rp_' + recipe.href,
              strMeal: recipe.title,
              strMealThumb: recipe.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image',
              strCategory: 'Main',
              strArea: 'International',
              strInstructions: `Ingredients: ${recipe.ingredients}\\n\\nView full recipe at: ${recipe.href}`,
              strTags: '',
              strIngredient1: recipe.ingredients.split(',')[0] || '',
              strIngredient2: recipe.ingredients.split(',')[1] || '',
              strIngredient3: recipe.ingredients.split(',')[2] || '',
              strMeasure1: '', strMeasure2: '', strMeasure3: ''
            })
          })
        }
      } catch (err) {
        console.log('Recipe Puppy error:', err)
      }

      // 3. TheMealDB - Comprehensive search
      try {
        const mealRes = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`)
        const mealData = await mealRes.json()
        if (mealData.meals) allRecipes.push(...mealData.meals)

        const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')
        const letterPromises = letters.map(letter => 
          fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
            .then(res => res.json())
            .catch(() => ({ meals: null }))
        )
        
        const letterResults = await Promise.all(letterPromises)
        letterResults.forEach(data => {
          if (data.meals) {
            const filtered = data.meals.filter(meal => 
              meal.strMeal.toLowerCase().includes(searchTerm.toLowerCase()) ||
              meal.strCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
              meal.strArea.toLowerCase().includes(searchTerm.toLowerCase())
            )
            allRecipes.push(...filtered)
          }
        })

        if (allRecipes.length > 0 && allRecipes.length < 100) {
          const firstMeal = allRecipes[0]
          if (firstMeal.strCategory) {
            const catRes = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${firstMeal.strCategory}`)
            const catData = await catRes.json()
            if (catData.meals) {
              for (const meal of catData.meals.slice(0, 30)) {
                const detailRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                const detailData = await detailRes.json()
                if (detailData.meals) allRecipes.push(...detailData.meals)
              }
            }
          }
        }
      } catch (err) {
        console.log('TheMealDB error:', err)
      }

      const uniqueRecipes = allRecipes.filter((recipe, index, self) => 
        index === self.findIndex(r => r.strMeal === recipe.strMeal)
      )

      if (uniqueRecipes.length > 0) {
        setRecipes(uniqueRecipes)
        setDisplayCount(12)
        
        // Save to database in background
        saveRecipesToDB(uniqueRecipes, token)
      } else {
        setError('No recipes found')
      }
    } catch (err) {
      console.error(err)
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const saveRecipesToDB = async (recipes, token) => {
    try {
      const recipesToSave = recipes.map(r => ({
        recipeId: r.idMeal,
        name: r.strMeal,
        image: r.strMealThumb,
        category: r.strCategory || 'Main',
        cuisine: r.strArea || 'International',
        instructions: r.strInstructions || '',
        tags: r.strTags || '',
        ingredients: [r.strIngredient1, r.strIngredient2, r.strIngredient3, r.strIngredient4].filter(Boolean),
        source: r.idMeal.startsWith('ed_') ? 'edamam' : r.idMeal.startsWith('rp_') ? 'recipepuppy' : 'themealdb'
      }))

      await fetch('http://localhost:5001/api/cached-recipes/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ recipes: recipesToSave })
      })
      console.log(`Saved ${recipesToSave.length} recipes to database`)
    } catch (err) {
      console.log('Error saving recipes:', err)
    }
  }

  const quickSearch = (term) => {
    if (!user) {
      setShowAuth(true)
      return
    }
    setQuery(term)
    setTimeout(() => handleSearch({ preventDefault: () => {} }), 60)
  }

  const toggleFavorite = async (id) => {
    if (!user) {
      setShowAuth(true)
      return
    }
    const token = localStorage.getItem('token')
    try {
      if (favorites.includes(id)) {
        const data = await api.removeFavorite(token, id)
        setFavorites(data.favorites)
      } else {
        const data = await api.addFavorite(token, id)
        setFavorites(data.favorites)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const favoriteRecipes = recipes.filter(r => favorites.includes(r.idMeal))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setFavorites([])
    setCurrentPage('home')
  }

  const handleAuthSuccess = (userData) => {
    localStorage.setItem('token', userData.token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    loadFavorites(userData.token)
    loadUserRecipes()
    setShowAuth(false)
  }

  if (authLoading) {
    return <div className="app" style={{textAlign:'center',paddingTop:60}}><div className="spinner" /></div>
  }

  const renderNavigation = () => (
    <nav className="nav-menu">
      <button onClick={() => setCurrentPage('home')} className={currentPage === 'home' ? 'active' : ''}>Home</button>
      <button onClick={() => setCurrentPage('recipes')} className={currentPage === 'recipes' ? 'active' : ''}>Recipes</button>
      {user && <button onClick={() => setCurrentPage('favorites')} className={currentPage === 'favorites' ? 'active' : ''}>Saved ({favorites.length})</button>}
      <button onClick={() => setCurrentPage('contact')} className={currentPage === 'contact' ? 'active' : ''}>Contact</button>
      <button onClick={() => setCurrentPage('feedback')} className={currentPage === 'feedback' ? 'active' : ''}>Feedback</button>
      <button onClick={() => setShowCalc(true)}>Calorie Calculator</button>
      <button onClick={() => setShowTimer(true)}>⏰ Timer</button>
      <button onClick={() => setShowShopping(true)}>🛍️ Shopping</button>
      <button onClick={() => setShowMealPlanner(true)}>📅 Meal Plan</button>
      {recipes.length > 1 && <button onClick={() => setShowComparison(true)}>🔍 Compare</button>}
    </nav>
  )

  return (
    <div className="app">
      <header>
        <div className="header-left">
          <h1 onClick={() => setCurrentPage('home')} style={{cursor:'pointer'}}>
            <span className="logo-icon">👨‍🍳</span> Namma Samayal
          </h1>
          <p>Discover recipes from 3+ million database</p>
        </div>
        <div className="header-right">
          {renderNavigation()}
          {user ? (
            <>
              <button onClick={() => setShowSubmit(true)} className="submit-btn"><span>✨</span> Submit Recipe</button>
              {user.role === 'admin' && <button onClick={() => setShowAdmin(true)} className="admin-btn"><span>⚙️</span> Admin</button>}
              <div className="user-info">
                <div className="user-details">
                  <div className="user-email">{user.email}</div>
                  <div className="user-role">{user.role?.toUpperCase()}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="logout-btn"><span>👋</span> Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setShowAuth(true)} className="login-btn">Login</button>
              <button onClick={() => setShowAuth(true)} className="register-btn">Register</button>
            </>
          )}
        </div>
      </header>

      {currentPage === 'home' && (
        <div className="home-content">
          <div className="hero-section">
            <h2>Welcome to Namma Samayal</h2>
            <p>Search from 3+ million recipes • Edamam + Recipe Puppy + TheMealDB</p>
            {!user && <div className="login-notice"><p>🔐 Please login to access recipes</p></div>}
          </div>
          
          <div className="search-wrap">
            <form className="form" onSubmit={handleSearch} style={{position:'relative'}}>
              <div style={{flex:1,position:'relative'}}>
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    if (e.target.value.length > 1) {
                      const suggestions = ['chicken', 'biryani', 'curry', 'pasta', 'pizza', 'salad', 'soup', 'dessert', 'cake', 'rice']
                        .filter(s => s.includes(e.target.value.toLowerCase()))
                      setSearchSuggestions(suggestions)
                      setShowSuggestions(suggestions.length > 0)
                    } else {
                      setShowSuggestions(false)
                    }
                  }}
                  onFocus={() => query.length > 1 && searchSuggestions.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search from 3M+ recipes..."
                  aria-label="Search recipes"
                />
                {showSuggestions && (
                  <div style={{position:'absolute',top:'100%',left:0,right:0,background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'var(--radius)',marginTop:4,boxShadow:'var(--shadow)',zIndex:10,maxHeight:200,overflowY:'auto'}}>
                    {searchSuggestions.map((s, i) => (
                      <div key={i} onClick={() => { setQuery(s); setShowSuggestions(false); }} style={{padding:'12px 16px',cursor:'pointer',borderBottom:'1px solid var(--border-light)',transition:'all 0.2s'}} onMouseEnter={(e) => e.target.style.background='var(--border-light)'} onMouseLeave={(e) => e.target.style.background='transparent'}>
                        🔍 {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" disabled={loading}>{loading ? 'Searching...' : '🔍 Search'}</button>
              <VoiceSearch onSearch={(text) => { setQuery(text); setTimeout(() => handleSearch({preventDefault:()=>{}}), 100); }} />
            </form>

            <div>
              <h4 style={{margin:'0 0 12px',color:'var(--text-primary)',fontSize:16,fontWeight:600}}>🔥 Trending Searches</h4>
              <div className="quick-buttons">
                <button onClick={() => quickSearch('dosa')}><span>🥞</span> Dosa</button>
                <button onClick={() => quickSearch('biryani')}><span>🍚</span> Biryani</button>
                <button onClick={() => quickSearch('curry')}><span>🍛</span> Curry</button>
                <button onClick={() => quickSearch('pasta')}><span>🍝</span> Pasta</button>
                <button onClick={() => quickSearch('chicken')}><span>🍗</span> Chicken</button>
                <button onClick={() => quickSearch('pizza')}><span>🍕</span> Pizza</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'recipes' && (
        <>
          {loading && <div style={{marginTop:10}}><div className="spinner" /></div>}
          {error && <div className="empty" style={{marginTop:12}}>{error}</div>}

          {!loading && !error && recipes.length > 0 && (
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',margin:'16px 0',padding:'16px',background:'var(--bg-card)',borderRadius:'var(--radius)',border:'1px solid var(--border)'}}>
              <div style={{color:'var(--text-secondary)',fontSize:16}}>
                Found <strong style={{color:'var(--primary)'}}>{recipes.length}</strong> recipes
              </div>
              <div style={{display:'flex',gap:12,alignItems:'center'}}>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{padding:'8px 12px',border:'1px solid var(--border)',borderRadius:'var(--radius)',background:'var(--bg-card)',fontSize:14}}>
                  <option value="default">Default</option>
                  <option value="name">Name A-Z</option>
                </select>
                <div style={{display:'flex',gap:4,border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:4,background:'var(--bg-card)'}}>
                  <button onClick={() => setViewMode('grid')} style={{padding:'6px 12px',border:'none',background:viewMode==='grid'?'var(--primary)':'transparent',color:viewMode==='grid'?'white':'var(--text-secondary)',borderRadius:'var(--radius)',cursor:'pointer',fontSize:14}}>Grid</button>
                  <button onClick={() => setViewMode('list')} style={{padding:'6px 12px',border:'none',background:viewMode==='list'?'var(--primary)':'transparent',color:viewMode==='list'?'white':'var(--text-secondary)',borderRadius:'var(--radius)',cursor:'pointer',fontSize:14}}>List</button>
                </div>
              </div>
            </div>
          )}

          <section style={{marginTop:16}}>
            <div className={viewMode === 'grid' ? 'grid' : 'list-view'}>
              {recipes
                .sort((a, b) => sortBy === 'name' ? a.strMeal.localeCompare(b.strMeal) : 0)
                .slice(0, displayCount).map(r => (
                <RecipeCard 
                  key={r.idMeal} 
                  meal={r} 
                  isFav={favorites.includes(r.idMeal)} 
                  onToggleFav={toggleFavorite} 
                  user={user}
                  onViewDetails={(recipe) => {
                    setSelectedRecipe(recipe)
                    setCurrentPage('recipe-detail')
                  }}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {!loading && recipes.length > displayCount && (
              <div style={{textAlign:'center',marginTop:32}}>
                <button 
                  onClick={() => setDisplayCount(prev => prev + 12)}
                  style={{padding:'14px 32px',background:'var(--primary)',color:'white',border:'none',borderRadius:'var(--radius)',fontSize:16,fontWeight:600,cursor:'pointer'}}
                >
                  Load More ({recipes.length - displayCount} remaining)
                </button>
              </div>
            )}
          </section>
        </>
      )}

      {currentPage === 'favorites' && user && <FavoritesPage favorites={favorites} onToggleFav={toggleFavorite} onViewDetails={(recipe) => { setSelectedRecipe(recipe); setCurrentPage('recipe-detail'); }} />}
      {currentPage === 'contact' && <Contact />}
      {currentPage === 'feedback' && <Feedback favorites={favorites} />}
      {currentPage === 'recipe-detail' && selectedRecipe && (
        <div className="recipe-detail-page">
          <button onClick={() => setCurrentPage('recipes')} className="back-btn">← Back</button>
          <RecipeDetail meal={selectedRecipe} onClose={() => setCurrentPage('recipes')} isPage={true} />
        </div>
      )}

      <footer style={{marginTop:22,textAlign:'center', color:'var(--text-muted)'}}>Built with ❤️ — Namma Samayal • 3M+ Recipes</footer>
      
      {showAuth && <Auth onSuccess={handleAuthSuccess} onClose={() => setShowAuth(false)} />}
      {showAdmin && <AdminDashboard token={localStorage.getItem('token')} onClose={() => setShowAdmin(false)} />}
      {showSubmit && <SubmitRecipe token={localStorage.getItem('token')} onClose={() => setShowSubmit(false)} onSuccess={loadUserRecipes} />}
      {showCalc && <CalorieCalculator onClose={() => setShowCalc(false)} />}
      {showTimer && <RecipeTimer onClose={() => setShowTimer(false)} />}
      {showShopping && <ShoppingList onClose={() => setShowShopping(false)} />}
      {showComparison && <RecipeComparison recipes={recipes} onClose={() => setShowComparison(false)} />}
      {showMealPlanner && <MealPlanner recipes={recipes} onClose={() => setShowMealPlanner(false)} />}
    </div>
  )
}
