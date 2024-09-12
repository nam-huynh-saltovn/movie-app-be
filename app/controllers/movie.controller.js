// Import models and database connection
const db = require("../common/connect");
const Movie = require("../models/movie.model");
const Type = require("../models/type.model");
const Year = require("../models/year.model");
const Episode = require("../models/episode.model");

module.exports = {

  // Get all movies with related Year, Type, and Episode data
  getAll: async (req, res) => {
    try {
      // Fetch all movies including related Year, Type, and Episode models
      const results = await Movie.findAll({ include: [Year, Type, Episode] });

      // If movies are found, return movies
      if (results.length > 0) {
        res.json(results);
      } else {
        // If no movies are found, return a 404 error with a message
        res.status(404).json({ error: 'Không tìm thấy phim nào' });
      }
    } catch (error) {
      console.error(error);
      // If there's a server error, return a 500 error with a message
      res.status(500).json({ error: 'Không thể lấy các phim này' });
    }
  },

  // Get a single movie by ID with related Year, Type, and Episode data
  getById: async (req, res) => {
    const { id } = req.params; // Extract the movie ID from the URL parameters

    try {
      // Fetch a single movie where mov_id matches and status is true
      const movie = await Movie.findOne({ 
        where: { mov_id: id, status: true }, 
        include: [Year, Type, Episode] 
      });

      // If the movie is not found, return a 404 error
      if (!movie) {
        return res.status(404).json({ error: 'Không tìm thấy phim nào' });
      }
      // If found, return the movie data
      res.json(movie);
    } catch (error) {
      // If there's a server error, return a 500 error
      res.status(500).json({ error: 'Không thể lấy phim này' });
    }
  },

  // Create a new movie
  insert: async (req, res) => {
    const { name, slug, origin_name, content, poster_url, 
            thumb_url, time, episode_current, episode_total, 
            quality, lang, year_id, type_id, status } = req.body; // Extract data from the request body

    let t;
    try {
      // Start a transaction to ensure atomicity
      t = await db.transaction();

      // Create a new movie with the provided data
      const result = await Movie.create({
        mov_name: name,
        mov_slug: slug,
        ori_name: origin_name,
        content: content,
        poster_url: poster_url,
        thumb_url: thumb_url,
        time: time,
        episode_current: episode_current,
        episode_total: episode_total,
        quality: quality,
        lang: lang,
        year_id: year_id,
        type_id: type_id,
        status: status
      }, { transaction: t });

      // Commit the transaction if movie creation is successful
      await t.commit();
      res.status(201).json({ message: 'Tạo phim thành công', result });
    } catch (error) {
      // Rollback the transaction in case of an error
      await t.rollback();
      res.status(500).json({ error: 'Không thể tạo phim mới' });
    }
  },

  // Update movie by ID
  update: (req, res) => {
    const movie = req.body;  // Extract the updated movie data from the request body
    const id = req.params.id;  // Extract the movie ID from the URL parameters

    // Update the movie record in the database
    Movie.update(movie, id, (result) => {
      res.send(result);
    });
  },

  // Delete a movie by ID
  delete: (req, res) => {
    const id = req.params.id;  // Extract the movie ID from the URL parameters

    // Delete the movie record from the database
    Movie.delete(id, (result) => {
      res.send(result);
    });
  },
};