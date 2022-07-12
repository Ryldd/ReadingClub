const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewModel = new Schema({
    note: Number,
    description: String,
    author: String,
    date: Date,
    type: String
});

const Review = mongoose.model('review', reviewModel);

async function addReview(review){
    const reviewDB = new Review();
    reviewDB.note = controlNote(review.note);
    reviewDB.description = review.description;
    reviewDB.author = review.author;
    reviewDB.date = new Date();
    reviewDB.type = review.type;
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

module.exports = { addReview, Review }