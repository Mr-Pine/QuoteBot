import * as Discord from "discord.js"
import { readFileSync, writeFileSync } from "fs"
import { generateQuote } from "../generateQuote"
import { setTimeout } from "timers"
import { settings } from "cluster"

export async function update(message: Discord.Message, client: Discord.Client) {

    var settings = JSON.parse(readFileSync("./src/settings.json").toString())

    if (message.member?.roles.cache.has(settings[message.guild?.id as string]["quoteMaster"])) {

        var settings = JSON.parse(readFileSync("./src/settings.json").toString())

        var allQuotes = JSON.parse(readFileSync("./src/quotes.json").toString())
        var quotes = allQuotes[message.guild?.id as string] as {
            text: string;
            author: string;
            reporter: string | undefined;
            character: string;
            tags: string[];
            message: string
        }[]

        for (let i = 0; i < quotes.length; i++) {
            //let i = quotes.length - 1

            let quoteChannel = await client.channels.fetch(settings[message.guild?.id as string]["QUOTE_CHANNEL_ID"]) as Discord.TextChannel

            try {
                var messageID = quotes[i].message
                var quoteMessage = await quoteChannel.messages.fetch(messageID)
                quoteMessage.delete()
            } catch (error) {

            }

            var newContent = generateQuote(quotes[i], i + 1, message.guild?.id as string)
            var newMessage = await quoteChannel.send(newContent)
            quotes[i].message = newMessage.id

            setTimeout(() => { }, 10)

        }

        allQuotes[message.guild?.id as string] = quotes

        writeFileSync("./src/quotes.json", JSON.stringify(allQuotes))

    } else {
        message.channel.send("You need QuoteMaster Permission for this operation. See `<<help` for details")
    }
}