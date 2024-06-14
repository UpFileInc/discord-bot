const { Client, Events, GatewayIntentBits } = require('discord.js');
const token = process.env.token;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);

// WEB SERVICE
const express = require('express');
const app = express();

app.get('/', async (req, res) => {
	res.send('Bot is ready to begin the adventure!')
});

app.listen(3000, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
})
