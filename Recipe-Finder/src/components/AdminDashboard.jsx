import React, { useEffect, useState } from 'react'

export default function AdminDashboard({ token, onClose }) {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [pendingRecipes, setPendingRecipes] = useState([])
  const [tab, setTab] = useState('stats')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      await Promise.all([loadStats(), loadUsers(), loadPendingRecipes()])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to load stats (${res.status})`)
      }
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error('Stats error:', err)
      throw err
    }
  }

  const loadUsers = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to load users')
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error('Users error:', err)
      throw err
    }
  }

  const loadPendingRecipes = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/recipes/pending', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to load recipes')
      const data = await res.json()
      setPendingRecipes(data || [])
    } catch (err) {
      console.error('Recipes error:', err)
      setPendingRecipes([])
    }
  }

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return
    try {
      const res = await fetch(`http://localhost:5001/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to delete user')
      await loadUsers()
    } catch (err) {
      alert('Error deleting user: ' + err.message)
    }
  }

  const approveRecipe = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/recipes/${id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to approve recipe')
      await loadPendingRecipes()
    } catch (err) {
      alert('Error approving recipe: ' + err.message)
    }
  }

  return (
    <div className="auth-overlay">
      <div className="admin-modal">
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:20}}>
          <h2>Admin Dashboard</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="admin-tabs">
          <button onClick={() => setTab('stats')} className={tab === 'stats' ? 'active' : ''}>Stats</button>
          <button onClick={() => setTab('users')} className={tab === 'users' ? 'active' : ''}>Users</button>
          <button onClick={() => setTab('recipes')} className={tab === 'recipes' ? 'active' : ''}>Pending Recipes</button>
        </div>

        {loading && <div style={{textAlign:'center',padding:40}}><div className="spinner" /></div>}
        {error && <div style={{color:'var(--danger)',textAlign:'center',padding:20}}>{error}</div>}
        
        {!loading && !error && tab === 'stats' && stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
            <div className="stat-card">
              <h3>{stats.totalRecipes}</h3>
              <p>Total Recipes</p>
            </div>
            <div className="stat-card">
              <h3>{stats.pendingRecipes}</h3>
              <p>Pending Approval</p>
            </div>
          </div>
        )}

        {!loading && !error && tab === 'users' && (
          <div className="admin-table">
            {users.map(u => (
              <div key={u._id} className="admin-row">
                <div>
                  <strong>{u.name}</strong>
                  <div style={{fontSize:12,color:'var(--muted)'}}>{u.email}</div>
                </div>
                <span className="role-badge">{u.role}</span>
                <button onClick={() => deleteUser(u._id)} className="delete-btn">Delete</button>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && tab === 'recipes' && (
          <div className="admin-table">
            {pendingRecipes.map(r => (
              <div key={r._id} className="admin-row">
                <div>
                  <strong>{r.name}</strong>
                  <div style={{fontSize:12,color:'var(--muted)'}}>By: {r.submittedBy?.name}</div>
                </div>
                <button onClick={() => approveRecipe(r._id)} className="approve-btn">Approve</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
