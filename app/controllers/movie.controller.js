// Import models and database connection
// const db = require("../config/connectDB");
const db = require('../models/index');
const { sequelize } = require('../config/connectDB');
const actorService = require("../service/actor.service");
const directorService = require("../service/director.service");
const categoryService = require("../service/category.service");
const countryService = require("../service/country.service");
const movieService = require("../service/movie.service");
const yearService = require("../service/year.service");
const typeService = require("../service/type.service");
const episodeService = require("../service/episode.service");
const movieValidator = require("../validator/movie.validator");
const episodeValidator = require('../validator/episode.validator');
const { Op } = require("sequelize");
const userService = require('../service/user.service');

// Helper functions
const paginate = (page, limit) => ({
  offset: (page - 1) * limit,
  page: parseInt(page),
  limit: parseInt(limit),
});

const sendResponse = (res, results, totalMovies, currentPage, limit) => {
  res.json({
    movies: results,
    totalMovies,
    currentPage,
    totalPages: Math.ceil(totalMovies / limit),
  });
};

const handleError = (res, error, message = "Có lỗi xảy ra", status = 500) => {
  console.error(error);
  res.status(status).json({ error: message });
};

module.exports = {
  // Get all movies with related Year, Type, and Episode data
  getAll: async (req, res) => {
    
    const { page = 1, limit = 10, sort = '' } = req.query;
    const { offset } = paginate(page, limit);

    try {
      const sortOrder = sort==2?[["updatedAt","ASC"]]:sort==3?[["mov_name","ASC"]]:[["updatedAt","DESC"]]

      const totalMovies = await db.Movie.count();
      const results = await movieService.getAll(sortOrder, offset, limit);

      sendResponse(res, results, totalMovies, page, limit);
    } catch (error) {
      handleError(res, error, 'Không thể lấy các phim này');
    }
  },

  // Get movies by id
  getById: async (req, res) => {
    const { id } = req.params;

    try {
      const movie = await movieService.getById(id);
      movie
        ? res.json(movie)
        : res.status(404).json({ error: 'Không tìm thấy phim nào' });
    } catch (error) {
      handleError(res, error, 'Không thể lấy phim này');
    }
  },

  // Get movies by slug
  getBySlug: async (req, res) => {
    const { slug } = req.params;

    try {
      const movie = await movieService.getBySlug(slug);
      movie
        ? res.json(movie)
        : res.status(404).json({ error: 'Không tìm thấy phim nào' });
    } catch (error) {
      handleError(res, error, 'Không thể lấy phim này');
    }
  },

  // Get movies by type
  getByType: async (req, res) => {
    const { typeSlug } = req.params;
    const { page = 1, limit = 15 } = req.query;
    const { offset } = paginate(page, limit);

    try {
      const totalMovies = await db.Movie.count({
        include: [{ model: db.Type, as: 'Type', where: { type_slug: typeSlug } }],
      });
      const results = await movieService.getByType(typeSlug, offset, limit);

      results
        ? sendResponse(res, results, totalMovies, page, limit)
        : res.status(404).json({ error: 'Không tìm thấy phim nào' });
    } catch (error) {
      handleError(res, error, 'Không thể lấy phim này');
    }
  },

  // Get movies by category
  getByCategory: async (req, res) => {
    const { catSlug } = req.params;
    const { page = 1, limit = 15 } = req.query;
    const { offset } = paginate(page, limit);

    try {
      const totalMovies = await db.Movie.count({
        include: [{ model: db.Category, as: 'Categories', where: { cat_slug: catSlug } }],
      });
      const results = await movieService.getByCategory(catSlug, offset, limit);

      results
        ? sendResponse(res, results, totalMovies, page, limit)
        : res.status(404).json({ error: 'Không tìm thấy phim nào' });
    } catch (error) {
      handleError(res, error, 'Không thể lấy phim này');
    }
  },

  // Get movies by country
  getByCountry: async (req, res) => {
    const { ctrSlug } = req.params;
    const { page = 1, limit = 15 } = req.query;
    const { offset } = paginate(page, limit);

    try {
      const totalMovies = await db.Movie.count({
        include: [{ model: db.Country, as: 'Countries', where: { ctr_slug: ctrSlug } }],
      });
      const results = await movieService.getByCountry(ctrSlug, offset, limit);

      results
        ? sendResponse(res, results, totalMovies, page, limit)
        : res.status(404).json({ error: 'Không tìm thấy phim nào' });
    } catch (error) {
      handleError(res, error, 'Không thể lấy phim này');
    }
  },

  // Get movies by year
  getByYear: async (req, res) => {
    const { year } = req.params;
    const { page = 1, limit = 15 } = req.query;
    const { offset } = paginate(page, limit);

    try {
      const totalMovies = await db.Movie.count({
        include: [{ model: db.Year, as: 'Year', where: { year_name: year } }],
      });
      const results = await movieService.getByYear(year, offset, limit);

      results
        ? sendResponse(res, results, totalMovies, page, limit)
        : res.status(404).json({ error: 'Không tìm thấy phim nào' });
    } catch (error) {
      handleError(res, error, 'Không thể lấy phim này');
    }
  },

  // Get latest movies
  getLatestMovies: async (req, res) => {
    const { page = 1, limit = 15 } = req.query;
    const { offset } = paginate(page, limit);

    try {
      const totalMovies = await db.Movie.count();
      const results = await movieService.getLatestMovie(offset, limit);

      results.length > 0
        ? sendResponse(res, results, totalMovies, page, limit)
        : res.status(404).json({ error: 'Không tìm thấy phim nào' });
    } catch (error) {
      handleError(res, error, 'Không thể lấy các phim này');
    }
  },

  // Search movie by name or slug
  searchByNameOrSlug: async (req, res) => {
    const { query, page = 1, limit = 10, sort = 1 } = req.query;
    
    try {
      // Build pagination options
      const offset = (page - 1) * limit;

      const sortOrder = sort==2?[["updatedAt","DESC"]]:sort==3?[["updatedAt","ASC"]]:[["mov_name","DESC"]]
      
      // If query is provided, search both 'name' and 'slug'
      const whereClause = query 
        ? {
          [Op.or]: [
            { mov_name: { [Op.like]: `%${query}%` } },  // find by name
            { mov_slug: { [Op.like]: `%${query}%` } },  // find by slug
            { ori_name: { [Op.like]: `%${query}%` } }   // find by origin name
          ]
        }
        : {};

      const result = await movieService.getByNameOrSlug(whereClause, sortOrder, offset, limit);

      res.status(200).json({
        movies: result.rows,
        totalMovies: result.count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(result.count / limit),
      });
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy phim", error });
    }
  },
  
  // Search movie by name or slug
  filterMovie: async (req, res) => {
    const { page = 1, limit = 10, sort = 1 } = req.query;
  
    try {
      // Build pagination options
      const offset = (page - 1) * limit;
  
      const sortOrder = sort == 2 ? [["updatedAt", "ASC"]] : sort == 3 ? [["mov_name", "ASC"]] : [["updatedAt", "DESC"]];

      // Build where clause for movie search
      const whereClause = {};
      const conditions = [
        req.query.query && { mov_name: { [Op.like]: `%${req.query.query}%` }},
        req.query.query && { mov_slug: { [Op.like]: `%${req.query.query}%` }},
        req.query.query && { ori_name: { [Op.like]: `%${req.query.query}%` }},
        req.query.lang && { lang: { [Op.like]: `%${req.query.lang}%` }},
        req.query.quality && { quality: req.query.quality }
      ].filter(Boolean); // Loại bỏ các giá trị `false` hoặc `undefined`
  
      if (conditions.length) {
        whereClause[Op.or] = conditions;
      }
  
      // Build include clauses for relations
      const includeClauses = [];
  
      // Create a mapping of filters to their respective models and fields
      const filters = [
        { key: 'type', model: db.Type, as: 'Type', field: 'type_slug' },
        { key: 'year', model: db.Year, as: 'Year', field: 'year_name' },
        { key: 'category', model: db.Category, as: 'Categories', field: 'cat_slug' },
        { key: 'country', model: db.Country, as: 'Countries', field: 'ctr_slug' },
        { key: 'actor', model: db.Actor, as: 'Actors', field: 'act_name' },
        { key: 'director', model: db.Director, as: 'Directors', field: 'dir_name' },
      ];

      filters.forEach(({ key, model, as, field }) => {
        if (req.query[key]) {
          includeClauses.push({
            model,
            as,
            where: { [field]: { [Op.like]: `%${req.query[key]}%` } },
            require: true
          });
        }else{
          includeClauses.push({
            model,
            as,
            require: false
          });
        }
      });
  
      // Fetch filtered movies with pagination and HAVING clause
      const result = await movieService.filterMovie(whereClause, includeClauses, sortOrder, offset, limit);
  
      res.status(200).json({
        movies: result.rows,
        totalMovies: result.count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(result.count / limit),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Không thể lấy phim", error });
    }
  },

  // Create a new movie
  insert: async (req, res) => {
    const data = req.body; // Extract data from the request body
    const transaction = await sequelize.transaction(); // Start a transaction

    const validationErrors = movieValidator.validateMovieData(data); // Validate the movie data
    try {
      if (validationErrors) {
        // Return validation errors if found
        return res.status(400).json({ message: validationErrors });
      }

      // Create a new movie with the provided data
      const movie = await db.Movie.create({
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
      }, { transaction });

      await transaction.commit(); // Commit the transaction if the movie is created successfully
      res.status(201).json({ message: 'Movie created successfully', movie });
    } catch (error) {
      await transaction.rollback(); // Rollback the transaction in case of an error
      console.error(error);
      res.status(500).json({ error: 'Unable to create movie' });
    }
  },

  // Create a new movie using API data
  insertByApi: async (req, res) => {
    const data = req.body; // Extract data from the request body
    const transaction = await sequelize.transaction(); // Start a transaction

    const validationErrors = await movieValidator.validateMovieData(data); // Validate the movie data
    const validationEpisodeErrors = await episodeValidator.validateEpisodeData(data); // Validate the movie data
    try {
      if (validationErrors) {
        // Return validation errors if found
        return res.status(400).json({ message: validationErrors });
      }

      if (validationEpisodeErrors) {
        // Return validation errors if found
        console.log(validationEpisodeErrors);
        
        return res.status(400).json({ message: validationEpisodeErrors });
      }

      // Find or create related data (type, year, actors, directors, categories, countries)
      const [type, year] = await Promise.all([
        typeService.findTypeBySlug(data.movie.type, transaction),
        yearService.findYear(data.movie.year, transaction)
      ]);
      
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
      
      //handle user
      const user = await userService.getById(data.user, transaction);

      // Create movie and related episodes
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
        user_id: user.user_id,
        status: data.movie.status,
        category: categories.map(cat => cat.dataValues.cat_id),
        country: countries.map(ctr => ctr.dataValues.ctr_id),
        actor: actors.map(act => act.dataValues.act_id),
        director: directors.map(dir => dir.dataValues.dir_id),
      }, transaction);

      await Promise.all(data.episode.map(ep => 
        episodeService.createEpisode({
          ep_title: ep.filename,
          ep_name: ep.name,
          ep_slug: ep.slug,
          link_embed: ep.link_embed,
          link_m3u8: ep.link_m3u8,
          sort_order: ep.sort_order,
          user_id: user.user_id,
          status: ep.status?ep.status:true,
          movie: [movie.dataValues.mov_id]
        }, transaction)
      ));

      await transaction.commit(); // Commit the transaction if everything is successful
      res.status(201).json({ message: 'Phim đã được tạo thành công', movie });
    } catch (error) {
      await transaction.rollback(); // Rollback the transaction in case of an error
      console.error('Transaction error:', error);
      res.status(500).json({ error: 'Không thể tạo phim' });
    }
  },

  // Update movie by ID
  update: async (req, res) => {
    const movie = req.body; // Extract the updated movie data from the request body
    const transaction = await sequelize.transaction(); // Start a transaction

    const validationErrors = await movieValidator.validateMovieData(movie); // Validate the movie data
    try {
      if (validationErrors) {
        // Return validation errors if found
        return res.status(400).json({ message: validationErrors });
      }

      // Update the movie data
      const updatedMovie = await movieService.updateMovie(movie, transaction);

      await transaction.commit(); // Commit the transaction if the update is successful
      res.status(200).json({ message: 'Cập nhật phim thành công', updatedMovie });
    } catch (error) {
      await transaction.rollback(); // Rollback the transaction in case of an error
      console.error('Transaction error:', error);
      res.status(500).json({ error: 'Không thể cập nhật phim' });
    }
  },

  // Delete movie by ID
  delete: async (req, res) => {
    const id = req.params.id; // Extract the movie ID from the URL parameters
    const transaction = await sequelize.transaction(); // Start a transaction
    console.log("id: ", id);
    
    try {
      await movieService.deleteMovie(id, transaction); // Delete the movie by ID
      await transaction.commit(); // Commit the transaction if the deletion is successful
      res.status(200).json({ message: 'Xóa phim thành công' });
    } catch (error) {
      await transaction.rollback(); // Rollback the transaction in case of an error
      console.error('Transaction error:', error);
      res.status(500).json({ error: 'Không thể xóa phim' });
    }
  }
};