const bookModel = require("../model/bookModel")
const {google} = require('googleapis');
const {response} = require("express");
const axios = require("axios");

async function addBook(isbn) {
    const books = google.books({
        version: 'v1',
        auth: 'AIzaSyDDlGX1PO5eOLO86Es2Fs0J_xai88Ep6E0'
    })

    const bookData = await bookModel.getBook(isbn);
    if(bookData){
        throw new Error("Livre déjà enregistré");
    }

    const response = await axios.get("https://books.googleapis.com/books/v1/volumes?q=isbn=" + isbn + "&key=AIzaSyDDlGX1PO5eOLO86Es2Fs0J_xai88Ep6E0");

    if(!response.data.items)
        throw new Error("L'id du livre rentré n'existe pas dans la base de données google")
    console.log(response.data.items[0].volumeInfo)
    const volume = response.data.items[0].volumeInfo;

    let book = {};
    book.id = isbn;
    book.title = volume.title;
    book.description = volume.description;
    book.author = volume.authors ? volume.authors[0] : "";
    book.categories = volume.categories ? volume.categories[0] : "";
    book.pages = volume.pageCount;
    book.image = volume.imageLinks.thumbnail;
    book.link = volume.infoLink;
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

module.exports = {addBook, pickBookOTM, getBookOTM, getAllBooks, getBookDetails, closeBookOTM}