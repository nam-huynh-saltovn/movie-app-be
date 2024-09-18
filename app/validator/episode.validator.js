const episodeService = require("../service/episode.service");

const validateLink = (url) => /^(ftp|http|https):\/\/[^ "]+$/.test(url);

module.exports = {
  validateEpisodeData: async (data) => {
    const requiredFields = [
      { field: 'name', message: "Tên tập phim không được để trống"},
      { field: 'slug', message: "Slug tập phim không được để trống" },
      { field: 'title', message: "Tiêu đề tập phim không được để trống" },
      { field: 'link', message: "Link không hợp lệ", check: validateLink},
    ];
  
    // Validate required fields
    for (const { field, message, check } of requiredFields) {
      const value = data[field];
      if (!value || (check && !check(value))) {
        return message;
      }
    }
  }
};