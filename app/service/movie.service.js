// Import models and database connection
const db = require('../models/index');
const customFormat = require("../common/customFormat");

// include related model
const includeCommonModels = (additionalModels = []) => [
  { model: db.Type, as: 'Type', attributes: ['type_id', 'type_name', 'type_slug'] },
  { model: db.Year, as: 'Year', attributes: ['year_id', 'year_name'] },
  { model: db.Category, as: 'Categories', attributes: ['cat_id', 'cat_name'], through: { attributes: [] } },
  { model: db.Actor, as: 'Actors', attributes: ['act_id', 'act_name'], through: { attributes: [] } },
  { model: db.Director, as: 'Directors', attributes: ['dir_id', 'dir_name'], through: { attributes: [] } },
  { model: db.Country, as: 'Countries', attributes: ['ctr_id', 'ctr_name', 'ctr_slug'], through: { attributes: [] } },
  ...additionalModels
];

// format time in createdAt & updatedAt
const formatMovie = (movie) => ({
  ...movie.get(),
  createdAt: customFormat(movie.createdAt),
  updatedAt: customFormat(movie.updatedAt),
});

// common find all query
const fetchMovies = async (whereClause, offset, limit, additionalModels = [], order = []) => {
  const results = await db.Movie.findAll({
    order: order,
    where: whereClause,
    offset: parseInt(offset),
    limit: parseInt(limit),
    include: includeCommonModels(additionalModels),
  });
  return results.map(formatMovie);
};

