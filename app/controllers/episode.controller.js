// Import models and database connection
const { sequelize } = require('../config/connectDB');
const { Op } = require("sequelize");
const episodeService = require("../service/episode.service");
const episodeValidator = require("../validator/episode.validator");
const db = require("../models/index");


module.exports = {
  // Get all episodes
  getAll: async (req, res) => {
    try {
      // Fetch all episodes from the database
      const episodes = await db.Episode.findAll();
      
      // If episodes are found, return episodes
      if (episodes) {
        res.json(episodes);
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
      const episode = await db.Episode.findOne({ where: { ep_id: id, status: true } });
      
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

  // Get episode by movie ID
  getByMovieId: async (req, res) => {
    const { movId } = req.params; // Extract the episode ID from the URL parameters
    const { page=1, limit=10, query='', order=1 } = req.query;
    
    try {
      const offset = (page - 1) * limit;

      const sortOrder = parseInt(order)==2?[["sort_order", "DESC"]]:parseInt(order)==3?[["ep_name", "ASC"]]:[["sort_order", "ASC"]];
      
      // If query is provided, search both 'name' and 'slug'
      const whereClause = query 
        ? {
          [Op.or]: [
            { ep_name: { [Op.like]: `%${query}%` } },  // find by name
            { ep_slug: { [Op.like]: `%${query}%` } },  // find by slug
          ]
        }
        : {};

      const totalEpisodes = await db.Episode.count({where: whereClause, include: {model: db.Movie, as: 'Movies', where: {mov_id: movId}}})

      // Fetch a single episode where ep_id matches and status is true
      const results = await episodeService.getByMovieId(movId, whereClause, sortOrder, offset, limit);
      
      // If the episode is not found, return a 404 error
      if (!results) {
        return res.status(404).json({ error: 'Không tìm thấy tập phim nào' });
      }
      // If found, return the episode data
      res.status(200).json({
        episodes: results,
        totalEpisodes: totalEpisodes,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalEpisodes / limit),
        totalRows: 50
      });
    } catch (error) {
      // If there's a server error, return a 500 error with a message
      console.log(error);
      
      res.status(500).json({ error: 'Không thể lấy tập phim này' });
    }
  },

  // Get all episode by movie ID
  getAllByMovieId: async (req, res) => {
    const { movId } = req.params;
    
    try {
      // Fetch a single episode where ep_id matches and status is true
      const results = await episodeService.getAllByMovieId(movId);
      
      // If the episode is not found, return a 404 error
      if (!results) {
        return res.status(404).json({ error: 'Không tìm thấy tập phim nào' });
      }
      // If found, return the episode data
      res.status(200).json({ episodes: results });
    } catch (error) {
      // If there's a server error, return a 500 error with a message
      console.log(error);
      
      res.status(500).json({ error: 'Không thể lấy tập phim này' });
    }
  },

  // Create a new episode
  insert: async (req, res) => {
    const { ep_title, ep_name, ep_slug, link_embed, link_m3u8, mov_id, user_id } = req.body; // Extract data from the request body
    
    let t;
    try {
      // Start a transaction to ensure atomicity
      t = await sequelize.transaction();

      const [count] = await sequelize.query(
        `SELECT COUNT(ep_id) AS count FROM episode_movie WHERE mov_id = ?`,
        { replacements: [mov_id] }
      );
      
      const sortOrder = count[0].count;
      
      // Create a new episode with the provided data
      const result = await db.Episode.create(
        { 
          ep_title: ep_title, 
          ep_name: ep_name, 
          ep_slug: ep_slug, 
          link_embed: link_embed, 
          link_m3u8: link_m3u8,
          user_id: user_id, 
          sort_order: sortOrder+1, 
          status: 1 
        },
        { transaction: t }
      );

      const episodeId = result.ep_id;

      // Insert data into the episode_movie junction table
      await sequelize.query(
        `INSERT INTO episode_movie (ep_id, mov_id, updatedAt, createdAt) VALUES (?, ?, now(), now())`,
        {
          replacements: [episodeId, mov_id],
          transaction: t
        }
      );
      
      // Commit the transaction if creation and insertion are successful
      await t.commit();
      res.status(201).json({ message: 'Tạo tập phim mới thành công', result, sortOrder });
    } catch (error) {
      console.error(error);
      // Rollback the transaction in case of an error
      await t.rollback();
      res.status(500).json({ error: 'Không thể tạo tập phim này' });
    }
  },

  // Update episode by id
  update: async (req, res) => {
    const episode = req.body;  // Extract the updated episode data from the request body

    const transaction = await sequelize.transaction();

    const validationErrors = await episodeValidator.validateEpisodeData({episode:Object.keys(episode)}); //validation data
    try {
      if (validationErrors) {
        // if error -> return fe
        return res.status(400).json({ message: validationErrors });
      }
      
      // Create a new movie with the provided data
      const result = await episodeService.updateEpisode(episode, transaction);

      // Commit transaction
      await transaction.commit();

      res.status(201).json({ message: 'Cập nhật tập phim thành công',  result});
    } catch (error) {
      if (transaction) await transaction.rollback();  // Ensure rollback happens if an error occurs
      console.error("Transaction error:", error);  // Log the exact error
      res.status(500).json({ error: 'Không thể cập nhật' });
    }
  },

  // Update episode by id
  updateSortOrder: async (req, res) => {
    const { id } = req.params;
    const { sort_order } = req.body;
    
    const transaction = await sequelize.transaction();
    try {
      // Create a new movie with the provided data
      const result = await episodeService.updateSortOrder(id, sort_order, transaction);

      // Commit transaction
      await transaction.commit();

      res.status(201).json({ message: 'Cập nhật thứ tự tập phim thành công',  result});
    } catch (error) {
      if (transaction) await transaction.rollback();  // Ensure rollback happens if an error occurs
      console.error("Transaction error:", error);  // Log the exact error
      res.status(500).json({ error: 'Không thể cập nhật thứ tự tập phim' });
    }
  },

  // delete episode by ID
  delete: async (req, res) => {
    const id = req.params.id;  // Extract the movie ID from the URL parameters

    const transaction = await sequelize.transaction();

    try {
      await episodeService.deleteEpisode(id, transaction);

      // Commit transaction
      await transaction.commit();

      res.status(201).json({ message: 'Xóa tập phim thành công'});
    } catch (error) {
      if (transaction) await transaction.rollback();  // Ensure rollback happens if an error occurs
      console.error("Transaction error:", error);  // Log the exact error
      res.status(500).json({ error: 'Không thể xóa tập phim' });
    }
  },
};