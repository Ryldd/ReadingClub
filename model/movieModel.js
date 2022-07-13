const mongoose = require('mongoose');
require("./reviewModel");
const { Schema } = mongoose;

const movieModel = new Schema({
    _id: String,
    title: String,
    description: String,
    runtime: Number,
    seen: Boolean,
    current: Boolean,
    reviews: [{type: Schema.Types.ObjectId, ref: 'review'}]
});

const Movie = mongoose.model('movie', movieModel);

async function addMovie(movie){
    let movieDB = new Movie();
    movieDB._id = movie.id;
    movieDB.title = movie.title;
    movieDB.description = movie.description;
    movieDB.runtime = movie.runtime;
    movieDB.seen = false;
    movieDB.current = false;
    movieDB.reviews = [];
    await movieDB.save();
    return movieDB;
}

async function getAllMovies() {
    return Movie.find().populate('reviews');
}

async function getMovie(movieId) {
    return Movie.findById(movieId).populate('reviews');
}

async function getMovieOTM() {
    const current = Movie.findOne({current: true});
    if (!current)
        throw new Error("Le film du mois n'a pas encore été choisi")
    return current
}

async function addReview(id, reviewDB) {
    let movie = await getMovie(id);
    movie.reviews.push(reviewDB);
    await movie.save();
}

async function setCurrent(movieId) {
    const movie = getMovie(movieId);
    movie.current = true;
    await movie.save();
}

async function closeMovieOTM() {
    let movie = await getMovieOTM();
    movie.current = false;
    movie.seen = true;
    await movie.save();
}

module.exports = {addMovie, Movie, getAllMovies, getMovieOTM, getMovie, addReview, setCurrent, closeMovieOTM}