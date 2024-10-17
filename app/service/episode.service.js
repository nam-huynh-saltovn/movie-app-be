// Import models and database connection
const Episode = require("../models/episode.model");
const Movie = require("../models/movie.model");
const db = require('../models/index');

module.exports = {
  // create new episode
  createEpisode: async(episodeData, transaction) => {
    
    const episode = await db.Episode.create(episodeData, { transaction}, {raw: true});
    
    // add to intermediate table
    if (episodeData.movie) {
      await episode.addMovies([episodeData.movie], { transaction })
    }

    return episode
  },

  // find episode by id: if not exits -> create new
  findOrCreateEpisode: async (ep_id, ep_title, ep_name, ep_slug, link_embed, link_m3u8, status, transaction) => {
      return db.Episode.findOrCreate({
        where: { ep_id },
        defaults: { ep_title, ep_name, ep_slug, link_embed, link_m3u8, status },
        transaction,
      });
  },

  // get all episodes by mov_id have limit & offset
  getByMovieId: async (movId, whereClause, order, offset, limit) => {
    const result = await db.Episode.findAll({
      order: order,
      where: whereClause,
      include: {model: db.Movie, as: 'Movies', where: {mov_id: movId} , attributes: ['mov_id'], through: { attributes: [] }, required: true},
      offset: parseInt(offset),
      limit: parseInt(limit),
    });
    return result;
  },

  // get all episode by mov_id -> to update sort_order
  getAllByMovieId: async (movId) => {
    const result = await db.Episode.findAll({
      order: [ [ 'sort_order', 'ASC' ] ],
      include: {model: db.Movie, as: 'Movies', where: {mov_id: movId} , attributes: ['mov_id'], through: { attributes: [] }, required: true}
    });
    return result;
  },

  // update episode
  updateEpisode: async(episodeData, transaction) => {
    // Tìm episode trước khi tiến hành cập nhật
    const episode = await db.Episode.findByPk(episodeData.id, { transaction });
    
    // Cập nhật thông tin cơ bản của episode
    const result = await episode.update({
      ep_name: episodeData.name,
      ep_slug: episodeData.slug,
      ep_title: episodeData.title,
      link_embed: episodeData.link_embed,
      link_m3u8: episodeData.link_m3u8
    }, { transaction });

    return result;
  },

  // update sort_order
  updateSortOrder: async(id, sortOrder, transaction) => {
    const result = await db.Episode.update({ sort_order:sortOrder }, { where: { ep_id: id } }, { transaction });
    return result;
  },

  // delete episode
  deleteEpisode: async (id, transaction) => {
    // find movie
    const episode = await db.Episode.findByPk(id, { transaction });

    // Delete related records from junction tables (category_movie, country_movie, etc.)
    await episode.setMovies([], { transaction });  // Delete related with Movie

    // Sau khi xóa các quan hệ, xóa movie
    await episode.destroy({ transaction });
  }
}