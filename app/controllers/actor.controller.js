// Import models and database connection
const { sequelize } = require('../config/connectDB');
const actorService = require("../service/actor.service");

module.exports = {
  // Get all actors
  getAll: async (req, res) => {
    const { page = 1, limit = 50} = req.query;
    const offset=  (page - 1) * limit;
    try {
      // Fetch all actors from the database
      const actors = await actorService.getAllActors(offset, limit);
      
      // If actors are found, return actors
      if (actors) {
        res.json(actors);
      }
    } catch (error) {
      console.error('Error:', error);
      // If there's a server error, return a 500 error with a message
      res.status(500).json({ error: 'Không thể lấy các diễn viên này' });
    }
  },

  // Get actor by ID
  getById: async (req, res) => {
    const { id } = req.params; // Extract the actor ID from the URL parameters
    
    try {
      // Fetch a single actor where act_id matches and status is true
      const actor = await actorService.getActorById(id);
      
      // If the actor is not found, return a 404 error
      if (!actor) {
        return res.status(404).json({ error: 'Không tìm thấy diễn viên nào' });
      }
      // If found, return the actor data
      res.json(actor);
    } catch (error) {
      // If there's a server error, return a 500 error with a message
      res.status(500).json({ error: 'Không thể lấy diễn viên này' });
    }
  },

  // Create a new actor
  insert: async(req, res) => {
    const data = req.body; // Extract data from the request body
    let t;
    try {
        // Start a transaction to ensure atomicity
        t = await sequelize.transaction();
        
        // Create a new actor with the provided data
        const result = actorService.createActor(data, t);
        
        // Commit the transaction if creation is successful
        await t.commit();
        res.status(201).json({ message: 'Tạo diễn viên mới thành công', result });
    } catch (error) {
        console.error(error);
        // Rollback the transaction in case of an error
        await t.rollback();
        res.status(500).json({ error: 'Không thể tạo diễn viên này' });
    }
  }
};