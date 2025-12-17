import { API_URL } from '../config'

const AUTH_API = API_URL

export const register = async (name, email, password, role) => {
  const res = await fetch(`${AUTH_API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Registration failed')
  return data
}

export const login = async (email, password) => {
  const res = await fetch(`${AUTH_API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Login failed')
  return data
}

export const getProfile = async (token) => {
  const res = await fetch(`${AUTH_API}/auth/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Unauthorized')
  return await res.json()
}

export const getFavorites = async (token) => {
  const res = await fetch(`${AUTH_API}/favorites`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return await res.json()
}

export const addFavorite = async (token, recipeId) => {
  const res = await fetch(`${AUTH_API}/favorites`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ recipeId })
  })
  return await res.json()
}

export const removeFavorite = async (token, recipeId) => {
  const res = await fetch(`${AUTH_API}/favorites/${recipeId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return await res.json()
}
