// Import models and database connection
const db = require("../common/connect");
const Movie = require("../models/movie.model");

const actorService = require("../service/actor.service");
const directorService = require("../service/director.service");
const categoryService = require("../service/category.service");
const countryService = require("../service/country.service");
const movieService = require("../service/movie.service");
const yearService = require("../service/year.service");
const typeService = require("../service/type.service");
const episodeService = require("../service/episode.service");
const movieValidator = require("../validator/movie.validator");
const { Op } = require("sequelize");
const Category = require("../models/category.model");
const Year = require("../models/year.model");
const Country = require("../models/country.model");
const Director = require("../models/director.model");
const Actor = require("../models/actor.model");
const Type = require("../models/type.model");

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
    const { page = 1, limit = 10 } = req.query;
    const { offset } = paginate(page, limit);

    try {
      const totalMovies = await Movie.count();
      const results = await movieService.getAll(offset, limit);

      results.length > 0
        ? sendResponse(res, results, totalMovies, page, limit)
        : res.status(404).json({ error: 'Không tìm thấy phim nào' });
    } catch (error) {
      handleError(res, error, 'Không thể lấy các phim này');
    }
  },

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

  getByType: async (req, res) => {
    const { typeSlug } = req.params;
    const { page = 1, limit = 15 } = req.query;
    const { offset } = paginate(page, limit);

    try {
      const totalMovies = await Movie.count({
        include: [{ model: Type, where: { type_slug: typeSlug } }],
      });
      const results = await movieService.getByType(typeSlug, offset, limit);

      results
        ? sendResponse(res, results, totalMovies, page, limit)
        : res.status(404).json({ error: 'Không tìm thấy phim nào' });
    } catch (error) {
      handleError(res, error, 'Không thể lấy phim này');
    }
  },

  getByCategory: async (req, res) => {
    const { catSlug } = req.params;
    const { page = 1, limit = 15 } = req.query;
    const { offset } = paginate(page, limit);

    try {
      const totalMovies = await Movie.count({
        include: [{ model: Category, where: { cat_slug: catSlug } }],
      });
      const results = await movieService.getByCategory(catSlug, offset, limit);

      results
        ? sendResponse(res, results, totalMovies, page, limit)
        : res.status(404).json({ error: 'Không tìm thấy phim nào' });
    } catch (error) {
      handleError(res, error, 'Không thể lấy phim này');
    }
  },

  getByCountry: async (req, res) => {
    const { ctrSlug } = req.params;
    const { page = 1, limit = 15 } = req.query;
    const { offset } = paginate(page, limit);

    try {
      const totalMovies = await Movie.count({
        include: [{ model: Country, where: { ctr_slug: ctrSlug } }],
      });
      const results = await movieService.getByCountry(ctrSlug, offset, limit);

      results
        ? sendResponse(res, results, totalMovies, page, limit)
        : res.status(404).json({ error: 'Không tìm thấy phim nào' });
    } catch (error) {
      handleError(res, error, 'Không thể lấy phim này');
    }
  },

  getByYear: async (req, res) => {
    const { year } = req.params;
    const { page = 1, limit = 15 } = req.query;
    const { offset } = paginate(page, limit);

    try {
      const totalMovies = await Movie.count({
        include: [{ model: Year, where: { year_name: year } }],
      });
      const results = await movieService.getByYear(year, offset, limit);

      results
        ? sendResponse(res, results, totalMovies, page, limit)
        : res.status(404).json({ error: 'Không tìm thấy phim nào' });
    } catch (error) {
      handleError(res, error, 'Không thể lấy phim này');
    }
  },

  getLatestMovies: async (req, res) => {
    const { page = 1, limit = 15 } = req.query;
    const { offset } = paginate(page, limit);

    try {
      const totalMovies = await Movie.count();
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
    const { query, page = 1, limit = 10 } = req.query;

    try {
      // Build pagination options
      const offset = (page - 1) * limit;
      
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

      const totalMovies = await Movie.count({  where: whereClause });
  
      const result = await movieService.getByNameOrSlug(whereClause, offset, limit);

      res.status(200).json({
        movies: result,
        totalMovies: totalMovies,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalMovies / limit),
      });
    } catch (error) {
      res.status(500).json({ message: "Không thể lấy phim", error });
    }
  },
  
  // Search movie by name or slug
  filterMovie: async (req, res) => {
    const { page=1, limit=10 } = req.query;
  
    try {
      // Build pagination options
      const offset = (page - 1) * limit;
  
      // Build include clauses for relations
      const includeClauses = [];

      // Create a mapping of filters to their respective models and fields
      const filters = [
        { key: 'year', model: Year, field: 'year_name' },
        { key: 'type', model: Type, field: 'type_slug' },
        { key: 'category', model: Category, field: 'cat_slug' },
        { key: 'country', model: Country, field: 'ctr_slug' },
        { key: 'actor', model: Actor, field: 'act_name' },
        { key: 'director', model: Director, field: 'dir_name' },
      ];

      // Loop through each filter and add to includeClauses if a query value exists
      filters.forEach(({ key, model, field }) => {
        if (req.query[key]) {
          includeClauses.push({
            model,
            where: { [field]: { [Op.like]: `%${req.query[key]}%` } },
            required: true, // inner join to ensure we only get movies with this filter
          });
        }
      });

      // Thêm filter cho category nhưng vẫn lấy tất cả category của movie
      if (req.query.category) {
        includeClauses.push({
          model: Category,
          where: { cat_slug: { [Op.like]: `%${req.query.category}%` } },
          required: true, // Inner join
        });
      }
  
      // Count total movies matching the filter
      const totalMovies = await Movie.count({include: includeClauses });
  
      // Fetch filtered movies with pagination
      const result = await movieService.filterMovie(includeClauses, offset, limit);
  
      res.status(200).json({
        movies: result,
        totalMovies: totalMovies,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalMovies / limit),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Không thể lấy phim", error });
    }
  },

  // Create a new movie
  insert: async (req, res) => {
    const data = req.body; // Extract data from the request body
    const transaction = await db.transaction(); // Start a transaction

    const validationErrors = movieValidator.validateMovieData(data); // Validate the movie data
    try {
      if (validationErrors) {
        // Return validation errors if found
        return res.status(400).json({ message: validationErrors });
      }

      // Create a new movie with the provided data
      const movie = await Movie.create({
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
    const transaction = await db.transaction(); // Start a transaction

    const validationErrors = await movieValidator.validateMovieData(data); // Validate the movie data
    try {
      if (validationErrors) {
        // Return validation errors if found
        return res.status(400).json({ message: validationErrors });
      }

      // Find or create related data (type, year, actors, directors, categories, countries)
      const [type, year] = await Promise.all([
        typeService.findType(data.movie.type, transaction),
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
          ep_link: ep.link_embed,
          sort_order: ep.sort_order,
          status: ep.status ?? true,
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
    const transaction = await db.transaction(); // Start a transaction

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
    const transaction = await db.transaction(); // Start a transaction
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