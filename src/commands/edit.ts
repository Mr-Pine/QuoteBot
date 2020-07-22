import * as Discord from "discord.js"
import { readFileSync, writeFileSync } from "fs"
import { generateQuote } from "../generateQuote"
import * as config from "../config.json"

export async function edit(message: Discord.Message, client: Discord.Client) {
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

    if (oldQuote.reporter != message.member?.id && !message.member?.roles.cache.has(settings[message.guild?.id as string]["quoteMaster"])) {
        message.channel.send("No permission to edit not self written Quotes!")
        return
    }

    var parts = quoteContent.split("\n\n\n")
    parts.forEach((part, index) => {
        var newPart = part.split(":").slice(1).join(':')
        while (newPart[0] == " ") {
            newPart = newPart.slice(1)
        }
        parts[index] = newPart
    })

    if (parts.includes("[replace this]") || parts.includes("[replace with tag. If not on Server: none]") || parts.includes("[replace with fitting tags, separated by ',']")) {
        message.channel.send("Please replace all fields")
        return
    }
    if (parts.length != 4) {
        message.channel.send("Please use propper formatting")
        return
    }

    var quoteObject = {
        text: parts[0],
        author: parts[1],
        reporter: message.member?.id,
        character: parts[2],
        tags: separateTags(parts[3]),
        message: oldQuote.message
    }

    quotes[parseInt(number) - 1] = quoteObject

    writeFileSync("./src/quotes.json", JSON.stringify(quotes))

    let quoteChannel = await client.channels.fetch(config.QUOTE_CHANNEL_ID) as Discord.TextChannel

    var messageID = quotes[parseInt(number) - 1].message
    var quoteMessage = await quoteChannel.messages.fetch(messageID)
    quoteMessage.edit(generateQuote(quoteObject, parseInt(number), message))
}

function separateTags(tags: string) {
    var tagArray = tags.split(",")
    tagArray.forEach((tag, index) => {
        while (tag[0] == " ") {
            tag = tag.slice(1)
        }
        tagArray[index] = tag
    })
    return tagArray
}