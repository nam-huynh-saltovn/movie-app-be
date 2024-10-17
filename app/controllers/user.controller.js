// Import models and database connection
const { sequelize } = require('../config/connectDB');
const userService = require("../service/user.service");

module.exports = {
  // Get all users
  getAll: async (req, res) => {
    try {
      // Fetch all users from the database
      const users = await userService.getAllUser();
      
      // If users are found, return users
      if (users) {
        res.json(users);
      }
    } catch (error) {
      console.error('Error:', error);
      // If there's a server error, return a 500 error with a message
      res.status(500).json({ error: 'Không thể lấy người dùng' });
    }
  },

  // Get a single user by ID
  getById: async (req, res) => {
    const { id } = req.params; // Extract the user ID from the URL parameters
    
    try {
      // Fetch a single user where user_id matches and status is true
      const user = await userService.getById(id);
      
      // If the user is not found, return a 404 error
      if (!user) {
        return res.status(404).json({ error: 'Không tìm thấy người dùng nào' });
      }
      // If found, return the user data
      res.json(user);
    } catch (error) {
      // If there's a server error, return a 500 error with a message
      res.status(500).json({ error: 'Không thể lấy người dùng' });
    }
  },
};