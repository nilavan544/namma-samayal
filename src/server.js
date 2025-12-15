import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import favoriteRoutes from './routes/favoriteRoutes.js'
import recipeRoutes from './routes/recipeRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB error:', err.message)
    console.log('💡 Trying to continue without MongoDB...')
  })

app.use('/api/auth', authRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/recipes', recipeRoutes)
app.use('/api/admin', adminRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Recipe Finder API Running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
