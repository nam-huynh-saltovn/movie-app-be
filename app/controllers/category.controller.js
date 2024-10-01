// Import models and database connection
const { sequelize } = require('../config/connectDB');
const categoryService = require('../service/category.service');

module.exports = {
  // Get all categories
  getAll: async (req, res) => {
    try {
      // Fetch all categories from the database
      const categories = await categoryService.getAll();
      
      // If categories are found, return categories
      if (categories) {
        res.json(categories);
      }
    } catch (error) {
      console.error('Error:', error);
      // If there's a server error, return a 500 error with a message
      res.status(500).json({ error: 'Không thể lấy các thể loại này' });
    }
  },

  // Get category by ID
  getById: async (req, res) => {
    const { id } = req.params; // Extract the category ID from the URL parameters
    
    try {
      // Fetch a single category where cat_id matches and status is true
      const category = await categoryService.getById(id);
      
      // If the category is not found, return a 404 error
      if (!category) {
        return res.status(404).json({ error: 'Không tìm thấy thể loại nào' });
      }
      // If found, return the category data
      res.json(category);
    } catch (error) {
      // If there's a server error, return a 500 error with a message
      res.status(500).json({ error: 'Không thể lấy thể loại này' });
    }
  },

  // Create a new category
  insert: async (req, res) => {
    const { name, slug, status } = req.body; // Extract data from the request body
    
    let t;
    try {
      // Start a transaction to ensure atomicity
      t = await sequelize.transaction();
      
      // Create a new category
      const result = await categoryService.createCategory({ cat_name: name, cat_slug: slug, status: status }, t);
      
      // Commit the transaction if creation is successful
      await t.commit();
      res.status(201).json({ message: 'Tạo thể loại mới thành công', result });
    } catch (error) {
      console.error(error);
      // Rollback the transaction in case of an error
      await t.rollback();
      res.status(500).json({ error: 'Không thể tạo thể loại này' });
    }
  }
};