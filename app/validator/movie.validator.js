const movieService = require("../service/movie.service");

module.exports = {
  validateMovieData: async (data) => {
    const requiredFields = [
      { field: 'name', message: "Tên phim phải từ 1 đến 255 ký tự", check: v => v.length >= 1 && v.length <= 255 },
      { field: 'slug', message: "Slug phim không được để trống" },
      { field: 'originName', message: "Tên gốc của phim không được để trống" },
      { field: 'content', message: "Nội dung phải từ 50 đến 3000   ký tự", check: v => v.length >= 50 && v.length <= 3000},
      { field: 'posterUrl', message: "Poster không được để trống" },
      { field: 'thumbUrl', message: "Thumbnail không được để trống" },
      { field: 'year', message: "Năm phát hành không hợp lệ", check: v => Array.isArray(v) && v.length > 0 },
      { field: 'category', message: "Chọn ít nhất 1 thể loại", check: v => v.length > 0 },
      { field: 'country', message: "Chọn ít nhất 1 quốc gia", check: v => v.length > 0 },
      { field: 'actor', message: "Danh sách diễn viên không được để trống", check: v => v.length > 0 }
    ];
  
    // Validate required fields
    for (const { field, message, check } of requiredFields) {
      const value = data.movie[field];
      if (!value || (check && !check(value))) {
        return message;
      }
    }

    // Check if the slug exists in the database
    const slugExists = await movieService.getBySlug(data.movie.slug);
    if (slugExists) {
      return "Slug phim đã tồn tại trong cơ sở dữ liệu";
    }
  }
};