// Import the database connection instance and Country model
const { sequelize } = require('../config/connectDB');
const countryService = require('../service/country.service');

module.exports = {
  // Get all countries
  getAll: async (req, res) => {
    try {
      // Fetch all countries from the database
      const countries = await countryService.getAll();
      
      // If countries are found, return countries
      if (countries) {
        res.json(countries);
      }
    } catch (error) {
      console.error('Error:', error);
      // If there's a server error, return a 500 error with a message
      res.status(500).json({ error: 'Không thể lấy các quốc gia này' });
    }
  },

  // Get country by ID
  getById: async (req, res) => {
    const { id } = req.params; // Extract the country ID from the URL parameters
    
    try {
      // Fetch a single country where ctr_id matches and status is true
      const country = await countryService.getById(id);
      
      // If the country is not found, return a 404 error
      if (!country) {
        return res.status(404).json({ error: 'Không tìm thấy quốc gia nào' });
      }
      // If found, return the country data
      res.json(country);
    } catch (error) {
      // If there's a server error, return a 500 error with a message
      res.status(500).json({ error: 'Không thể lấy quốc gia này' });
    }
  },

  // Create a new country
  insert: async (req, res) => {
    const { name, slug, status } = req.body; // Extract data from the request body
    
    let t;
    try {
      // Start a transaction to ensure atomicity
      t = await sequelize.transaction();
      
      // Create a new country with the provided data
      const result = await countryService.createCountry({ ctr_name: name, ctr_slug: slug, status: status }, t);
      
      // Commit the transaction if creation is successful
      await t.commit();
      res.status(201).json({ message: 'Tạo quốc gia mới thành công', result });
    } catch (error) {
      console.error(error);
      // Rollback the transaction in case of an error
      await t.rollback();
      res.status(500).json({ error: 'Không thể tạo quốc gia này' });
    }
  }
};