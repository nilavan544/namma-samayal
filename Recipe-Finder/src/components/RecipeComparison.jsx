import React, { useState } from 'react'

export default function RecipeComparison({ recipes, onClose }) {
  const [selected, setSelected] = useState([])

  const toggleSelect = (recipe) => {
    if (selected.find(r => r.idMeal === recipe.idMeal)) {
      setSelected(selected.filter(r => r.idMeal !== recipe.idMeal))
    } else if (selected.length < 3) {
      setSelected([...selected, recipe])
    }
  }

  const getIngredients = (meal) => {
    const ings = []
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`]
      if (ing && ing.trim()) ings.push(ing.toLowerCase())
    }
    return ings
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}>
      <div style={{background:'var(--bg-card)',borderRadius:'var(--radius-xl)',maxWidth:1200,width:'100%',maxHeight:'90vh',overflow:'auto',padding:32}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <h2 style={{margin:0,color:'var(--primary)',fontSize:28}}>🔍 Compare Recipes</h2>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:32,cursor:'pointer',color:'var(--text-muted)'}}>×</button>
        </div>

        <p style={{color:'var(--text-secondary)',marginBottom:24}}>Select up to 3 recipes to compare side-by-side</p>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:16,marginBottom:32}}>
          {recipes.slice(0, 12).map(recipe => (
            <div key={recipe.idMeal} onClick={() => toggleSelect(recipe)} style={{border:`2px solid ${selected.find(r => r.idMeal === recipe.idMeal) ? 'var(--primary)' : 'var(--border)'}`,borderRadius:'var(--radius)',padding:12,cursor:'pointer',background:selected.find(r => r.idMeal === recipe.idMeal) ? 'var(--primary-light)' : 'transparent',transition:'all 0.2s'}}>
              <img src={recipe.strMealThumb} alt={recipe.strMeal} style={{width:'100%',height:120,objectFit:'cover',borderRadius:'var(--radius)',marginBottom:8}} />
              <div style={{fontSize:14,fontWeight:600,color:'var(--text-primary)'}}>{recipe.strMeal}</div>
            </div>
          ))}
        </div>

        {selected.length >= 2 && (
          <div style={{display:'grid',gridTemplateColumns:`repeat(${selected.length},1fr)`,gap:24,borderTop:'2px solid var(--border)',paddingTop:24}}>
            {selected.map(recipe => {
              const ings = getIngredients(recipe)
              return (
                <div key={recipe.idMeal}>
                  <h3 style={{fontSize:18,marginBottom:16,color:'var(--primary)'}}>{recipe.strMeal}</h3>
                  <div style={{marginBottom:16}}>
                    <strong>Category:</strong> {recipe.strCategory}<br/>
                    <strong>Cuisine:</strong> {recipe.strArea}<br/>
                    <strong>Ingredients:</strong> {ings.length}
                  </div>
                  <div style={{fontSize:13,color:'var(--text-secondary)'}}>
                    {ings.slice(0, 8).map((ing, i) => <div key={i}>• {ing}</div>)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
