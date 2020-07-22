import * as Discord from "discord.js"
import * as config from "./config.json"
import { readFileSync, writeFileSync } from "fs"
import { settings } from "cluster"

export function listenQuotes(message: Discord.Message) {
    var quoteString = readFileSync("./src/quotes.json").toString()
    var quotes = JSON.parse(quoteString)

    if (message.channel.id == config.QUOTE_CHANNEL_ID && message.content.startsWith("Text:")) {
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

        var quoteObject = {text: parts[0],
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

function generateQuote(quoteObject: {
    text: string;
    author: string;
    reporter: string | undefined;
    character: string;
    tags: string[]
}, quoteNumber: number, message: Discord.Message) {
    var settings = JSON.parse(readFileSync("./src/settings.json").toString())

    var serverID = message.guild?.id as string
    if (settings[serverID] == null) {
        return `${quoteObject.text}\n     -${quoteObject.author}\n\n`
    }

    var template = settings[serverID]["template"] as string

    console.log(template)

    template = template.replace("{text}", quoteObject.text)
    template = template.replace("{author}", quoteObject.author)
    template = template.replace("{authorTag}", quoteObject.character)
    template = template.replace("{tags}", quoteObject.tags.join())
    template = template.replace("{number}", quoteNumber.toString())

    if(quoteObject.reporter){
        template = template.replace("{reporter}", `<@!${quoteObject.reporter}>`)
    } else {
        template = template.replace("{reporter}", `-`)
    }

    return template

}