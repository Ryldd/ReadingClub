const Discord = require('discord.js');
const cron = require("node-cron");
const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Discord.Intents.FLAGS.GUILD_MEMBERS],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'MEMBERS']
});
const delimiter = process.env.DELIMITER;
const channelID = process.env.CHANNELID;
const readingClub = require("./controllers/readingClub")

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

client.on("ready", function () {
    console.log("Mon BOT est Connecté");
});

client.on("messageCreate", function (message) {
    if (message.channel.id === channelID && message.content.charAt(0) === delimiter) {
        processRequest(message)
    }
});

client.login(process.env.BOT_LOGIN);


// Tirage du livre mensuel
// cron.schedule('0 18 1 * *', async function () {
//     await showBookOTM(await readingClub.pickBookOTM(), true);
//     await showMovieOTM(await readingClub.pickMovieOTM(), true);
// })

cron.schedule('15 * * * * *', async function () {
     console.log("test cron")
 })

async function showMovieOTM(movie, first) {
    const embedBook = new Discord.MessageEmbed()
        .setColor('#852994')
        .setTitle("Livre du mois : " + movie.title)
        .setDescription("" + movie.description)
        .setFooter({text: movie.runtime + "min"});

    const readingChannel = await client.channels.cache.get(channelID).fetch(true);

    if (first)
        readingChannel.send("everyone");
    readingChannel.send({embeds: [embedBook]});
}

async function showBookOTM(book, first) {
    const pages = book.pages ? book.pages : "X";
    const embedBook = new Discord.MessageEmbed()
        .setColor('#852994')
        .setTitle("Livre du mois : " + book.title)
        .setImage(book.image)
        .setDescription("" + book.link)
        .setFooter({text: pages + " pages - " + book.categories});

    const readingChannel = await client.channels.cache.get(channelID).fetch(true);

    if (first)
        readingChannel.send("everyone");
    readingChannel.send({embeds: [embedBook]});
}

async function addBook(book) {
    const pages = book.pages ? book.pages : "X";
    const embedBook = new Discord.MessageEmbed()
        .setColor('#4aa827')
        .setTitle("Ajout : " + book.title)
        .setImage(book.image)
        .setDescription("" + book.link)
        .setFooter({text: pages + " pages - " + book.categories});

    const readingChannel = await client.channels.cache.get(channelID).fetch(true);

    readingChannel.send({embeds: [embedBook]});
}

async function processRequest(message) {
    const request = message.content.substring(1, message.content.length);
    const words = request.split(" ");
    switch (words[0]) {
        case "add":
            try {
                const isbn = words.length > 1 ? words[1] : null;
                await addBook(await readingClub.add(message.author, isbn))
            } catch (error) {
                console.error(error)
            }
            break;
        case "review":
        case "current":
            console.log("current")
            await showBookOTM(await readingClub.getBookOTM(), false);

    }
}

// Express
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// BOOKS
app.get('/books/add/:id', async (req, res) => {
    try {
        const isbn = parseInt(req.params.id);
        const book = await readingClub.addBook(isbn)
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

app.listen(8080, () => {
    console.log('Server on')
});