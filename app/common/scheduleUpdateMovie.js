const axios = require('axios');
const episodeService = require('../service/episode.service');
const movieService = require('../service/movie.service');
const { sequelize } = require('../config/connectDB');

const baseUrl = `https://phimapi.com`;

// Function to get the list of movies that need to be updated (status = 0)
async function getMovieToUpdate() {
    try {
        const MovieToUpdate = await movieService.getByStatus(0); // Fetch movies with status 0
        return MovieToUpdate;
    } catch (error) {
        console.error('Error fetching movie:', error); // Log error if movie fetch fails
        return null;
    }
}

// Function to fetch movie details from external API based on slug
async function fetchApiMovie(slug) {
    try {
        const DataResponse = await axios.get(`${baseUrl}/phim/${slug}`); // Fetch movie data from API
        return DataResponse;
    } catch (error) {
        console.error('Error fetching API link:', error); // Log error if API call fails
        return null;
    }
}

// Optimize autoUpdateMovie by processing multiple movies in parallel
module.exports = {
    autoUpdateMovie: async () => {
        try {
            console.log('Start Auto update Movies...');
            const movies = await getMovieToUpdate(); // Get movies to update

            for (const movie of movies) {
                const response = await fetchApiMovie(movie.mov_slug); // Fetch movie data from API
                
                // Check if the number of episodes in the response is greater than the stored episodes
                if (response.data.episodes[0].server_data.length > movie.Episodes.length) {
                    // Extract slugs from old episodes
                    const oldSlugs = movie.Episodes.map(ep => ep.ep_slug);

                    let EpToUpdate = [];

                    // Loop through episodes in API response and check if any new episodes exist
                    response.data.episodes[0].server_data.forEach((ep) => {
                        if (!oldSlugs.includes(ep.slug)) { // If episode is not found in the old episodes, add it to update list
                            EpToUpdate.push({
                                ep_title: ep.filename,
                                ep_name: ep.name,
                                ep_slug: ep.slug,
                                link_embed: serverData.link_embed,
                                link_m3u8: serverData.link_m3u8,
                                sort_order: movie.Episodes.length + 1, // Assign sort order based on existing episodes
                                status: ep.status?ep.status:true, // Set episode status, default to true if not provided
                                movie: [movie.mov_id] // Link episode to the corresponding movie
                            });
                        }
                    });

                    // If there are episodes to update, start a transaction
                    if (EpToUpdate.length > 0) {
                        const transaction = await sequelize.transaction(); // Start a transaction

                        try {
                            // Use Promise.all to ensure all episodes are created before committing the transaction
                            await Promise.all(EpToUpdate.map(ep => {
                                return episodeService.createEpisode(ep, transaction); // Create new episode in database
                            }));

                            // Commit transaction if no errors
                            await transaction.commit();
                            console.log(`New episodes created for movie ${movie.mov_id}`);
                        } catch (error) {
                            // Rollback transaction if any errors occur
                            await transaction.rollback();
                            console.error(`Error updating episodes for movie ${movie.mov_id}:`, error);
                        }
                    }
                }else{
                    const transaction = await sequelize.transaction(); // Start a transaction
                    try {
                        await movieService.updateMovie({ ...movie, status: 1 }, { transaction });

                        // Commit transaction if no errors
                        await transaction.commit();
                        console.log(`Update status for movie ${movie.mov_id}`);
                    } catch (error) {
                        // Rollback transaction if any errors occur
                        await transaction.rollback();
                        console.error(`Error updating status for movie ${movie.mov_id}:`, error);
                    }
                }
            }
            console.log('Auto-update new episode successfully completed'); // Log success message when all movies are processed
        } catch (error) {
            console.error('Error in auto update new episode:', error); // Log error if process fails
        }
    }
}
