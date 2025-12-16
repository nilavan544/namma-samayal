import React from 'react'

export default function RecipeDetail({ meal, onClose, isPage = false }) {
  if (!meal) return null

  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    if (ing && ing.trim()) {
      ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ing}`)
    }
  }

  if (isPage) {
    return (
      <div className="recipe-detail-content-page">
        <div className="recipe-image-section">
          <img src={meal.strMealThumb} alt={meal.strMeal} className="recipe-detail-image" />
          <div className="recipe-badges">
            <span className="badge cuisine">{meal.strArea}</span>
            <span className="badge category">{meal.strCategory}</span>
          </div>
        </div>
        
        <div className="recipe-info-section">
          <h1 className="recipe-title">{meal.strMeal}</h1>
          
          <div className="ingredients-section">
            <h3>Ingredients</h3>
            <ul className="ingredients-list">
              {ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>
          
          <div className="instructions-section">
            <h3>Instructions</h3>
            <div className="instructions-text">
              {meal.strInstructions}
            </div>
          </div>
          
          {meal.strYoutube && (
            <div className="video-section">
              <h3>Video Tutorial</h3>
              <a 
                href={meal.strYoutube} 
                target="_blank" 
                rel="noopener noreferrer"
                className="video-link"
              >
                📺 Watch on YouTube
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="recipe-detail-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="recipe-detail-modal">
        <div className="recipe-detail-header">
          <h1>{meal.strMeal}</h1>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="recipe-detail-content">
          <div className="recipe-image-section">
            <img src={meal.strMealThumb} alt={meal.strMeal} className="recipe-detail-image" />
            <div className="recipe-badges">
              <span className="badge cuisine">{meal.strArea}</span>
              <span className="badge category">{meal.strCategory}</span>
            </div>
          </div>
          
          <div className="recipe-info-section">
            <div className="ingredients-section">
              <h3>Ingredients</h3>
              <ul className="ingredients-list">
                {ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>
            
            <div className="instructions-section">
              <h3>Instructions</h3>
              <div className="instructions-text">
                {meal.strInstructions}
              </div>
            </div>
            
            {meal.strYoutube && (
              <div className="video-section">
                <h3>Video Tutorial</h3>
                <a 
                  href={meal.strYoutube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="video-link"
                >
                  📺 Watch on YouTube
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}