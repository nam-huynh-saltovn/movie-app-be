// Import models and database connection
const { sequelize } = require('../config/connectDB');
const yearService = require("../service/year.service");

module.exports = {
  // Get all years
  getAll: async (req, res) => {
    try {
      // Fetch all years from the database
      const years = await yearService.getAllYear();
      
      // If years are found, return years
      if (years) {
        res.json(years);
      }
    } catch (error) {
      console.error('Error:', error);
      // If there's a server error, return a 500 error with a message
      res.status(500).json({ error: 'Không thể lấy năm' });
    }
  },

  // Get a single year by ID
  getById: async (req, res) => {
    const { id } = req.params; // Extract the year ID from the URL parameters
    
    try {
      // Fetch a single year where year_id matches and status is true
      const year = await yearService.getById(id);
      
      // If the year is not found, return a 404 error
      if (!year) {
        return res.status(404).json({ error: 'Không tìm thấy năm nào' });
      }
      // If found, return the year data
      res.json(year);
    } catch (error) {
      // If there's a server error, return a 500 error with a message
      res.status(500).json({ error: 'Không thể lấy năm' });
    }
  },

  // Create a new year
  insert: async (req, res) => {
    const { year, status } = req.body; // Extract data from the request body
    
    let t;
    try {
      // Start a transaction to ensure atomicity
      t = await sequelize.transaction();
      
      // Create a new year
      const result = await yearService.createYear({ year_name: year, status: status }, t);
      
      // Commit the transaction if year creation is successful
      await t.commit();
      res.status(201).json({ message: 'Tạo năm thành công', result });
    } catch (error) {
      // Rollback the transaction in case of an error
      await t.rollback();
      res.status(500).json({ error: 'Không thể tạo năm' });
    }
  }
};