const axios = require('axios');
const Discord = require('discord.js');
const cheerio = require('cheerio');
require('dotenv').config();


const HOT_DEALS_URL = 'https://gg.deals';
const HOT_DEALS_URI = '/deals/hot-new-deals/';
const INTERVAL_TIME = 86400000; // daily
const BEST_DEALS_CHANNEL = process.env.CHANNEL_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Discord.Client();

bot.on('ready', () => {
    console.log(`Bot ready as ${ bot.user.tag }`);
});

bot.setInterval(async () => {
    const response = await axios.get(HOT_DEALS_URL + HOT_DEALS_URI);

    if (response.status !== 200) {
        console.log(response.statusText);
        return false;
    }

    $ = cheerio.load(response.data);

    $('div.game-list-item').each((i, element) => {
        const title = $(element).find('div.title-line').first().text();
        const link = $(element).find('a.price-widget').attr('href');
        const discount = $(element).find('span.before-price-wrapper').first().text();
        const beforePrice = $(element).find('span.double-line').children('span.bottom').text();
        const newPrice = $(element).find('span.double-line').children('span.numeric').text();

        setTimeout(() =>
            bot.channels
                .get(BEST_DEALS_CHANNEL)
                .sendMessage(`Name: ${ title }\nDiscount: ${ discount }\nPrice: ${ newPrice } (${ beforePrice })\nLink: ${ HOT_DEALS_URL + link }`),
            3000 * i
        );
    });


}, INTERVAL_TIME);

bot.login(BOT_TOKEN)
    .then(() => console.log('App started...'))
    .catch(err => console.log(err));
