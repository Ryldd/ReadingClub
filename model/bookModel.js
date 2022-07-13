const mongoose = require('mongoose');
require("./reviewModel");
const { Schema } = mongoose;

const bookModel = new Schema({
    _id: String,
    title: String,
    description: String,
    author: String,
    categories: String,
    pages: String,
    image: String,
    link: String,
    current: Boolean,
    read: Boolean,
    reviews: [{type: Schema.Types.ObjectId, ref: 'review'}]
});

const Book = mongoose.model('book', bookModel);

async function addBook(book) {
    let bookDb = new Book();
    bookDb._id = book.id;
    bookDb.title = book.title;
    bookDb.description = book.description;
    bookDb.author = book.author;
    bookDb.categories = book.categories;
    bookDb.pages = book.pages;
    bookDb.image = book.image;
    bookDb.link = book.link;
    bookDb.current = false;
    bookDb.read = false;
    bookDb.reviews = []
    await bookDb.save();
}

async function getBook(bookId){
    return Book.findOne({_id: bookId}).populate('reviews');
}

async function setCurrent(bookId){
    const book = getBook(bookId);
    book.current = true;
    await book.save();
}

async function getCurrent(){
    const current = Book.findOne({current: true}).populate("reviews");
    if (!current)
        throw new Error("Le livre du mois n'a pas encore été choisi")
    return current;
}

async function setRead(bookId){
    const book = getBook(bookId);
    book.read = true;
    await book.save();
}

async function getAllBooks(){
    return Book.find().populate('reviews');
}

async function addReview(isbn, reviewDB) {
    let book = await getBook(isbn);
    book.reviews.push(reviewDB);
    await book.save();
}

async function closeBookOTM() {
    let book = await getCurrent();
    book.current = false;
    book.read = true;
    await book.save();
}

module.exports = {Book, addBook, getBook, getAllBooks, setCurrent, setRead, getCurrent, addReview, closeBookOTM}