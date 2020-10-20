import * as Discord from "discord.js"
import { readFileSync, writeFileSync } from "fs"

export async function remove(message: Discord.Message, client: Discord.Client) {
    var content = message.content
    var argString = content.slice(content.indexOf(" ") + 1)
    var number = argString.split(" ")[0]

    console.log(`deleting #${number}`)

    var allQuotes = JSON.parse(readFileSync("./src/quotes.json").toString())
    var quotes = allQuotes[message.guild?.id as string] as {
        text: string;
        author: string;
        reporter: string | undefined;
        character: string;
        tags: string[];
        message: string
    }[] | {}[]

    var quote = quotes[parseInt(number) - 1] as {
        text: string;
        author: string;
        reporter: string | undefined;
        character: string;
        tags: string[];
        message: string
    }

    if (parseInt(number) == quotes.length) {
        quotes.pop()
    } else {
        quotes[parseInt(number) - 1] = {};
    }

    allQuotes[message.guild?.id as string] = quotes

    writeFileSync("./src/quotes.json", JSON.stringify(allQuotes))

    var settings = JSON.parse(readFileSync("./src/settings.json").toString())

    if (quote.reporter != message.member?.id && !message.member?.roles.cache.has(settings[message.guild?.id as string]["quoteMaster"])) {
        message.channel.send("No permission to remove not self written Quotes!")
        return
    }

    let quoteChannel = await client.channels.fetch(settings[message.guild?.id as string].QUOTE_CHANNEL_ID) as Discord.TextChannel

    var messageID = quote.message
    var quoteMessage = await quoteChannel.messages.fetch(messageID)

    quoteMessage.delete();

    message.delete()
}