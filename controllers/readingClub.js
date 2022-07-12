const booksController = require("./booksController");

async function add(author, isbn) {
    try {
        return  await booksController.addBook(isbn);
    } catch (error){
        throw new Error(error)
    }
}

module.exports = {add}