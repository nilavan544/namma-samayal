import React, { useState } from 'react'

export default function ShoppingList({ onClose }) {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState('')

  const addItem = (e) => {
    e.preventDefault()
    if (newItem.trim()) {
      setItems([...items, { id: Date.now(), text: newItem, checked: false }])
      setNewItem('')
    }
  }

  const toggleItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const clearCompleted = () => {
    setItems(items.filter(item => !item.checked))
  }

  return (
    <div className="shopping-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="shopping-modal">
        <div className="shopping-header">
          <h2>🛒 Shopping List</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="shopping-content">
          <form onSubmit={addItem} className="add-item-form">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add ingredient or item..."
            />
            <button type="submit">Add</button>
          </form>

          <div className="shopping-list">
            {items.length === 0 ? (
              <p className="empty-list">Your shopping list is empty</p>
            ) : (
              <>
                {items.map(item => (
                  <div key={item.id} className={`list-item ${item.checked ? 'checked' : ''}`}>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                    />
                    <span className="item-text">{item.text}</span>
                    <button onClick={() => deleteItem(item.id)} className="delete-btn">
                      🗑️
                    </button>
                  </div>
                ))}
                
                {items.some(item => item.checked) && (
                  <button onClick={clearCompleted} className="clear-btn">
                    Clear Completed
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}