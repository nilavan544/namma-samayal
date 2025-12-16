import React, { useState, useEffect } from 'react'
import RecipeCard from './RecipeCard'
import './FavoritesPage.css'

export default function FavoritesPage({ favorites, onToggleFav, onViewDetails }) {
  const [favoriteRecipes, setFavoriteRecipes] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (favorites.length > 0) {
      loadFavoriteRecipes()
    }
  }, [favorites])

  const loadFavoriteRecipes = async () => {
    setLoading(true)
    try {
      const recipes = await Promise.all(
        favorites.map(async (id) => {
          const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
          const data = await res.json()
          return data.meals?.[0]
        })
      )
      setFavoriteRecipes(recipes.filter(Boolean))
    } catch (err) {
      console.error('Error loading favorites:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{textAlign:'center',paddingTop:60}}><div className="spinner" /></div>
  }

  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <div className="empty-state">
          <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
          </svg>
          <h2>No Saved Recipes</h2>
          <p>Start exploring recipes and bookmark your favorites for quick access</p>
          <div className="empty-instructions">
            <h4>How to save recipes:</h4>
            <ol>
              <li>Search for recipes using the search bar</li>
              <li>Browse through the recipe results</li>
              <li>Click the bookmark icon on any recipe card</li>
              <li>Your saved recipes will appear here</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{marginBottom:'24px',color:'var(--text-primary)'}}>Saved Recipes ({favorites.length})</h2>
      <div className="grid">
        {favoriteRecipes.map(recipe => (
          <RecipeCard 
            key={recipe.idMeal} 
            meal={recipe} 
            isFav={true} 
            onToggleFav={onToggleFav}
            user={true}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  )
}