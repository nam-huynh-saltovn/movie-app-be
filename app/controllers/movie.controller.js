// Import models and database connection
const db = require("../common/connect");
const Movie = require("../models/movie.model");
const Type = require("../models/type.model");
const Year = require("../models/year.model");
const Episode = require("../models/episode.model");

const actorService = require("../service/actor.service");
const directorService = require("../service/director.service");
const categoryService = require("../service/category.service");
const countryService = require("../service/country.service");
const movieService = require("../service/movie.service");
const yearService = require("../service/year.service");
const typeService = require("../service/type.service");
const episodeService = require("../service/episode.service");
const movieValidator = require("../validator/movie.validator");
const Actor = require("../models/actor.model");
const Director = require("../models/director.model");
const Country = require("../models/country.model");
const Category = require("../models/category.model");

module.exports = {
  // Get all movies with related Year, Type, and Episode data
  getAll: async (req, res) => {
    try {
      // Fetch all movies including related Year, Type, and Episode models
      const results = await movieService.getAll();

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
        where: { mov_id: id }, 
        include: [Year, Type, Country, Category, Director, Actor, Episode] 
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

  // Get a lasted movie order by updatedAt field
  getLatestMovies: async (req, res) => {
    try {
      // Fetch all movies including related Year, Type, and Episode models
      const results = await movieService.getLatestMovie();

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
  
  // Create a new movie
  insert: async (req, res) => {
    const data = req.body; // Extract data from the request body

    const t = await db.transaction();
    const validationErrors = movieValidator.validateMovieData(data); //validation data
    try {
      if (validationErrors) {
        // if error -> return fe
        return res.status(400).json({ message: validationErrors });
      }

      // Create a new movie with the provided data
      const result = await Movie.create({
        mov_name: data.name,
        mov_slug: data.slug,
        ori_name: data.origin_name,
        content: data.content,
        poster_url: data.poster_url,
        thumb_url: data.thumb_url,
        time: data.time,
        episode_current: data.episode_current,
        episode_total: data.episode_total,
        quality: data.quality,
        lang: data.lang,
        year_id: data.year_id,
        type_id: data.type_id,
        status: data.status
      }, { transaction: t });

      // Commit the transaction if movie creation is successful
      await t.commit();
      res.status(201).json({ message: 'Tạo phim thành công', result });
    } catch (error) {
      // Rollback the transaction in case of an error
      await t.rollback();
      console.log(error);
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

  // Create movie by api
  insertByApi: async (req, res) => {
    const data = req.body; // Extract data from the request body

    const transaction = await db.transaction();

    const validationErrors = await movieValidator.validateMovieData(data); //validation data
    try {
      if (validationErrors) {
        // if error -> return fe
        return res.status(400).json({ message: validationErrors });
      }

      // Handle types
      const type = await typeService.findType(data.movie.type, transaction);
      
      // Handle years
      const year = await yearService.findYear(data.movie.year[0].year_name, transaction);
      
      // Handle actors
      const actors = await Promise.all(data.movie.actor.map(async (act) => {
        const [actor] = await actorService.findOrCreateActor(
          act.act_name, 
          act.sort_order || 10, // Default value if null
          act.status !== undefined ? act.status : true, // Default value if null
          transaction
        );
        return actor;
      }));
  
      // Handle directors
      const directors = await Promise.all(data.movie.director.map(async (dir) => {
        const [director] = await directorService.findOrCreateDirector(
          dir.dir_name,
          dir.status !== undefined ? dir.status : true, 
          transaction
        );
        return director;
      }));
  
      // Handle categories
      const categories = await Promise.all(data.movie.category.map(async (cat) => {
        const [category] = await categoryService.findOrCreateCategory(
          cat.cat_name, 
          cat.cat_slug, 
          cat.status !== undefined ? cat.status : true, 
          transaction
        );
        return category;
      }));
  
      // Handle countries
      const countries = await Promise.all(data.movie.country.map(async (ctr) => {
        const [country] = await countryService.findOrCreateCountry(
          ctr.ctr_name, 
          ctr.ctr_slug,
          ctr.status !== undefined ? ctr.status : true, 
          transaction
        );
        return country;
      }));
      
      // Create movie
      const movie = await movieService.createMovie({
        mov_name: data.movie.name,
        mov_slug: data.movie.slug,
        ori_name: data.movie.originName,
        content: data.movie.content,
        poster_url: data.movie.posterUrl,
        thumb_url: data.movie.thumbUrl,
        time: data.movie.time,
        episode_current: data.movie.epCurrent,
        episode_total: data.movie.epTotal,
        quality: data.movie.quality,
        lang: data.movie.lang,
        year_id: year.year_id,
        type_id: type.type_id,
        status: data.movie.status,
        category: categories.map(cat => cat.dataValues.cat_id),
        country: countries.map(ctr => ctr.dataValues.ctr_id),
        actor: actors.map(act => act.dataValues.act_id),
        director: directors.map(dir => dir.dataValues.dir_id),
      }, transaction);
      

      // Create episode
      await Promise.all(data.episode.map(async (ep) => {
        const episode = await episodeService.createEpisode({
          ep_title: ep.filename,
          ep_name: ep.name,
          ep_slug: ep.slug,
          ep_link: ep.link_embed,
          sort_order: ep.sort_order,
          status: ep.status !== undefined ? ep.status : true,
          movie: [movie.dataValues.mov_id]
        }, transaction);
        return episode;
      }));
      
      // Commit transaction
      await transaction.commit();
      res.status(201).json({ message: 'Tạo phim thành công', movie });
    } catch (error) {
      if (transaction) await transaction.rollback();  // Ensure rollback happens if an error occurs
      console.error("Transaction error:", error);  // Log the exact error
      res.status(500).json({ error: 'Không thể tạo phim' });
    }
  }
};