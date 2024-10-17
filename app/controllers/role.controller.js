// Import models and database connection
const { sequelize } = require('../config/connectDB');
const roleService = require("../service/role.service");

module.exports = {
  // Get all roles
  getAll: async (req, res) => {
    const { page = 1, limit = 50} = req.query;
    const offset=  (page - 1) * limit;
    try {
      // Fetch all roles from the database
      const roles = await roleService.getAllRoles(offset, limit);
      
      // If roles are found, return roles
      if (roles) {
        res.json(roles);
      }
    } catch (error) {
      console.error('Error:', error);
      // If there's a server error, return a 500 error with a message
      res.status(500).json({ error: 'Không thể lấy các role này' });
    }
  },

  // Get role by ID
  getById: async (req, res) => {
    const { id } = req.params; // Extract the role ID from the URL parameters
    
    try {
      // Fetch a single role where act_id matches and status is true
      const role = await roleService.getRoleById(id);
      
      // If the role is not found, return a 404 error
      if (!role) {
        return res.status(404).json({ error: 'Không tìm thấy role nào' });
      }
      // If found, return the role data
      res.json(role);
    } catch (error) {
      // If there's a server error, return a 500 error with a message
      res.status(500).json({ error: 'Không thể lấy role này' });
    }
  },

  // Create a new role
  insert: async(req, res) => {
    const data = req.body; // Extract data from the request body
    try {
        // Start a transaction to ensure atomicity
        const transaction = await sequelize.transaction();
        
        // Create a new role with the provided data
        const result = await roleService.createRole(data, transaction);
        
        // Commit the transaction if creation is successful
        await transaction.commit();
        res.status(201).json({ message: 'Tạo role mới thành công', result });
    } catch (error) {
        console.error(error);
        // Rollback the transaction in case of an error
        await transaction.rollback();
        res.status(500).json({ error: 'Không thể tạo role này' });
    }
  }
};