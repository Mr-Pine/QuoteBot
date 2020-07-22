import * as Discord from "discord.js"
import { readFileSync } from "fs"

export function edit(message: Discord.Message) {
    var content = message.content
    var argString = content.slice(content.indexOf(" ") + 1)
    var number = argString.split(" ")[0]
    var quoteContent = argString.trim().slice(argString.indexOf(" ") + 1).trim()

    console.log(`#${number}: ${quoteContent}`)

    var quotes = JSON.parse(readFileSync("./src/quotes.json").toString()) as {
        text: string;
        author: string;
        reporter: string | undefined;
        character: string;
        tags: string[];
        message: string
    }[]

    var oldQuote = quotes[parseInt(number) - 1]

    var settings = JSON.parse(readFileSync("./src/settings.json").toString())

    console.log(settings[message.guild?.id as string])

    if (oldQuote.reporter != message.member?.id && !message.member?.roles.cache.has(settings[message.guild?.id as string]["quoteMaster"])) {
        message.channel.send("No permission to edit not self written Quotes!")
        return
    }
}