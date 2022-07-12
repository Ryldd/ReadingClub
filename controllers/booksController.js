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
                const volume = response.data.items[0].volumeInfo;
                let book = {};
                book.id = isbn;
                book.title = volume.title;
                book.author = volume.authors[0];
                book.categories = volume.categories[0];
                book.pages = volume.pageCount;
                book.image = volume.imageLinks.thumbnail;
                book.link = volume.infoLink;
                await bookModel.addBook(book);
            },
            function (err) {
                throw new Error("Une erreur s'est produite lors de la création du livre :" + err)
            });

    return await bookModel.getBook(isbn);
}

module.exports = {addBook}