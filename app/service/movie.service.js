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

const includeCommonModels = (additionalModels = []) => [
  { model: Type, attributes: ['type_id', 'type_name', 'type_slug'] },
  { model: Year, attributes: ['year_id', 'year_name'] },
  { model: Category, attributes: ['cat_id', 'cat_name'], through: { attributes: [] } },
  { model: Actor, attributes: ['act_id', 'act_name'], through: { attributes: [] } },
  { model: Director, attributes: ['dir_id', 'dir_name'], through: { attributes: [] } },
  { model: Country, attributes: ['ctr_id', 'ctr_name', 'ctr_slug'], through: { attributes: [] } },
  ...additionalModels
];

const formatMovie = (movie) => ({
  ...movie.get(),
  createdAt: customFormat(movie.createdAt),
  updatedAt: customFormat(movie.updatedAt),
});

const fetchMovies = async (whereClause, offset, limit, additionalModels = []) => {
  const results = await Movie.findAll({
    where: whereClause,
    offset: parseInt(offset),
    limit: parseInt(limit),
    include: includeCommonModels(additionalModels),
  });
  return results.map(formatMovie);
};

module.exports = {
  getAll: async (offset, limit) => {
    return fetchMovies({}, offset, limit, [
      {
        model: Episode,
        attributes: [
          ['ep_id', 'id'],
          ['ep_title', 'filename'],
          ['ep_name', 'name'],
          ['ep_slug', 'slug'],
          ['ep_link', 'link_embed'],
          'sort_order',
          'status',
          'createdAt',
          'updatedAt'
        ],
      }
    ]);
  },

  getById: async (id) => {
    const movie = await Movie.findOne({ where: { mov_id: id }, include: includeCommonModels([Episode]) });
    return movie ? formatMovie(movie) : null;
  },

  getBySlug: async (slug) => {
    const movie = await Movie.findOne({ where: { mov_slug: slug }, include: includeCommonModels([Episode]) });
    return movie ? formatMovie(movie) : null;
  },

  getByType: async (typeSlug, offset, limit) => {
    const results = await Movie.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [
        ...includeCommonModels([
          {
            model: Type,
            attributes: ['type_id', 'type_name'],
            where: { type_slug: typeSlug }  // Filtering by the slug in the associated Category model
          }
        ])
      ],
    });
  
    return results.map(formatMovie);
  },

  getByCategory: async (catSlug, offset, limit) => {
    const results = await Movie.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [
        ...includeCommonModels([
          {
            model: Category,
            attributes: ['cat_id', 'cat_name'],
            where: { cat_slug: catSlug }  // Filtering by the slug in the associated Category model
          }
        ])
      ],
    });
  
    return results.map(formatMovie);
  },

  getByCountry: async (ctrSlug, offset, limit) => {
    const results = await Movie.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [
        ...includeCommonModels([
          {
            model: Country,
            attributes: ['ctr_id', 'ctr_name'],
            where: { ctr_slug: ctrSlug }  // Filtering by the slug in the associated Category model
          }
        ])
      ],
    });
  
    return results.map(formatMovie);
  },

  getByYear: async (year, offset, limit) => {
    const results = await Movie.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [
        ...includeCommonModels([
          {
            model: Year,
            attributes: ['year_id', 'year_name'],
            where: { year_name: year }  // Filtering by the slug in the associated Category model
          }
        ])
      ],
    });
  
    return results.map(formatMovie);
  },

  getLatestMovie: async (offset, limit) => {
    return fetchMovies({}, offset, limit, []).then(results =>
      results.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  },

  getByNameOrSlug: async (whereClause, offset, limit) => {
    return fetchMovies(whereClause, offset, limit);
  },

  filterMovie: async (includeClauses, offset, limit) => {
    const result = await Movie.findAll({
      include: 
        [...includeClauses,
        { model: Type, attributes: ['type_id', 'type_name', 'type_slug'], required: true},
        { model: Year, attributes: ['year_id', 'year_name'], required: true},
        { model: Category, attributes: ['cat_id', 'cat_name'], through: { attributes: [] }, required: true},
        { model: Actor, attributes: ['act_id', 'act_name'], through: { attributes: [] }, required: true},
        { model: Director, attributes: ['dir_id', 'dir_name'], through: { attributes: [] }, required: true},
        { model: Country, attributes: ['ctr_id', 'ctr_name', 'ctr_slug'], through: { attributes: [] }, required: true}
      ],
      offset: parseInt(offset),
      limit: parseInt(limit),
    });
    return result;
  },

  createMovie: async (movieData, transaction) => {
    const movie = await Movie.create(movieData, { transaction });

    if (movieData.category) await movie.addCategories(movieData.category, { transaction });
    if (movieData.country) await movie.addCountries(movieData.country, { transaction });
    if (movieData.actor) await movie.addActors(movieData.actor, { transaction });
    if (movieData.director) await movie.addDirectors(movieData.director, { transaction });

    return movie;
  },

  updateMovie: async (movieData, transaction) => {
    const movie = await Movie.findByPk(movieData.movie.id, { transaction });
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
      const categories = await Category.findAll({ where: { cat_id: movieData.movie.category.map(cat => cat.cat_id) }, transaction});
      await movie.setCategories(categories, { transaction });
    }
    if (movieData.movie.country) {
      const countries = await Country.findAll({ where: { ctr_id: movieData.movie.country.map(ctr => ctr.ctr_id) }, transaction});
      await movie.setCountries(countries, { transaction })
    }
    if (movieData.movie.actor) {
      const actors = await Actor.findAll({ where: { act_id: movieData.movie.actor.map(act => act.act_name.act_id) }, transaction});
      await movie.setActors(actors, { transaction });
    }
    if (movieData.movie.director){
      const directors = await Director.findAll({ where: { dir_id: movieData.movie.director.map(dir => dir.dir_id) }, transaction});
      await movie.setDirectors(directors, { transaction });
    }

    return movie;
  },

  deleteMovie: async (id, transaction) => {
    const movie = await Movie.findByPk(id, { transaction });
    if (!movie) throw new Error('Movie not found');


    await movie.setCategories([], { transaction });
    await movie.setCountries([], { transaction });
    await movie.setActors([], { transaction });
    await movie.setDirectors([], { transaction });
    await movie.setEpisodes([], { transaction });

    await movie.destroy({ transaction });
  }
};
