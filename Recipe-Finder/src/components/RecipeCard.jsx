import React, { useState } from 'react'
import RecipeDetail from './RecipeDetail'

export default function RecipeCard({ meal, isFav, onToggleFav, user, onViewDetails, viewMode = 'grid' }) {
  // build first 6 ingredients
  const ingredients = []
  for (let i = 1; i <= 8; i++) {
    const ing = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    if (ing && ing.trim()) ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ing}`)
  }

  const getEstimatedCalories = (meal) => {
    const baseCalories = {
      'Chicken': 350, 'Beef': 400, 'Pork': 380, 'Seafood': 250,
      'Vegetarian': 200, 'Vegan': 180, 'Dessert': 450, 'Breakfast': 300,
      'Side': 150, 'Pasta': 320, 'Miscellaneous': 280
    }
    
    const category = meal.strCategory || 'Miscellaneous'
    let calories = baseCalories[category] || 280
    calories += ingredients.length * 15
    calories += Math.floor(Math.random() * 100) - 50
    
    return Math.max(150, Math.min(800, calories))
  }

  const handleShare = async () => {
    const shareData = {
      title: meal.strMeal,
      text: `Check out this ${meal.strArea} ${meal.strCategory} recipe: ${meal.strMeal}`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Recipe link copied to clipboard!')
      })
    }
  }

  const handleCardClick = () => {
    console.log('Card clicked:', meal.strMeal)
    console.log('onViewDetails function:', onViewDetails)
    if (onViewDetails) {
      console.log('Calling onViewDetails with meal:', meal)
      onViewDetails(meal)
      console.log('onViewDetails called successfully')
    } else {
      console.log('onViewDetails function not provided')
    }
  }

  return (
    <article className={`card ${viewMode === 'list' ? 'card-list' : ''}`} role="article" onClick={handleCardClick}>
      <div className="card-image-container">
        <img className="thumb" src={meal.strMealThumb} alt={meal.strMeal} loading="lazy" />
        <div className="image-overlay"></div>
        <div className="card-actions">
          <button
            className="fav-btn"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFav(meal.idMeal)
            }}
            title={isFav ? 'Remove favorite' : 'Add favorite'}
            aria-pressed={isFav}
          >
            <svg className="heart" viewBox="0 0 24 24" fill={isFav ? '#f472b6' : 'none'} stroke={isFav ? '#f472b6' : '#fff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.8 7.6c0 5.8-8 10.4-8 10.4S4.8 13.4 4.8 7.6a4.2 4.2 0 0 1 7-3 4.2 4.2 0 0 1 7 3z" />
            </svg>
          </button>
          <button
            className="share-btn"
            onClick={(e) => {
              e.stopPropagation()
              handleShare()
            }}
            title="Share recipe"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="recipe-header">
          <h3>{meal.strMeal}</h3>
          <div className="calories-badge">
            <span className="calories-icon">🔥</span>
            <span className="calories-text">{getEstimatedCalories(meal)} cal</span>
          </div>
        </div>
        <div className="meta">
          <span className="cuisine-badge">📍 {meal.strArea}</span>
          <span className="category-badge">🍽️ {meal.strCategory}</span>
          {meal.strTags && <span className="tags-badge">🏷️ {meal.strTags.split(',')[0]}</span>}
        </div>

        <div className="recipe-stats">
          <div className="stat-item">
            <span className="stat-icon">⏱️</span>
            <span className="stat-text">30-45 min</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🍽️</span>
            <span className="stat-text">{ingredients.length} ingredients</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <span className="stat-text">4.{Math.floor(Math.random() * 5 + 5)}/5</span>
          </div>
        </div>

        <ul className="ings">
          {ingredients.slice(0, 4).map((ing, i) => (
            <li key={i}>
              <span className="ingredient-bullet">•</span>
              {ing}
            </li>
          ))}
          {ingredients.length > 4 && (
            <li className="more-ingredients">+{ingredients.length - 4} more ingredients</li>
          )}
        </ul>

        <details onClick={(e) => e.stopPropagation()}>
          <summary>
            <span>View Recipe Instructions</span>
            <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </summary>
          <div className="instr">{meal.strInstructions}</div>
        </details>



        <div style={{display:'flex',gap:8}}>
          <button 
            className="view-details-btn"
            onClick={(e) => {
              e.stopPropagation()
              handleCardClick()
            }}
            style={{flex:1}}
          >
            👁️ View Recipe
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              const subs = {
                'chicken': 'tofu/paneer',
                'beef': 'mushrooms',
                'milk': 'almond milk',
                'butter': 'olive oil',
                'egg': 'flax egg',
                'cream': 'coconut cream'
              }
              let msg = '🔄 Smart Substitutions:\n\n'
              ingredients.forEach(ing => {
                Object.keys(subs).forEach(key => {
                  if (ing.toLowerCase().includes(key)) {
                    msg += `• ${ing} → ${subs[key]}\n`
                  }
                })
              })
              alert(msg || 'No substitutions available for this recipe')
            }}
            style={{padding:'12px 16px',background:'linear-gradient(135deg,#10b981,#059669)',color:'white',border:'none',borderRadius:'var(--radius)',cursor:'pointer',fontSize:14,fontWeight:600}}
            title="Smart ingredient substitutions"
          >
            🔄
          </button>
        </div>

        {user && <CommentsSection recipeId={meal.idMeal} />}
      </div>
      

    </article>
  )
}

function CommentsSection({ recipeId }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(false)

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    
    const comment = {
      id: Date.now(),
      text: newComment,
      author: 'Anonymous User',
      date: new Date().toLocaleDateString()
    }
    
    setComments([...comments, comment])
    setNewComment('')
  }

  return (
    <div className="comments-section" onClick={(e) => e.stopPropagation()}>
      <button 
        className="toggle-comments" 
        onClick={() => setShowComments(!showComments)}
      >
        💬 Comments ({comments.length})
      </button>
      
      {showComments && (
        <div className="comments-content">
          <form onSubmit={handleAddComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this recipe..."
              rows="3"
            />
            <button type="submit">Add Comment</button>
          </form>
          
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <strong>{comment.author}</strong>
                  <span className="comment-date">{comment.date}</span>
                </div>
                <p>{comment.text}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}