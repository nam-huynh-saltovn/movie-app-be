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

  getBySlug: async(slug) => {
    const movie = await Movie.findOne({ where: { mov_slug: slug } });
    const formattedMovie = {
      ...movie.get(), // Lấy toàn bộ dữ liệu của movie
      createdAt: customFormat(movie.createdAt),
      updatedAt: customFormat(movie.updatedAt)
    };
    return formattedMovie;
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
  }
};
