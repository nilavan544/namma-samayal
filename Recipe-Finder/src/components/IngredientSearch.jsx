import React, { useState } from 'react'

export default function IngredientSearch({ onSearch, user, onShowAuth }) {
  const [ingredients, setIngredients] = useState([])
  const [input, setInput] = useState('')

  const commonIngredients = [
    '🍗 Chicken', '🥩 Beef', '🐟 Fish', '🍤 Shrimp', '🥚 Eggs',
    '🍅 Tomato', '🧅 Onion', '🧄 Garlic', '🥔 Potato', '🥕 Carrot',
    '🌶️ Chili', '🫑 Pepper', '🥬 Spinach', '🍚 Rice', '🍝 Pasta'
  ]

  const addIngredient = (ing) => {
    const name = ing.includes(' ') ? ing.split(' ')[1] : ing
    if (!ingredients.includes(name)) {
      setIngredients([...ingredients, name])
    }
  }

  const removeIngredient = (ing) => {
    setIngredients(ingredients.filter(i => i !== ing))
  }

  const handleSearch = () => {
    if (!user) {
      onShowAuth()
      return
    }
    if (ingredients.length > 0) {
      onSearch(ingredients.join(','))
    }
  }

  return (
    <div style={{
      background: 'var(--bg-card)',
      padding: '32px',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow)',
      marginBottom: '32px'
    }}>
      <h3 style={{
        margin: '0 0 16px',
        fontSize: '24px',
        fontWeight: '700',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        🥘 Search by Ingredients
      </h3>
      <p style={{
        margin: '0 0 24px',
        color: 'var(--text-secondary)',
        fontSize: '14px'
      }}>
        Select ingredients you have and find recipes you can make
      </p>

      <div style={{marginBottom: '20px'}}>
        <h4 style={{
          margin: '0 0 12px',
          fontSize: '14px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Common Ingredients
        </h4>
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          {commonIngredients.map((ing, i) => (
            <button
              key={i}
              onClick={() => addIngredient(ing)}
              style={{
                padding: '8px 16px',
                background: ingredients.includes(ing.split(' ')[1]) ? 'var(--primary)' : 'var(--bg-card)',
                color: ingredients.includes(ing.split(' ')[1]) ? 'white' : 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!ingredients.includes(ing.split(' ')[1])) {
                  e.target.style.background = 'var(--border-light)'
                }
              }}
              onMouseLeave={(e) => {
                if (!ingredients.includes(ing.split(' ')[1])) {
                  e.target.style.background = 'var(--bg-card)'
                }
              }}
            >
              {ing}
            </button>
          ))}
        </div>
      </div>

      {ingredients.length > 0 && (
        <div style={{marginBottom: '20px'}}>
          <h4 style={{
            margin: '0 0 12px',
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Selected Ingredients ({ingredients.length})
          </h4>
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            padding: '16px',
            background: 'var(--border-light)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)'
          }}>
            {ingredients.map((ing, i) => (
              <span
                key={i}
                style={{
                  padding: '6px 12px',
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {ing}
                <button
                  onClick={() => removeIngredient(ing)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && input.trim()) {
              addIngredient(input.trim())
              setInput('')
            }
          }}
          placeholder="Add custom ingredient..."
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            fontSize: '16px',
            outline: 'none'
          }}
        />
        <button
          onClick={() => {
            if (input.trim()) {
              addIngredient(input.trim())
              setInput('')
            }
          }}
          style={{
            padding: '12px 20px',
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          + Add
        </button>
        <button
          onClick={handleSearch}
          disabled={ingredients.length === 0}
          style={{
            padding: '12px 24px',
            background: ingredients.length > 0 ? 'var(--primary)' : 'var(--border)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: ingredients.length > 0 ? 'pointer' : 'not-allowed',
            whiteSpace: 'nowrap',
            opacity: ingredients.length > 0 ? 1 : 0.6
          }}
        >
          🔍 Find Recipes
        </button>
      </div>
    </div>
  )
}
