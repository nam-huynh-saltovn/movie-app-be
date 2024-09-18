// Import models and database connection
const Episode = require("../models/episode.model");

module.exports = {
  createEpisode: async(episodeData, transaction) => {
    const episode = await Episode.create(episodeData, { transaction}, {raw: true});
    
    // add to intermediate table
    if (episodeData.movie) {
      await episode.addMovies([episodeData.movie], { transaction })
    }

    return episode
  },

  findOrCreateDirector: async (ep_id, ep_title, ep_name, ep_slug, ep_link, status, transaction) => {
      return Episode.findOrCreate({
        where: { ep_id },
        defaults: { ep_title, ep_name, ep_slug, ep_link, status },
        transaction,
      });
  },

  updateEpisode: async(episodeData, transaction) => {
    // Tìm episode trước khi tiến hành cập nhật
    const episode = await Episode.findByPk(episodeData.id, { transaction });
    
    // Cập nhật thông tin cơ bản của episode
    const result = await episode.update({
      ep_name: episodeData.name,
      ep_slug: episodeData.slug,
      ep_title: episodeData.title,
      ep_link: episodeData.link
    }, { transaction });

    return result;
  },


  deleteEpisode: async (id, transaction) => {
    // find movie
    const episode = await Episode.findByPk(id, { transaction });

    // Delete related records from junction tables (category_movie, country_movie, etc.)
    await episode.setMovies([], { transaction });  // Delete related with Movie

    // Sau khi xóa các quan hệ, xóa movie
    await episode.destroy({ transaction });
  }
}