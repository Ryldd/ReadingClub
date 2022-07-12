const booksController = require("./booksController");

async function add(author, isbn) {
    return await booksController.addBook(isbn);
}

async function pickBookOTM() {
    return await booksController.pickBookOTM();
}

async function getBookOTM() {
    return await booksController.getBookOTM();
}

async function getAllBooks() {
    return await booksController.getAllBooks();
}

module.exports = {add, pickBookOTM, getBookOTM, getAllBooks}