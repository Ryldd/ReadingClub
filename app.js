const Discord = require('discord.js');
// const cron = require("node-cron");
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
const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(mongoURL,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
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

function addBook(book, message) {
    const pages = book.pages ? book.pages : "X";
    const embedBook = new Discord.MessageEmbed()
        .setColor('#4aa827')
        .setTitle("Ajout : " + book.title)
        .setImage(book.image)
        .setDescription(""+book.link)
        .setFooter({text: book.pages + " pages - " + book.categories});

    message.channel.send({content: message.author.toString(), embeds: [embedBook]});
}

async function processRequest(message) {
    const request = message.content.substring(1, message.content.length);
    const words = request.split(" ");
    switch (words[0]) {
        case "add":
            try {
                const isbn = words.length > 1 ? words[1] : null;
                addBook(await readingClub.add(message.author, isbn), message)
            } catch (error) {
                console.error(error)
            }
    }
}