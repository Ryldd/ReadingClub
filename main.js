// MONGOnpm
const mongoose = require("mongoose");
const mongoURL = process.env.MONGO_CONNECT;
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(mongoURL, connectionParams)
    .then(() => {
        console.log('Connected to database ')
    })
    .catch((err) => {
        console.error(`Error connecting to the database. \n${err}`);
    });

// Express
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const readingClub = require("./controllers/readingClub");
const app = express();

app.use(cors());
app.use(bodyParser.json());

// BOOKS
app.get('/books/add/:id', async (req, res) => {
    try {
        const book = await readingClub.addBook(req.params.id)
        res.status(200).json(book);
    } catch (error) {
        res.status(500).send({error: error.message})
    }
});

app.get('/books/all', async (req, res) => {
    try {
        const books = await readingClub.getAllBooks();
        res.status(200).json(books)
    } catch (error) {
        res.status(500).send({error: error.message})
    }
});

app.get('/books/get/:id', async (req, res) => {
    try {
        const isbn = parseInt(req.params.id);
        const book = await readingClub.getBookDetails(isbn);
        res.status(200).json(book)
    } catch (error) {
        res.status(500).send({error: error.message})
    }
});

app.get('/books/current', async (req, res) => {
    try {
        const current = await readingClub.getBookOTM();
        console.log("current");
        console.log(current);
        res.status(200).json(current)
    } catch (error) {
        res.status(500).send({error: error.message})
    }
});

app.get('/books/searchFive/:title', async (req, res) => {
    try {
        const book = await readingClub.searchFiveBooks(req.params.title)
        res.status(200).json(book);
    } catch (error) {
        res.status(500).send({error: error.message})
    }
});

//MOVIES
app.get('/movies/searchFive/:title', async (req, res) => {
    try {
        const movie = await readingClub.searchFiveMovies(req.params.title)
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).send({error: error.message})
    }
});

app.get('/movies/add/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const movie = await readingClub.addMovie(id);
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).send({error: error.message})
    }
});

app.get('/movies/all', async (req, res) => {
    try {
        const movies = await readingClub.getAllMovies();
        res.status(200).json(movies)
    } catch (error) {
        res.status(500).send({error: error.message})
    }
});

app.get('/movies/get/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const movie = await readingClub.getMovieDetails(id);
        res.status(200).json(movie)
    } catch (error) {
        res.status(500).send({error: error.message})
    }
});

app.get('/movies/current', async (req, res) => {
    try {
        const current = await readingClub.getMovieOTM();
        res.status(200).json(current)
    } catch (error) {
        res.status(500).send({error: error.message})
    }
});


//REVIEWS
app.post('/reviews/rate', async (req, res) => {
    try {
        const review = await readingClub.rate(req.body);
        res.status(200).json(review)
    } catch (error) {
        res.status(500).send({error: error.message})
    }
});

app.get('/reviews/lastFive', async (req, res) => {
    try{
        console.log('last five reviews')
        const reviews = await readingClub.lastFiveReviews();
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).send({error: error.message})
    }
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Server on')
});