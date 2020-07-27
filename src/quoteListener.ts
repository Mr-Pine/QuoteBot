import * as Discord from "discord.js"
import { readFileSync, writeFileSync } from "fs"
import { settings } from "cluster"
import { generateQuote } from "./generateQuote"

export function listenQuotes(message: Discord.Message) {
    var quoteString = readFileSync("./src/quotes.json").toString()
    var quotes = JSON.parse(quoteString)

    var settings = JSON.parse(readFileSync("./src/settings.json").toString())

    var quoteChannels: string[] = []

    for(var guildID in settings){
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

            message.channel.send(generateQuote(quoteObject, (quotes as Object[]).length + 1, message)).then(quoteMessage => {
                var storeQuote = quoteObject as any
                storeQuote.message = quoteMessage.id

                var arrayQuotes = quotes as Object[]
                arrayQuotes.push(storeQuote)
                quotes = arrayQuotes

                console.log(arrayQuotes.length)


                writeFileSync("./src/quotes.json", JSON.stringify(quotes))

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