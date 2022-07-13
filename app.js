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

// Tirage du livre et du film mensuel
cron.schedule('0 18 1 * *', async function () {
    await showBookOTM(await readingClub.pickBookOTM(), true);
    await showMovieOTM(await readingClub.pickMovieOTM(), true);
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