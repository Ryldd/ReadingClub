const mongoose = require('mongoose');
require("./movieModel");
require("./bookModel");
const { Schema } = mongoose;

const reviewModel = new Schema({
    note: Number,
    description: String,
    author: String,
    date: Date,
    type: String,
    book: {type: Schema.Types.String, ref: 'book'} ,
    movie: {type: Schema.Types.String, ref: 'movie'}
});

const Review = mongoose.model('review', reviewModel);

async function addReview(review, media){
    const reviewDB = new Review();
    reviewDB.note = controlNote(review.note);
    reviewDB.description = review.description;
    reviewDB.author = review.author;
    reviewDB.date = new Date();
    reviewDB.type = review.type;
    if(review.type === "Movie")
        reviewDB.movie = media._id
    else if (review.type === "Book")
        reviewDB.book = media._id
    await reviewDB.save();
    return reviewDB;
}

function controlNote(note){
    try{
        parseInt(note)
    } catch (error){
        throw new Error("Le format de la note n'est pas bon")
    }

    if (note < 0)
        return 0;
    if (note > 5)
        return 5;
    return note;
}

function getAllReviews() {
    return Review.find().populate('book').populate('movie');
}

module.exports = { addReview, Review , getAllReviews}