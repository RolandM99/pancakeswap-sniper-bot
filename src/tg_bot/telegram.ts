const { Telegraf } = require("telegraf");
require("dotenv").config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_API!);
const time = new Date().toLocaleTimeString();

bot.start((ctx: any) => {
    console.log("\n\n New user joined the bot");
ctx.reply(`🚀🚀 Welcome To RoSniperBot 🚀🚀  \n  You are ready to receive notifications... 🔔 \n ⌚ Time: ${time}`)
});

export const sendTelegramNote = async (message: any) => {
  console.log("\n\nStreaming ...");
  const chatIDs = ["1069843486", "5660680783"];
  console.log(typeof chatIDs);
  chatIDs.forEach(chat => {
    bot.telegram.sendMessage(chat, message, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }).catch((error: any) => {
      console.log("Encouterd an error while sending notification to ", chat)
      console.log("==============================")
      console.log(error)
    })
  });
  console.log("Done!");
};

bot.launch();