module.exports = {
  // get all movies
  getAll: async (sortOrder, offset, limit) => {
    return fetchMovies({}, offset, limit, [], sortOrder);
  },

  // get movie by id
  getById: async (id) => {
    const movie = await db.Movie.findOne({ where: { mov_id: id }, include: includeCommonModels([{model: db.Episode, as:'Episodes'}]) });
    return movie ? formatMovie(movie) : null;
  },

  // get movie by slug
  getBySlug: async (slug) => {
    const movie = await db.Movie.findOne({ where: { mov_slug: slug }, include: includeCommonModels([{model: db.Episode, as: 'Episodes'}]) });
    return movie ? formatMovie(movie) : null;
  },

  // get movie by status
  getByStatus: async (status) => {
    const movie = await db.Movie.findAll({
      where: { status: status }, 
      include: [{model: db.Episode, as: 'Episodes', attributes: ['ep_id', 'ep_name', 'ep_slug'], through: {attributes: []}}],
      distinct: true
    });
    return movie;
  },

  // get movie by type
  getByType: async (typeSlug, offset, limit) => {
    const results = await db.Movie.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [
        ...includeCommonModels([
          {
            model: db.Type,
            as: 'Type',
            attributes: ['type_id', 'type_name'],
            where: { type_slug: typeSlug }  // Filtering by the slug in the associated Category model
          }
        ])
      ],
    });
  
    return results.map(formatMovie);
  },

  // get movie by category
  getByCategory: async (catSlug, offset, limit) => {
    const results = await db.Movie.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [
        ...includeCommonModels([
          {
            model: db.Category,
            as: 'Categories',
            attributes: ['cat_id', 'cat_name'],
            where: { cat_slug: catSlug }  // Filtering by the slug in the associated Category model
          }
        ])
      ],
    });
  
    return results.map(formatMovie);
  },

  // get movie by country
  getByCountry: async (ctrSlug, offset, limit) => {
    const results = await db.Movie.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [
        ...includeCommonModels([
          {
            model: db.Country,
            as: 'Countries',
            attributes: ['ctr_id', 'ctr_name'],
            where: { ctr_slug: ctrSlug }  // Filtering by the slug in the associated Category model
          }
        ])
      ],
    });
  
    return results.map(formatMovie);
  },

  // get movie by year
  getByYear: async (year, offset, limit) => {
    const results = await db.Movie.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [
        ...includeCommonModels([
          {
            model: db.Year,
            as: 'Year',
            attributes: ['year_id', 'year_name'],
            where: { year_name: year }  // Filtering by the slug in the associated Category model
          }
        ])
      ],
    });
  
    return results.map(formatMovie);
  },

  // get latest movies
  getLatestMovie: async (offset, limit) => {
    return fetchMovies({}, offset, limit, [], [['updatedAt', 'DESC']]);
  },

  // get movie by name or slug
  getByNameOrSlug: async (whereClause, sortOrder, offset, limit) => {
    const result = await db.Movie.findAndCountAll({
      where: whereClause,
      order: sortOrder,
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [
        { model: db.Type, as: 'Type', attributes: ['type_id', 'type_name', 'type_slug'], required: false },
        { model: db.Year, as: 'Year', attributes: ['year_id', 'year_name'], required: false },
        { model: db.Category, as: 'Categories', attributes: ['cat_id', 'cat_name'], through: { attributes: [] }, required: false },
        { model: db.Actor, as: 'Actors', attributes: ['act_id', 'act_name'], through: { attributes: [] }, required: false },
        { model: db.Director, as: 'Directors', attributes: ['dir_id', 'dir_name'], through: { attributes: [] }, required: false },
        { model: db.Country, as: 'Countries', attributes: ['ctr_id', 'ctr_name', 'ctr_slug'], through: { attributes: [] }, required: false }
      ],
      distinct: true
    });
    
    return {rows: result.rows.map(formatMovie), count: result.count};
  },

  // filter movie by year, type, category, country, actor, director, mov_name, mov_slug, ori_name
  filterMovie: async (whereClause, includeClauses, sortOrder=[['updatedAt', 'DESC']], offset, limit) => {
    const result = await db.Movie.findAndCountAll({
      where: whereClause,
      include: includeClauses,
      order: sortOrder,
      offset: parseInt(offset),
      limit: parseInt(limit),
      distinct: true
    });
    
    return {rows: result.rows.map(formatMovie), count: result.count};
  },

  // create new movie
  createMovie: async (movieData, transaction) => {
    const movie = await db.Movie.create(movieData, { transaction });
    
    if (movieData.category) await movie.addCategories(movieData.category, { transaction });
    if (movieData.country) await movie.addCountries(movieData.country, { transaction });
    if (movieData.actor) await movie.addActors(movieData.actor, { transaction });
    if (movieData.director) await movie.addDirectors(movieData.director, { transaction });
    
    return movie;
  },

  // update movie
  updateMovie: async (movieData, transaction) => {
    const movie = await db.Movie.findByPk(movieData.movie.id, { transaction });
    if (!movie) throw new Error('Movie not found');

    await movie.update({
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
      year_id: movieData.movie.year,
      type_id: movieData.movie.type
    }, { transaction });

    if (movieData.movie.category) {
      const categories = await db.Category.findAll({ where: { cat_id: movieData.movie.category.map(cat => cat.cat_id) }, transaction});
      await movie.setCategories(categories, { transaction });
    }
    if (movieData.movie.country) {
      const countries = await db.Country.findAll({ where: { ctr_id: movieData.movie.country.map(ctr => ctr.ctr_id) }, transaction});
      await movie.setCountries(countries, { transaction })
    }
    if (movieData.movie.actor) {
      const actors = await db.Actor.findAll({ where: { act_id: movieData.movie.actor.map(act => act.act_id) }, transaction});
      await movie.setActors(actors, { transaction });
    }
    if (movieData.movie.director){
      const directors = await db.Director.findAll({ where: { dir_id: movieData.movie.director.map(dir => dir.dir_id) }, transaction});
      await movie.setDirectors(directors, { transaction });
    }

    return movie;
  },

  // delete movie
  deleteMovie: async (id, transaction) => {
    const movie = await db.Movie.findByPk(id, { transaction });
    if (!movie) throw new Error('Movie not found');


    await movie.setCategories([], { transaction });
    await movie.setCountries([], { transaction });
    await movie.setActors([], { transaction });
    await movie.setDirectors([], { transaction });
    await movie.setEpisodes([], { transaction });

    await movie.destroy({ transaction });
  }
};
