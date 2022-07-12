const mongoose = require('mongoose');

const bookModel = new mongoose.Schema({
    _id: String,
    title: String,
    description: String,
    author: String,
    categories: String,
    pages: String,
    image: String,
    link: String,
    current: Boolean,
    read: Boolean
});

const Book = mongoose.model('book', bookModel);

async function addBook(book) {
    const bookDb = new Book();
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
    await bookDb.save();
}

async function getBook(bookId){
    return Book.findOne({_id: bookId});
}

async function setCurrent(bookId){
    const book = getBook(bookId);
    book.current = true;
    await book.save();
}

async function getCurrent(){
    return Book.findOne({current: true});
}

async function setRead(bookId){
    const book = getBook(bookId);
    book.read = true;
    await book.save();
}

async function getAllBooks(){
    return Book.find();
}

module.exports = {addBook, getBook, getAllBooks, setCurrent, setRead, getCurrent}