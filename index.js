import axios from "axios";
import { Client, GatewayIntentBits } from "discord.js";
import cheerio from "cheerio";

const HOT_DEALS_URL = "https://gg.deals";
const HOT_DEALS_URI = "/deals/hot-new-deals/";
const INTERVAL_TIME = 86400000; // daily
const BEST_DEALS_CHANNEL = process.env.CHANNEL_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Client({ intents: [GatewayIntentBits.Guilds]});

bot.on("ready", () => {
  console.log(`Bot ready as ${bot.user.tag}`);
});

setInterval(async () => {
  const response = await axios.get(HOT_DEALS_URL + HOT_DEALS_URI);

  if (response.status !== 200) {
    console.log(response.statusText);
    return false;
  }

  const $ = cheerio.load(response.data);

  $("div.game-list-item").each((i, element) => {
    const title = $(element).find("a.title").first().text();

    if (title === undefined) {
      return;
    }

    const link = $(element).find("a.full-link").attr("href");
    const discount = $(element).find("span.discount-badge").text();
    const beforePrice = $(element).find("span.price-old").text();
    const newPrice = $(element).find("span.game-price-new").text();
   
    setTimeout(
      () =>
        bot.channels
          .get(BEST_DEALS_CHANNEL)
          .send(
            `${discount} ${title}\n${newPrice} (${beforePrice})\n${
              HOT_DEALS_URL + link
            }`
          ),
      3000 * i
    );
  });
}, INTERVAL_TIME);

bot
 .login(BOT_TOKEN)
 .then(() => console.log("App started..."))
 .catch((err) => console.log(err));
