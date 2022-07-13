const bookModel = require("../model/bookModel")
const {google} = require('googleapis');

async function addBook(isbn) {
    const books = google.books({
        version: 'v1',
        auth: 'AIzaSyDDlGX1PO5eOLO86Es2Fs0J_xai88Ep6E0'
    })

    const bookData = await bookModel.getBook(isbn);
    if(bookData){
        throw new Error("Livre déjà enregistré <:pascontent:851365340885024769>");
    }

    await books.volumes.list({q : "isbn=" + isbn})
        .then(
            async function (response) {
                if(!response.data.items)
                    throw new Error("L'id du livre rentré n'existe pas dans la base de données google")
                const volume = response.data.items[0].volumeInfo;
                let book = {};
                book.id = isbn;
                book.title = volume.title;
                book.description = volume.description;
                book.author = volume.authors[0] ? volume.authors[0] : "";
                book.categories = volume.categories[0] ? volume.categories[0] : "";
                book.pages = volume.pageCount;
                book.image = volume.imageLinks.thumbnail;
                book.link = volume.infoLink;
                await bookModel.addBook(book);
            },
            function (err) {
                throw new Error("Une erreur s'est produite lors de la création du livre :" + err)
            }
        );

    return await bookModel.getBook(isbn);
}

async function pickBookOTM() {
    const books = await bookModel.getAllBooks();
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