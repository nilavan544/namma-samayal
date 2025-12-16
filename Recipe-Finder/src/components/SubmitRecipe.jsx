import React, { useState } from 'react'

export default function SubmitRecipe({ token, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    ingredients: '',
    instructions: '',
    category: '',
    cuisine: '',
    image: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const actualToken = token || localStorage.getItem('token')
    console.log('Token being used:', actualToken ? 'Token exists' : 'No token')
    
    if (!actualToken) {
      setError('Please login again')
      setLoading(false)
      return
    }
    
    try {
      const res = await fetch('http://localhost:5001/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${actualToken}`
        },
        body: JSON.stringify({
          ...form,
          ingredients: form.ingredients.split('\n').filter(i => i.trim())
        })
      })
      
      if (res.ok) {
        onSuccess()
        onClose()
      } else {
        const data = await res.json()
        setError(data.message || 'Failed to submit recipe')
      }
    } catch (err) {
      setError('Network error. Please check if backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-overlay">
      <div className="auth-modal" style={{maxWidth:500}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
          <h2>Submit Recipe</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Recipe Name"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            required
          />
          <input
            placeholder="Image URL"
            value={form.image}
            onChange={e => setForm({...form, image: e.target.value})}
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            rows={3}
          />
          <textarea
            placeholder="Ingredients (one per line)"
            value={form.ingredients}
            onChange={e => setForm({...form, ingredients: e.target.value})}
            rows={5}
            required
          />
          <textarea
            placeholder="Instructions"
            value={form.instructions}
            onChange={e => setForm({...form, instructions: e.target.value})}
            rows={5}
            required
          />
          <input
            placeholder="Category (e.g., Dessert)"
            value={form.category}
            onChange={e => setForm({...form, category: e.target.value})}
          />
          <input
            placeholder="Cuisine (e.g., Italian)"
            value={form.cuisine}
            onChange={e => setForm({...form, cuisine: e.target.value})}
          />
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Recipe'}
          </button>
        </form>
      </div>
    </div>
  )
}
