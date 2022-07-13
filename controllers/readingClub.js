const booksController = require("./booksController");
const reviewsController = require("./reviewsController");
const moviesController = require("./moviesController");

async function addBook(isbn) {
    return await booksController.addBook(isbn);
}

async function pickBookOTM() {
    await booksController.closeBookOTM();
    return await booksController.pickBookOTM();
}

async function pickMovieOTM() {
    await moviesController.closeMovieOTM();
    return await moviesController.pickMovieOTM();
}

async function getBookOTM() {
    return await booksController.getBookOTM();
}

async function getAllBooks() {
    return await booksController.getAllBooks();
}

async function rate(review) {
    return await reviewsController.rate(review);
}

async function getBookDetails(isbn) {
    return await booksController.getBookDetails(isbn);
}

async function searchFiveMovies(title) {
    return await moviesController.searchFiveMovies(title);
}

async function addMovie(id) {
    return await moviesController.addMovie(id);
}

async function getAllMovies() {
    return await moviesController.getAllMovies();
}

async function getMovieOTM() {
    return await moviesController.getMovieOTM();
}

async function getMovieDetails(id) {
    return await moviesController.getMovieDetails(id);
}

async function lastFiveReviews() {
    return await reviewsController.getLastFiveReviews();
}

module.exports = {addBook, pickBookOTM, getBookOTM, getAllBooks, rate, getBookDetails, searchFiveMovies, addMovie, getAllMovies, getMovieOTM, getMovieDetails, pickMovieOTM, lastFiveReviews}