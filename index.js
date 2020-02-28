const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const BEST_DEALS_CHANNEL = process.env.CHANNEL_ID;

const Discord = require('discord.js');
const bot = new Discord.Client();

const URL = 'https://gg.deals';
const HOT_DEALS_URI = '/deals/hot-new-deals/';

async function getContents() {
    const response = await axios.get(URL + HOT_DEALS_URI);

    if (response.status !== 200) {
        console.log(response.statusText);
        return false;
    }

    return cheerio.load(response.data);
}

function getMessage(title, link, discount, beforePrice, newPrice) {
    return `Name: ${title}\nDiscount: ${discount}\nPrice: ${newPrice} (${beforePrice})\nLink: ${URL + link}`;
}

bot.on('ready', () => {
    console.log(`Bot ready as ${bot.user.tag}`);
});

bot.setInterval(async () => {
    const $ = await getContents();

    $('div.game-list-item').each((i, element) => {
        const title = $(element).find('div.title-line').first().text();
        const link = $(element).find('a.price-widget').attr('href');
        const discount = $(element).find('span.before-price-wrapper').first().text();
        const beforePrice = $(element).find('span.double-line').children('span.bottom').text();
        const newPrice = $(element).find('span.double-line').children('span.numeric').text();

        bot.channels.get(BEST_DEALS_CHANNEL).sendMessage(getMessage(title, link, discount, beforePrice, newPrice));
    });
}, 86400000);

bot.login(process.env.BOT_TOKEN)
    .then(() => console.log('App started...'))
    .catch(err => console.log(err));
