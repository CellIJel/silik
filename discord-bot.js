const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

// Create a new Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

let lastPrice = null;
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

// Function to get current price from Silly Exchange
async function getCurrentPrice() {
    try {
        const response = await fetch('https://sillypost.net/games/sillyexchange', {
            method: 'POST'
        });
        if (!response.ok) {
            console.error('Failed to fetch price:', response.status);
            return null;
        }
        const data = await response.json();
        return data.price;
    } catch (error) {
        console.error('Error fetching price:', error);
        return null;
    }
}

// Function to send price update to Discord
async function sendPriceUpdate(newPrice, status) {
    if (!CHANNEL_ID) {
        console.error('Discord channel ID not configured');
        return;
    }

    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel) {
        console.error('Could not find Discord channel');
        return;
    }

    const message = `🎮 Silly Exchange Update!\nPrice: ${newPrice} beans\nStatus: ${status}`;
    await channel.send(message);
}

// Check price every minute
async function checkPrice() {
    const currentPrice = await getCurrentPrice();
    if (currentPrice === null) return;

    if (lastPrice !== null && currentPrice !== lastPrice) {
        const status = await getStatus();
        await sendPriceUpdate(currentPrice, status);
    }
    lastPrice = currentPrice;
}

// Get current status
async function getStatus() {
    try {
        const response = await fetch('https://sillypost.net/games/sillyexchange', {
            method: 'POST'
        });
        if (!response.ok) return 'Unknown';
        const data = await response.json();
        return data.status;
    } catch (error) {
        console.error('Error fetching status:', error);
        return 'Unknown';
    }
}

// Bot ready event
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    // Start checking price every minute
    setInterval(checkPrice, 60000);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN); 