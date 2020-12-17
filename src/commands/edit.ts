import * as Discord from "discord.js"
import { readFileSync, writeFileSync } from "fs"
import { generateQuote } from "../generateQuote"

export async function edit(message: Discord.Message, client: Discord.Client) {
    var content = message.content
    var argString = content.slice(content.indexOf(" ") + 1)
    var number = argString.split(" ")[0]
    var quoteContent = argString.trim().slice(argString.indexOf(" ") + 1).trim()

    console.log(`#${number}: ${quoteContent}`)

    editQuote(number, quoteContent, message.guild?.id as string, client, message.member as Discord.GuildMember, message)

    editQuote

    message.delete();
}

export async function editQuote(number: string, quoteContent: string, guildID: string, client: Discord.Client, member: Discord.GuildMember, message?: Discord.Message) {


    var settings = JSON.parse(readFileSync("./src/settings.json").toString())

    var allQuotes = JSON.parse(readFileSync("./src/quotes.json").toString())

    var quotes = allQuotes[guildID] as {
        text: string;
        author: string;
        reporter: string | undefined;
        character: string;
        tags: string[];
        message: string
    }[]



    var oldQuote = quotes[parseInt(number) - 1]

    
    if (oldQuote.reporter != member.id && !member.roles.cache.has(settings[guildID as string]["quoteMaster"])) {
        if (message) {
            message.channel.send("No permission to edit not self written Quotes!")
        }
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
        return
    }
    if (parts.length != 4) {
        return
    }

    var quoteObject = {
        text: parts[0],
        author: parts[1],
        reporter: oldQuote.reporter,
        character: parts[2],
        tags: separateTags(parts[3]),
        message: oldQuote.message
    }

    quotes[parseInt(number) - 1] = quoteObject

    allQuotes[guildID] = quotes

    writeFileSync("./src/quotes.json", JSON.stringify(allQuotes))

    let quoteChannel = await client.channels.fetch(settings[guildID].QUOTE_CHANNEL_ID) as Discord.TextChannel

    var messageID = quotes[parseInt(number) - 1].message
    var quoteMessage = await quoteChannel.messages.fetch(messageID)
    quoteMessage.edit(generateQuote(quoteObject, parseInt(number), guildID))
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