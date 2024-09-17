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
  }
}