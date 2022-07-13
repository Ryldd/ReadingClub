const bookModel = require("../model/bookModel")
const movieModel = require("../model/movieModel")
const reviewModel = require("../model/reviewModel")

async function rate(review) {
    let reviewDB;
    if(review.type === "Movie"){
        const movie = await movieModel.getMovie(review.id);
        reviewDB = await reviewModel.addReview(review, movie)
        await movieModel.addReview(review.id, reviewDB);
    } else if (review.type === "Book"){
        const book = await bookModel.getBook(review.id);
        reviewDB = await reviewModel.addReview(review, book)
        await bookModel.addReview(review.id, reviewDB);
    }
    return reviewDB;
}

async function getLastFiveReviews() {
    let reviews = await reviewModel.getAllReviews();
    reviews = reviews.sort((a, b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0))
    return reviews.slice(0, 5);
}

module.exports = {rate, getLastFiveReviews}