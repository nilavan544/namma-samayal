import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Recipe from './models/Recipe.js';

dotenv.config();

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check Users
    const users = await User.find().select('-password');
    console.log(`📊 Total Users: ${users.length}`);
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - Role: ${user.role}`);
      console.log(`    Favorites: ${user.favorites?.length || 0}`);
      console.log(`    Search History: ${user.searchHistory?.length || 0}`);
    });

    console.log('\n📊 Total Recipes:', await Recipe.countDocuments());
    const recipes = await Recipe.find().populate('submittedBy', 'name email');
    recipes.forEach(recipe => {
      console.log(`  - ${recipe.name} by ${recipe.submittedBy?.name || 'Unknown'}`);
      console.log(`    Approved: ${recipe.approved}`);
      console.log(`    Ratings: ${recipe.ratings?.length || 0}`);
    });

    console.log('\n✅ Database check complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
