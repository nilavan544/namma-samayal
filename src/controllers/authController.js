import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'User already exists' })

    const user = await User.create({ name, email, password, role: role || 'user' })
    const token = generateToken(user._id)

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = generateToken(user._id)

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      favorites: user.favorites,
      token
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getProfile = async (req, res) => {
  res.json(req.user)
}
