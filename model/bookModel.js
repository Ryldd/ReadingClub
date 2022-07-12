const mongoose = require('mongoose');

const bookModel = new mongoose.Schema({
    _id: String,
    title: String,
    author: String,
    categories: String,
    pages: String,
    image: String,
    link: String
});

const Book = mongoose.model('book', bookModel);

async function addBook(book) {
    const bookDb = new Book();
    bookDb._id = book.id;
    bookDb.title = book.title;
    bookDb.author = book.author;
    bookDb.categories = book.categories;
    bookDb.pages = book.pages;
    bookDb.image = book.image;
    bookDb.link = book.link;
    await bookDb.save();
}

async function getBook(bookId){
    return Book.findOne({_id: bookId});
}

module.exports = {addBook, getBook}