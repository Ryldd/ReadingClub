const movieModel = require("../model/movieModel")
const axios = require("axios");
const bookModel = require("../model/bookModel");

async function searchFiveMovies(title) {
    const response = await axios.get("https://api.themoviedb.org/3/search/movie?api_key=4dbada550993d2e485c6f64ac27a000b&language=fr-FR&query=" + title + "&page=1&include_adult=false");
    let movies = response.data.results;
    movies = movies.sort((a, b) => (b.popularity - a.popularity));
    return movies.slice(0, 5);
}

async function addMovie(id) {
    const response = await axios.get("https://api.themoviedb.org/3/movie/" + id + "?api_key=4dbada550993d2e485c6f64ac27a000b&language=fr-FR");
    let movieData = response.data;
    let movie = {
        id: movieData.id,
        description: movieData.overview,
        runtime: movieData.runtime
    }
    return await movieModel.addMovie(movie);
}

async function getAllMovies() {
    return await movieModel.getAllMovies();
}

async function getMovieOTM() {
    return await movieModel.getMovieOTM();
}

async function getMovieDetails(id) {
    return await movieModel.getMovie(id);
}

async function pickMovieOTM() {
    const movies = await movieModel.getAllMovies();
    const rand = Math.floor(Math.random() * movies.length);
    const movieOTM = movies[rand]
    await movieModel.setCurrent(movieOTM._id)
    return movieOTM;
}

async function closeMovieOTM() {
    await movieModel.closeMovieOTM();
}

module.exports = {searchFiveMovies, addMovie, getAllMovies, getMovieOTM, getMovieDetails, pickMovieOTM, closeMovieOTM}
