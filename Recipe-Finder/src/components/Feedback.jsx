import React, { useState } from 'react'
import './Feedback.css'

export default function Feedback({ favorites }) {
  const [activeTab, setActiveTab] = useState('website')
  const [websiteFeedback, setWebsiteFeedback] = useState({
    rating: 5,
    category: 'general',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [feedbackHistory, setFeedbackHistory] = useState(() => {
    const saved = localStorage.getItem('feedbackHistory')
    return saved ? JSON.parse(saved) : []
  })

  const deleteFeedback = (id) => {
    const updated = feedbackHistory.filter(f => f.id !== id)
    setFeedbackHistory(updated)
    localStorage.setItem('feedbackHistory', JSON.stringify(updated))
  }

  const handleWebsiteFeedback = (e) => {
    e.preventDefault()
    const newFeedback = {
      ...websiteFeedback,
      date: new Date().toISOString(),
      id: Date.now()
    }
    const updated = [newFeedback, ...feedbackHistory]
    setFeedbackHistory(updated)
    localStorage.setItem('feedbackHistory', JSON.stringify(updated))
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setWebsiteFeedback({ rating: 5, category: 'general', message: '' })
  }

  const StarRating = ({ rating, onRatingChange, size = 24 }) => (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          className={`star ${star <= rating ? 'filled' : ''}`}
          onClick={() => onRatingChange(star)}
          style={{ fontSize: `${size}px` }}
        >
          ★
        </button>
      ))}
    </div>
  )

  return (
    <div className="feedback-page">
      <div className="feedback-header">
        <h2>Feedback & Ratings</h2>
        <p>Help us improve by sharing your thoughts and rating your favorite recipes</p>
      </div>

      <div className="feedback-tabs">
        <button 
          className={`tab-btn ${activeTab === 'website' ? 'active' : ''}`}
          onClick={() => setActiveTab('website')}
        >
          Website Feedback
        </button>
        <button 
          className={`tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          Rate Favorite Recipes
        </button>
      </div>

      {activeTab === 'website' && (
        <div className="website-feedback">
          <h3>Share Your Website Experience</h3>
          <form onSubmit={handleWebsiteFeedback} className="feedback-form">
            <div className="form-group">
              <label>Overall Rating</label>
              <StarRating 
                rating={websiteFeedback.rating}
                onRatingChange={(rating) => setWebsiteFeedback({...websiteFeedback, rating})}
              />
            </div>
            
            <div className="form-group">
              <label>Feedback Category</label>
              <select 
                value={websiteFeedback.category}
                onChange={(e) => setWebsiteFeedback({...websiteFeedback, category: e.target.value})}
              >
                <option value="general">General Experience</option>
                <option value="ui">User Interface</option>
                <option value="search">Search Functionality</option>
                <option value="recipes">Recipe Quality</option>
                <option value="performance">Website Performance</option>
                <option value="mobile">Mobile Experience</option>
                <option value="suggestion">Feature Suggestion</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Your Feedback</label>
              <textarea
                value={websiteFeedback.message}
                onChange={(e) => setWebsiteFeedback({...websiteFeedback, message: e.target.value})}
                placeholder="Tell us about your experience, suggestions for improvement, or any issues you encountered..."
                rows="6"
                required
              />
            </div>
            
            <button type="submit" className="submit-button">
              Submit Feedback
            </button>
            
            {submitted && (
              <div className="success-message">
                ✅ Thank you for your feedback! We appreciate your input.
              </div>
            )}
          </form>

          {feedbackHistory.length > 0 && (
            <div className="feedback-history">
              <h4>Your Previous Feedback</h4>
              {feedbackHistory.map(fb => (
                <div key={fb.id} className="feedback-history-item">
                  <div className="feedback-history-header">
                    <div>
                      <StarRating rating={fb.rating} onRatingChange={() => {}} size={16} />
                      <span className="feedback-category-badge">{fb.category}</span>
                    </div>
                    <button 
                      onClick={() => deleteFeedback(fb.id)} 
                      className="delete-feedback-btn"
                      title="Delete feedback"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="feedback-history-message">{fb.message}</p>
                  <small className="feedback-history-date">
                    {new Date(fb.date).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'recipes' && (
        <div className="recipe-ratings">
          <h3>Rate Your Favorite Recipes</h3>
          {favorites && favorites.length > 0 ? (
            <FavoriteRecipeRatings favoriteIds={favorites} />
          ) : (
            <div className="empty-favorites">
              <p>You haven't added any recipes to favorites yet.</p>
              <p>Start exploring recipes and add them to favorites to rate them here!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function FavoriteRecipeRatings({ favoriteIds }) {
  const [recipes, setRecipes] = useState([])
  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem('recipeRatings')
    return saved ? JSON.parse(saved) : {}
  })
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    loadFavoriteRecipes()
  }, [favoriteIds])

  const loadFavoriteRecipes = async () => {
    try {
      const recipePromises = favoriteIds.map(async (id) => {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        const data = await res.json()
        return data.meals?.[0]
      })
      const loadedRecipes = await Promise.all(recipePromises)
      setRecipes(loadedRecipes.filter(Boolean))
    } catch (err) {
      console.error('Error loading recipes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRating = (recipeId, rating, review = '') => {
    const updated = {
      ...ratings,
      [recipeId]: { rating, review, date: new Date().toLocaleDateString() }
    }
    setRatings(updated)
    localStorage.setItem('recipeRatings', JSON.stringify(updated))
  }

  const deleteRating = (recipeId) => {
    const updated = { ...ratings }
    delete updated[recipeId]
    setRatings(updated)
    localStorage.setItem('recipeRatings', JSON.stringify(updated))
  }

  if (loading) {
    return <div className="spinner"></div>
  }

  return (
    <div className="recipe-rating-list">
      {recipes.map(recipe => (
        <RecipeRatingCard 
          key={recipe.idMeal}
          recipe={recipe}
          rating={ratings[recipe.idMeal]}
          onRate={handleRating}
          onDelete={deleteRating}
        />
      ))}
    </div>
  )
}

function RecipeRatingCard({ recipe, rating, onRate, onDelete }) {
  const [showReview, setShowReview] = useState(false)
  const [review, setReview] = useState(rating?.review || '')

  const handleRatingSubmit = (newRating) => {
    onRate(recipe.idMeal, newRating, review)
    if (newRating > 0) setShowReview(true)
  }

  const handleReviewSubmit = () => {
    onRate(recipe.idMeal, rating?.rating || 5, review)
    setShowReview(false)
  }

  return (
    <div className="recipe-rating-card">
      <div className="recipe-info">
        <img src={recipe.strMealThumb} alt={recipe.strMeal} className="recipe-thumb" />
        <div className="recipe-details">
          <h4>{recipe.strMeal}</h4>
          <p>{recipe.strArea} • {recipe.strCategory}</p>
        </div>
      </div>
      
      <div className="rating-section">
        <label>Your Rating:</label>
        <StarRating 
          rating={rating?.rating || 0}
          onRatingChange={handleRatingSubmit}
          size={20}
        />
        
        {rating?.rating > 0 && (
          <div className="rating-actions">
            <button 
              className="review-btn"
              onClick={() => setShowReview(!showReview)}
            >
              {rating?.review ? 'Edit Review' : 'Add Review'}
            </button>
            
            {showReview && (
              <div className="review-input">
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your thoughts about this recipe..."
                  rows="3"
                />
                <button onClick={handleReviewSubmit} className="save-review-btn">
                  Save Review
                </button>
              </div>
            )}
            
            {rating?.review && !showReview && (
              <div className="existing-review">
                <p>"{rating.review}"</p>
                <small>Reviewed on {rating.date}</small>
              </div>
            )}
            
            {rating?.rating > 0 && (
              <button 
                className="delete-rating-btn"
                onClick={() => onDelete(recipe.idMeal)}
                title="Delete rating"
              >
                Delete Rating
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const StarRating = ({ rating, onRatingChange, size = 24 }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map(star => (
      <button
        key={star}
        type="button"
        className={`star ${star <= rating ? 'filled' : ''}`}
        onClick={() => onRatingChange(star)}
        style={{ fontSize: `${size}px` }}
      >
        ★
      </button>
    ))}
  </div>
)