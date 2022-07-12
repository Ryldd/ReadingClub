const bookModel = require("../model/bookModel")
const movieModel = require("../model/movieModel")
const reviewModel = require("../model/reviewModel")

async function rate(review) {
    let reviewDB;
    if(review.type === "Movie"){
        reviewDB = await reviewModel.addReview(review)
        await movieModel.addReview(review.id, reviewDB);
    } else if (review.type === "Book"){
        reviewDB = await reviewModel.addReview(review)
        await bookModel.addReview(review.id, reviewDB);
    }
    return reviewDB;
}

module.exports = {rate}