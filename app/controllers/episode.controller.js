// Import models and database connection
const db = require("../common/connect");
const Episode = require("../models/episode.model");

module.exports = {
  // Get all episodes
  getAll: async (req, res) => {
    try {
      // Fetch all episodes from the database
      const episodes = await Episode.findAll();
      
      // If episodes are found, return episodes
      if (episodes.length > 0) {
        res.json(episodes);
      } else {
        // If no episodes are found, return a 404 error with a message
        res.status(404).json({ error: 'Không tìm thấy tập phim nào' });
      }
    } catch (error) {
      console.error('Error:', error);
      // If there's a server error, return a 500 error with a message
      res.status(500).json({ error: 'Không thể lấy các tập phim này' });
    }
  },

  // Get episode by ID
  getById: async (req, res) => {
    const { id } = req.params; // Extract the episode ID from the URL parameters
    
    try {
      // Fetch a single episode where ep_id matches and status is true
      const episode = await Episode.findOne({ where: { ep_id: id, status: true } });
      
      // If the episode is not found, return a 404 error
      if (!episode) {
        return res.status(404).json({ error: 'Không tìm thấy tập phim nào' });
      }
      // If found, return the episode data
      res.json(episode);
    } catch (error) {
      // If there's a server error, return a 500 error with a message
      res.status(500).json({ error: 'Không thể lấy tập phim này' });
    }
  },

  // Create a new episode
  insert: async (req, res) => {
    const { title, name, slug, link, status, movieId } = req.body; // Extract data from the request body
    
    let t;
    try {
      // Start a transaction to ensure atomicity
      t = await db.transaction();
      
      // Create a new episode with the provided data
      const result = await Episode.create(
        { ep_title: title, ep_name: name, ep_slug: slug, ep_link: link, status: status },
        { transaction: t }
      );

      const episodeId = result.ep_id;

      // Insert data into the episode_movie junction table
      await db.query(
        `INSERT INTO episode_movie (ep_id, mov_id, sort_order) VALUES (?, ?, 10)`,
        {
          replacements: [episodeId, movieId],
          transaction: t
        }
      );
      
      // Commit the transaction if creation and insertion are successful
      await t.commit();
      res.status(201).json({ message: 'Tạo tập phim mới thành công', result });
    } catch (error) {
      console.error(error);
      // Rollback the transaction in case of an error
      await t.rollback();
      res.status(500).json({ error: 'Không thể tạo tập phim này' });
    }
  }
};