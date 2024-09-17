// Import models and database connection
const db = require("../common/connect");
const Director = require("../models/director.model");

module.exports = {
  // Get all directors
  getAll: async (req, res) => {
    try {
      // Fetch all directors from the database
      const directors = await Director.findAll();
      
      // If directors are found, return directors
      if (directors) {
        res.json(directors);
      }
    } catch (error) {
      console.error('Error:', error);
      // If there's a server error, return a 500 error with a message
      res.status(500).json({ error: 'Không thể lấy các đạo diễn này' });
    }
  },

  // Get director by ID
  getById: async (req, res) => {
    const { id } = req.params; // Extract the director ID from the URL parameters
    
    try {
      // Fetch a single director where dir_id matches and status is true
      const director = await Director.findOne({ where: { dir_id: id, status: true } });
      
      // If the director is not found, return a 404 error
      if (!director) {
        return res.status(404).json({ error: 'Không tìm thấy đạo diễn nào' });
      }
      // If found, return the director data
      res.json(director);
    } catch (error) {
      // If there's a server error, return a 500 error with a message
      res.status(500).json({ error: 'Không thể lấy đạo diễn này' });
    }
  },

  // Create a new director
  insert: async (req, res) => {
    const { name, status } = req.body; // Extract data from the request body
    
    let t;
    try {
      // Start a transaction to ensure atomicity
      t = await db.transaction();
      
      // Create a new director with the provided data
      const result = await Director.create(
        { dir_name: name, status: status },
        { transaction: t }
      );
      
      // Commit the transaction if creation is successful
      await t.commit();
      res.status(201).json({ message: 'Tạo đạo diễn mới thành công', result });
    } catch (error) {
      console.error(error);
      // Rollback the transaction in case of an error
      await t.rollback();
      res.status(500).json({ error: 'Không thể tạo đạo diễn mới' });
    }
  }
};