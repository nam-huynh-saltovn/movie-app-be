// Import models and database connection
const customFormat = require("../common/customFormat");
const Actor = require("../models/actor.model");
const Category = require("../models/category.model");
const Country = require("../models/country.model");
const Director = require("../models/director.model");
const Episode = require("../models/episode.model");
const Movie = require("../models/movie.model");
const Type = require("../models/type.model");
const Year = require("../models/year.model");

const formatData = (movie) =>{
  // Format the movie object
  const formatTimestamps = (object) => {
    return {
      ...object.get(),
      createdAt: customFormat(object.createdAt),
      updatedAt: customFormat(object.updatedAt),
    };
  };

  const formattedMovie = {
    ...formatTimestamps(movie),
    Year: formatTimestamps(movie.Year),
    Type: formatTimestamps(movie.Type),
    Episodes: movie.Episodes.map(episode => formatTimestamps(episode)),
    Actors: movie.Actors.map(actor => formatTimestamps(actor)),
    Directors: movie.Directors.map(director => formatTimestamps(director)),
    Categories: movie.Categories.map(category => formatTimestamps(category)),
    Countries: movie.Countries.map(country => formatTimestamps(country)),
  };

  return formattedMovie;
}

module.exports = {
  getAll: async () => {
    // Fetch all movies including related Year, Type, and Episode models
    const results = await Movie.findAll({
      include: 
      [Year, 
      Type, 
      {
        model: Episode,
        attributes: [
          ['ep_id', 'id'], 
          ['ep_title', 'filename'], // Rename ep_title to filename
          ['ep_name', 'name'],      // Rename ep_name to name
          ['ep_slug', 'slug'],      // Rename ep_slug to slug
          ['ep_link', 'link_embed'],// Rename ep_link to link_embed
          'sort_order',
          'status',
          'createdAt',
          'updatedAt'
        ],
      },
      Actor,
      Director,
      Country,
      Category
    ] });

    // Format the results
  const formattedResults = results.map(movie => {
    // Format the movie object
    return formatData(movie);
  });

  return formattedResults;
  },

  getById: async(id) => {
    const movie = await Movie.findOne({ where: { mov_id: id }, include: [Year, Type, Country, Category, Director, Actor, Episode] });
    if(movie){
      const formattedMovie = {
        ...movie.get(), // Lấy toàn bộ dữ liệu của movie
        createdAt: customFormat(movie.createdAt),
        updatedAt: customFormat(movie.updatedAt)
      };
      return formattedMovie;
    }
  },

  getBySlug: async(slug) => {
    const movie = await Movie.findOne({ where: { mov_slug: slug }, include: [Year, Type, Country, Category, Director, Actor, Episode] });
    if(movie){
      const formattedMovie = {
        ...movie.get(), // Lấy toàn bộ dữ liệu của movie
        createdAt: customFormat(movie.createdAt),
        updatedAt: customFormat(movie.updatedAt)
      };
      return formattedMovie;
    }
  },

  getLatestMovie: async () => {
    const results = await Movie.findAll({
      limit: 20,
      order: [['updatedAt', 'DESC']],
      include: [Year, Type, Category, Actor, Director, Country, Episode] 
    });
    
    const formattedResults = results.map(movie => {
      // Format the movie object
      return formatData(movie);
    });
    
    return formattedResults;
  },

  createMovie: async (movieData, transaction) => {
    const movie = await Movie.create(movieData, { transaction });

    // add to intermediate table
    if (movieData.category) {
      await movie.addCategories(movieData.category, { transaction });
    }

    if (movieData.country) {
      await movie.addCountries(movieData.country, { transaction });
    }

    if (movieData.actor) {
      await movie.addActors(movieData.actor, { transaction });
    }

    if (movieData.director) {
      await movie.addDirectors(movieData.director, { transaction });
    }

    return movie;
  },

  updateMovie: async (movieData, transaction) => {
    // Tìm movie trước khi tiến hành cập nhật
    const movie = await Movie.findByPk(movieData.movie.id, { transaction });
    
    // Cập nhật thông tin cơ bản của movie
    const result = await movie.update({
      mov_name: movieData.movie.name,
      mov_slug: movieData.movie.slug,
      ori_name: movieData.movie.originName,
      content: movieData.movie.content,
      poster_url: movieData.movie.posterUrl,
      thumb_url: movieData.movie.thumbUrl,
      time: movieData.movie.time,
      episode_current: movieData.movie.currentEp,
      episode_total: movieData.movie.totalEp,
      quality: movieData.movie.quality,
      lang: movieData.movie.lang,
      year_id: movieData.movie.year,    // Cập nhật year
      type_id: movieData.movie.type     // Cập nhật type
    }, { transaction });

    // Cập nhật quan hệ nhiều-nhiều với Category
    if (movieData.movie.category) {
      const categoryIds = movieData.movie.category.map(cat => cat.cat_id);
      const categories = await Category.findAll({ where: { cat_id: categoryIds }, transaction});
      await movie.setCategories(categories, { transaction });
    }
    
    // Cập nhật quan hệ nhiều-nhiều với Country
    if (movieData.movie.country) {
      const countryIds = movieData.movie.country.map(ctr => ctr.ctr_id);
      const countries = await Country.findAll({ where: { ctr_id: countryIds }, transaction});
      await movie.setCountries(countries, { transaction });
    }
    
    // Cập nhật quan hệ nhiều-nhiều với Actor
    if (movieData.movie.actor) {
      const actorIds = movieData.movie.actor.map(act => act.act_name.act_id);
      const actors = await Actor.findAll({ where: { act_id: actorIds }, transaction});
      await movie.setActors(actors, { transaction });
    }
    
    // Cập nhật quan hệ nhiều-nhiều với Director
    if (movieData.movie.director) {
      const directorIds = movieData.movie.director.map(dir => dir.dir_id);
      const directors = await Director.findAll({ where: { dir_id: directorIds }, transaction});
      await movie.setDirectors(directors, { transaction });
    }

    return result;
  },

  deleteMovie: async (id, transaction) => {
    // find movie
    const movie = await Movie.findByPk(id, { transaction });

    // Delete related records from junction tables (category_movie, country_movie, etc.)
    await movie.setCategories([], { transaction });  // Delete related with Category
    await movie.setCountries([], { transaction });   // Delete related with Country
    await movie.setActors([], { transaction });      // Delete related with Actor
    await movie.setDirectors([], { transaction });   // Delete related with Director
    await movie.setEpisodes([], { transaction });   // Delete related with Episode

    // Sau khi xóa các quan hệ, xóa movie
    await movie.destroy({ transaction });
  }
};
