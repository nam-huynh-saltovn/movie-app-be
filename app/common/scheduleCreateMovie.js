const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const typeService = require('../service/type.service');
const yearService = require('../service/year.service');
const actorService = require('../service/actor.service');
const directorService = require('../service/director.service');
const categoryService = require('../service/category.service');
const countryService = require('../service/country.service');
const episodeService = require('../service/episode.service');
const movieService = require('../service/movie.service');
const movieValidator = require('../validator/movie.validator');
const { sequelize } = require('../config/connectDB');
const userService = require('../service/user.service');

const baseUrl = `https://phimapi.com`;

//function get just updated movie
async function fetchApiNewMovie(newPage) {
    try {
        const newMovieDataResponse = await axios.get(`${baseUrl}/danh-sach/phim-moi-cap-nhat?page=${newPage}`);
        return newMovieDataResponse;
    } catch (error) {
        console.error('Error fetching new movie API link:', error);
        return null;
    }
}

//function get single type movie
async function fetchApiSingleMovie(singlePage) {
    try {
        const singleMovieDataResponse = await axios.get(`${baseUrl}/v1/api/danh-sach/phim-le?page=${singlePage}`);
        return singleMovieDataResponse;
    } catch (error) {
        console.error('Error fetching single movie API link:', error);
        return null;
    }
}

//function get series type movie
async function fetchApiSeriesMovie(seriesPage) {
    try {
        console.log(`${baseUrl}/v1/api/danh-sach/phim-bo?page=${seriesPage}`);
        
        const seriesMovieDataResponse = await axios.get(`${baseUrl}/v1/api/danh-sach/phim-bo?page=${seriesPage}`);
        return seriesMovieDataResponse;
    } catch (error) {
        console.error('Error fetching series movie API link:', error);
        return null;
    }
}

//function get tv-show type movie
async function fetchApiTvshowMovie(tvshowsPage) {
    try {
        const tvshowMovieDataResponse = await axios.get(`${baseUrl}/v1/api/danh-sach/tv-shows?page=${tvshowsPage}`);
        return tvshowMovieDataResponse;
    } catch (error) {
        console.error('Error fetching tvshow movie API link:', error);
        return null;
    }
}

//function get cartoon type movie
async function fetchApiCartoonMovie(cartoonPage) {
    try {
        const cartoonMovieDataResponse = await axios.get(`${baseUrl}/v1/api/danh-sach/hoat-hinh?page=${cartoonPage}`);
        return cartoonMovieDataResponse;
    } catch (error) {
        console.error('Error fetching cartoon movie API link:', error);
        return null;
    }
}

//function get movie api from slug
async function fetchApiMovie(slug) {
    try {
        const DataResponse = await axios.get(`${baseUrl}/phim/${slug}`);
        return DataResponse;
    } catch (error) {
        console.error('Error fetching API link:', error);
        return null;
    }
}

// The createMovie function adjusts errors and restores each API separately
async function createMovie(data) {
    const transaction = await sequelize.transaction();
    try {
        // validation movie data
        const validationErrors = await movieValidator.validateMovieDataApi(data);
        if (validationErrors) {
            throw new Error('Validation failed');
        }

        const admin = await userService.findAdmin(transaction);
        if (!admin||admin.count===0) {
            console.log('User not found');
            throw new Error('User not found');
        }

        // create type & year
        const [type, year] = await Promise.all([
            typeService.findTypeBySlug(data.movie.type, transaction),
            yearService.findYear(data.movie.year, transaction)
        ]);

        // create actor
        const actors = await Promise.all(data.movie.actor.map(async (act) => {
            const [actor] = (act||act!==''||act!=='')&&await actorService.findOrCreateActor(act, 10, true, transaction);
            return actor;
        }));

        // create director
        const directors = await Promise.all(data.movie.director.map(async (dir) => {
            const [director] = (dir||dir!=='')&&await directorService.findOrCreateDirector(dir, true, transaction);
            return director;
        }));

        // create category
        const categories = await Promise.all(data.movie.category.map(async (cat) => {
            const [category] = (cat||cat!=='')&&await categoryService.findOrCreateCategory(cat.name, cat.slug, true, transaction);
            return category;
        }));

        // create country
        const countries = await Promise.all(data.movie.country.map(async (ctr) => {
            const [country] = (ctr||ctr!=='')&&await countryService.findOrCreateCountry(ctr.name, ctr.slug, true, transaction);
            return country;
        }));

        // create movie
        const movie = await movieService.createMovie({
            mov_name: data.movie.name,
            mov_slug: data.movie.slug,
            ori_name: data.movie.origin_name,
            content: data.movie.content,
            poster_url: data.movie.poster_url,
            thumb_url: data.movie.thumb_url,
            time: data.movie.time,
            episode_current: data.movie.episode_current,
            episode_total: data.movie.episode_total,
            quality: data.movie.quality,
            lang: data.movie.lang,
            updatedAt: data.movie.modified.time,
            createdAt: data.movie.created.time,
            year_id: year?year.year_id:45,
            type_id: type?type.type_id:45,
            user_id: admin?.rows[0].user_id,
            status: data.movie.status === "ongoing" ? false : true,
            category: categories.map(cat => cat.dataValues.cat_id),
            country: countries.map(ctr => ctr.dataValues.ctr_id),
            actor: actors.map(act => act.dataValues.act_id),
            director: directors ? directors.map(dir => dir.dataValues.dir_id) : null,
        }, transaction);

        await Promise.all(data.episodes.map(async (ep) => {
            await Promise.all(ep.server_data.map(async (serverData, index) => {
                // Create episodes
                await episodeService.createEpisode({
                    ep_title: serverData.filename,
                    ep_name: serverData.name,
                    ep_slug: serverData.slug,
                    link_embed: serverData.link_embed,
                    link_m3u8: serverData.link_m3u8,
                    sort_order: index + 1,
                    user_id: admin?.rows[0].user_id,
                    status: true,
                    movie: [movie.dataValues.mov_id]
                }, transaction);
            }));
        }));

        await transaction.commit(); // Commit the transaction
        return { movie };
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback(); // Rollback only if not already finished
        }
        console.error('Error creating movie:', error);
        return null;
    }
}

