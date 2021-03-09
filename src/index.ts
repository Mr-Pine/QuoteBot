import * as Discord from "discord.js"
import * as config from "./config.json"
import { handle } from "./commandHandler"
import { sendEmbed } from "./sendEmbed"
import { setStatus } from "./status"
import { listenQuotes } from "./quoteListener"
import { listenServer } from "./serverQuoteListener"

console.log("Hello World");

var client = new Discord.Client();
process.stdin.resume();

client.on("ready", () => {
    console.log("Allzeit bereit für deepe Quotes");
    client.user?.setActivity("Hallo! Bin wieder da", { type: "STREAMING" })
    listenServer(client)
})

client.on("message", message => {
    var text = message.content;
    var author = message.author.username;
    console.log(`${author}: ${text}`);
    handleMessage(message)
    if (message.author.id != client.user?.id) {
        listenQuotes(message)
    }
})

client.login(config.TOKEN)

setStatus(client)

function handleMessage(message: Discord.Message) {
    if (message.author.id != client.user?.id) {
        if (message.content.startsWith(config.PREFIX)) {
            var invoker = message.content.substr(2).split(' ')[0]
            handle(message, invoker, client);
        }
    }
}

process.on('uncaughtException', function (err) {
    console.error(err);
    client.channels.fetch("704275816598732840").then(botWiese => {
        sendEmbed("Java.lang.NullPointerException at 34:40", [255, 0, 0], botWiese as Discord.TextChannel)
    })
});

process.on("SIGINT", (signal) => {
    client.user?.setStatus("invisible").then(() => {
        console.log("SIGINT exiting")
        process.exit(0)
    })
})
