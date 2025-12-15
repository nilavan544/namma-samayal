import User from '../models/User.js'

export const getFavorites = async (req, res) => {
  try {
    res.json({ favorites: req.user.favorites })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const addFavorite = async (req, res) => {
  try {
    const { recipeId } = req.body
    const user = await User.findById(req.user._id)
    
    if (!user.favorites.includes(recipeId)) {
      user.favorites.push(recipeId)
      await user.save()
    }
    
    res.json({ favorites: user.favorites })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const removeFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params
    const user = await User.findById(req.user._id)
    
    user.favorites = user.favorites.filter(id => id !== recipeId)
    await user.save()
    
    res.json({ favorites: user.favorites })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