const countPagePath = path.join(__dirname, '../../data/countPage.json');

// Load the countdown value from the JSON file
async function loadCountPage() {
    // Read countPage.json file to get current page number
    const countPageData = await fs.readFile(countPagePath, 'utf8');
    return JSON.parse(countPageData);
}

// Save the countdown value to the JSON file
async function saveCountPage(countPage) {
    // Save countPage.json file after update
    await fs.writeFile(countPagePath, JSON.stringify(countPage, null, 2));
}

// Optimize autoCreateMovie by processing multiple movies in parallel
module.exports = {
    autoCreateMovie: async () => {
        try {
            const pageData = await loadCountPage();

            // Process each movie type sequentially
            if (pageData.singlePage < 1283) {
                console.log('Fetching Single Movies...');
                await processMovies(fetchApiSingleMovie, pageData.singlePage, 'singlePage');
                pageData.singlePage += 1; // increase the number of singlePage pages after processing
            }
            if (pageData.seriesPage < 385) {
                console.log('Fetching series Movies...');
                await processMovies(fetchApiSeriesMovie, pageData.seriesPage, 'seriesPage');
                pageData.seriesPage += 1; // increase the number of seriesPage pages after processing
            }
            if (pageData.tvshowsPage < 11) {
                console.log('Fetching tvshows Movies...');
                await processMovies(fetchApiTvshowMovie, pageData.tvshowsPage, 'tvshowsPage');
                pageData.tvshowsPage += 1; // increase the number of tvshowsPage pages after processing
            }
            if (pageData.cartoonPage < 188) {
                console.log('Fetching cartoon Movies...');
                await processMovies(fetchApiCartoonMovie, pageData.cartoonPage, 'cartoonPage');
                pageData.cartoonPage += 1; // increase the number of cartoonPage pages after processing
            }

            // Process movie just update at page 1 & 2
            await processNewMovies(fetchApiNewMovie, 1);
            await processNewMovies(fetchApiNewMovie, 2);

            //Update JSON file after increasing page count
            await saveCountPage(pageData);
            console.log('Auto-create movie successfully completed');
        } catch (error) {
            console.error('Error in autoCreateMovie:', error);
        }
    }
}

// Movie processing functions for each type
async function processMovies(fetchApiFunc, page, pageType) {
    try {
        // Call fetch API with just one page
        const result = await fetchApiFunc(page);

        // Check if result is successful (not null)
        if (result === null) {
            console.log(`No data fetched for ${pageType} on page ${page}`);
            return;
        }

        // Get movie slug list from API result
        const movieSlugs = result.data.data.items.map(item => item.slug);

        // Fetch and create movies from slug list
        if (movieSlugs.length > 0) {
            const moviesData = await Promise.all(movieSlugs.map(async (slug) => {
                const response = await fetchApiMovie(slug);
                return response.data;
            }));

            // Create movies from captured data
            await Promise.all(moviesData.map(async (movieData) => {
                if (movieData) {
                    await createMovie(movieData); // Call the movie constructor with data from the API
                }
            }));
        }

        console.log(`Processed ${movieSlugs.length} movies from ${pageType}`);
    } catch (error) {
        console.error(`Error processing ${pageType}:`, error);
    }
}

// Movie just update processing function
async function processNewMovies(fetchApiFunc, page) {
    try {
        // Call fetch API with just one page
        const result = await fetchApiFunc(page);

        // Check if result is successful (not null)
        if (result === null) {
            console.log(`No data fetched for new movie on page ${page}`);
            return;
        }

        // Get movie slug list from API result
        const movieSlugs = result.data.items.map(item => item.slug);

        // Fetch and create movies from slug list
        if (movieSlugs.length > 0) {
            const moviesData = await Promise.all(movieSlugs.map(async (slug) => {
                const response = await fetchApiMovie(slug);
                return response.data;
            }));

            // Create movies from captured data
            await Promise.all(moviesData.map(async (movieData) => {
                if (movieData) {
                    await createMovie(movieData); // Call the movie constructor with data from the API
                }
            }));
        }

        console.log(`Processed ${movieSlugs.length} movies from new movie`);
    } catch (error) {
        console.error(`Error processing new movie:`, error);
    }
}