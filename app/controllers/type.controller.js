// Import models and database connection
const db = require("../common/connect");
const Type = require("../models/type.model");

module.exports = {
  // Get all types
  getAll: async (req, res) => {
    try {
      // Fetch all types from the database
      const types = await Type.findAll();
      
      // If types are found, return them in the response
      if (types) {
        res.json(types);
      } 
    } catch (error) {
      console.error('Error:', error);
      // If there's a server error, return a 500 error with a message
      res.status(500).json({ error: 'Không thể lấy type' });
    }
  },

  // Get type by ID
  getById: async (req, res) => {
    const { id } = req.params; // Extract the type ID from the URL parameters
    
    try {
      // Fetch a single type where type_id matches and status is true
      const type = await Type.findOne({ where: { type_id: id, status: true } });
      
      // If the type is not found, return a 404 error
      if (!type) {
        return res.status(404).json({ error: 'Không tìm thấy type nào' });
      }
      // If found, return the type data
      res.json(type);
    } catch (error) {
      // If there's a server error, return a 500 error with a message
      res.status(500).json({ error: 'Không thể lấy type' });
    }
  },

  // Create a new type
  insert: async (req, res) => {
    const { type, slug, status } = req.body; // Extract data from the request body
    
    let t;
    try {
      // Start a transaction to ensure atomicity
      t = await db.transaction();
      
      // Create a new type with the provided data
      const result = await Type.create(
        { type_name: type, type_slug: slug, status: status },
        { transaction: t }
      );
      
      // Commit the transaction if type creation is successful
      await t.commit();
      res.status(201).json({ message: 'Tạo type thành công', result });
    } catch (error) {
      // Rollback the transaction in case of an error
      await t.rollback();
      res.status(500).json({ error: 'Không thể tạo type' });
    }
  }
};