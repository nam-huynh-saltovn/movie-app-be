// Popular video file extensions
const videoExtensions = [
  'mp4', 'webm', 'ogg', 'mkv', 'flv', 'avi', 'mov', 'wmv', 'mpeg', 'mpg', '3gp', 'm4v', 'm3u8'
];

// Function to check if URL is in correct format (FTP, HTTP, HTTPS)
const validateLink = (url) => /^(ftp|http|https):\/\/[^ "]+$/.test(url);

// Function to check if URL is a video file
const isVideoFile = (url) => {
  try {
    const parsedUrl = new URL(url);

    // Kiểm tra đuôi file trong pathname và cả query string
    const extensionInPath = parsedUrl.pathname.split('.').pop();
    const extensionInQuery = parsedUrl.searchParams.get('url')?.split('.').pop();
    
    return videoExtensions.includes(extensionInPath.toLowerCase()) || 
           (extensionInQuery && videoExtensions.includes(extensionInQuery.toLowerCase()));
  } catch (error) {
    return false;
  }
};

// Function to check if URL is a valid video link
const validateVideoLink = (url) => {
  return validateLink(url) && isVideoFile(url);
};

module.exports = {
  validateEpisodeData: async (data) => {
    const requiredFields = [
      { field: 'name', message: "Tên tập phim không được để trống"},
      { field: 'slug', message: "Slug tập phim không được để trống" },
      { field: 'filename', message: "Tiêu đề tập phim không được để trống" },
      { field: 'link_embed', message: "Link video không hợp lệ", check: validateVideoLink},
      { field: 'link_m3u8', message: "Link video không hợp lệ", check: validateVideoLink},
    ];
  
    // Validate required fields
    for (const { field, message, check } of requiredFields) {
      data.episode.map((ep, index) => {
        const value = ep[field];
        if (!value || (check && !check(value))) {
          return `${message} ở tập ${index}`;
        }
      })
    }
  }
};