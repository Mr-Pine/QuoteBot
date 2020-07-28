import * as Discord from "discord.js"
import { readFileSync, writeFileSync } from "fs"
import { settings } from "cluster"
import { generateQuote } from "./generateQuote"

export function listenQuotes(message: Discord.Message) {

    var settings = JSON.parse(readFileSync("./src/settings.json").toString())

    var quoteChannels: string[] = []

    for (var guildID in settings) {
        quoteChannels.push(settings[guildID]["QUOTE_CHANNEL_ID"])
    }

    try {
        if (quoteChannels.includes(message.channel.id) && message.content.startsWith("Text:")) {
            console.log("QUOTE!")
            var parts = message.content.split("\n\n\n")
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
                tags: separateTags(parts[3])
            }

            var allQuotes = JSON.parse(readFileSync("./src/quotes.json").toString())
            var quotes = allQuotes[message.guild?.id as string] as {
                text: string;
                author: string;
                reporter: string | undefined;
                character: string;
                tags: string[];
                message: string
            }[]

            if(!quotes){
                quotes = []
            }

            message.channel.send(generateQuote(quoteObject, (quotes).length + 1, message)).then(quoteMessage => {
                var storeQuote = quoteObject as any
                storeQuote.message = quoteMessage.id

                quotes.push(storeQuote)
                quotes = quotes

                console.log(quotes.length)



                allQuotes[message.guild?.id as string] = quotes

                writeFileSync("./src/quotes.json", JSON.stringify(allQuotes))

                message.delete()
            })


        }
    } catch (error) {

    }
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