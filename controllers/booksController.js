const bookModel = require("../model/bookModel")
const axios = require("axios");

async function addBook(googleId) {
    const bookData = await bookModel.getBook(googleId);
    if(bookData){
        throw new Error("Livre déjà enregistré");
    }
    const response = await axios.get("https://books.googleapis.com/books/v1/volumes/" + googleId + "?key=AIzaSyDDlGX1PO5eOLO86Es2Fs0J_xai88Ep6E0")

    if(!response.data)
        throw new Error("L'id du livre rentré n'existe pas dans la base de données google")
    const volume = response.data.volumeInfo;

    let book = fillbook(googleId, volume);
    book.image = getLargestImage(volume);
    await bookModel.addBook(book);

    return book;
}

async function pickBookOTM() {
    const books = await bookModel.getAllBooks();
    if(books.length === 0)
        throw new Error("La base de données est vide, impossible de choisir le livre du mois")
    const rand = Math.floor(Math.random() * books.length);
    const bookOTM = books[rand]
    await bookModel.setCurrent(bookOTM._id)
    return bookOTM;
}

async function closeBookOTM() {
    await bookModel.closeBookOTM();
}

async function getBookOTM() {
    return await bookModel.getCurrent();
}

async function getAllBooks() {
    return await bookModel.getAllBooks();
}

async function getBookDetails(isbn) {
    return await bookModel.getBook(isbn);
}

async function searchFiveBooks(title) {
    const response = await axios.get("https://books.googleapis.com/books/v1/volumes?q=intitle:" + title + "&key=AIzaSyDDlGX1PO5eOLO86Es2Fs0J_xai88Ep6E0&orderBy=relevance&maxResults=5");
    const books = [];
    response.data.items.forEach((book) => {
       books.push(fillbook(book.id, book.volumeInfo))
    });
    return books;
}


function fillbook(isbn, volume) {
    let book = {};
    book.id = isbn;
    book.title = volume.title;
    book.description = volume.description;
    book.author = volume.authors ? volume.authors[0] : "";
    book.categories = volume.categories ? volume.categories[0] : "";
    book.pages = volume.pageCount;
    book.image = volume.imageLinks ? volume.imageLinks.thumbnail : "";
    book.link = volume.infoLink;
    return book;
}

function getLargestImage(volume) {
    if(volume.imageLinks){
        if (volume.imageLinks.extraLarge)
            return volume.imageLinks.extraLarge;
        else if (volume.imageLinks.large)
            return volume.imageLinks.large;
        else if (volume.imageLinks.medium)
            return volume.imageLinks.medium;
        else if (volume.imageLinks.small)
            return volume.imageLinks.small;
        else
            return volume.imageLinks.thumbnail;
    }
    return "";
}

module.exports = {addBook, pickBookOTM, getBookOTM, getAllBooks, getBookDetails, closeBookOTM, searchFiveBooks}