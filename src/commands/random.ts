import * as Discord from "discord.js"
import { readFileSync } from "fs"
import { getAllJSDocTags } from "typescript"
import { sayText } from "../textToSpeech"

export function getRandom(message: Discord.Message, client: Discord.Client) {
    var args = message.content.substr(2).split(' ').slice(1)

    var allQuotes = JSON.parse(readFileSync("./src/quotes.json").toString())
    var quotes = allQuotes[message.guild?.id as string] as {
        text: string;
        author: string;
        reporter: string | undefined;
        character: string;
        tags: string[];
        message: string
    }[]

    if (args[0] == "stats") {
        getStats(message, quotes)
    } else {
        sendRandom(message, client, args, quotes)
    }
}

async function sendRandom(message: Discord.Message, client: Discord.Client, args: string[], quotes: {
    text: string;
    author: string;
    reporter: string | undefined;
    character: string;
    tags: string[];
    message: string
}[]) {

    var settings = JSON.parse(readFileSync("./src/settings.json").toString())

    let quoteChannel = await client.channels.fetch(settings[message.guild?.id as string].QUOTE_CHANNEL_ID) as Discord.TextChannel

    var quoteNumber = quotes.length
    var randomIndex = Math.floor(Math.random() * quoteNumber)

    if (!isNaN(parseInt(args[0]))) {
        randomIndex = parseInt(args[0]) - 1
    }
    if(args.includes("latest")){
        randomIndex = quotes.length - 1
    }

    var quote = quotes[randomIndex]

    var index = quotes.indexOf(quote)


    var messageID = quote.message
    var quoteMessage = await quoteChannel.messages.fetch(messageID)

    var speechText = "Quote Nummer " + (index + 1) + " . " + quote.text + ".    " + quote.author

    var outEmbed = {
        title: "Quote " + (index + 1),
        description: quote.text + "\n\n    -" + quote.author + "\n\n[link](" + quoteMessage.url + ")",
        color: 0x7289DA
    }

    message.channel.send(new Discord.MessageEmbed(outEmbed))

    if (!args.includes("mute")) {
        sayText(speechText, message)
    }

}

function getStats(message: Discord.Message, quotes: {
    text: string;
    author: string;
    reporter: string | undefined;
    character: string;
    tags: string[];
    message: string
}[]) {

    var stats: any = {
        reporters: {},
        characters: {},
        tags: {}
    }

    quotes.forEach(quote => {
        if (!stats.reporters[quote.reporter as string]) {
            stats.reporters[quote.reporter as string] = 0
        }
        stats.reporters[quote.reporter as string] = stats.reporters[quote.reporter as string] + 1

        quote.character = quote.character.trim()
        if (quote.character != "none" && quote.character != "") {
            if (!stats.characters[quote.character]) {
                stats.characters[quote.character] = 0
            }
            stats.characters[quote.character] = stats.characters[quote.character] + 1
        }

        quote.tags.forEach(tag => {
            tag = tag.trim()
            if (tag != "") {

                if (!stats.tags[tag]) {
                    stats.tags[tag] = 0
                }
                stats.tags[tag] = stats.tags[tag] + 1
            }
        })
    })

    var statsSorted: any = {
        reporters: [],
        characters: [],
        tags: []
    }

    //reporter:

    var reporterValues = Object.values(stats.reporters).sort(function (a: any, b: any) { return b - a })

    for (var reporter in stats.reporters) {
        var content = "<@" + reporter  + ">: " + stats.reporters[reporter]

        var index = reporterValues.indexOf(stats.reporters[reporter])

        statsSorted.reporters.splice(index, 0, content)
    }

    //character:

    var characterValues = Object.values(stats.characters).sort(function (a: any, b: any) { return b - a })

    for (var character in stats.characters) {
        var content = character  + ": " + stats.characters[character]

        var index = characterValues.indexOf(stats.characters[character])

        statsSorted.characters.splice(index, 0, content)
    }

    //tags:

    var tagValues = Object.values(stats.tags).sort(function (a: any, b: any) { return b - a })

    for (var tag in stats.tags) {
        var content = tag  + ": " + stats.tags[tag]

        var index = tagValues.indexOf(stats.tags[tag])

        statsSorted.tags.splice(index, 0, content)
    }

    var statEmbed = {
        title: "Quote Statistiken",
        description: "Insgesamt " + quotes.length + " deepe Quotes",
        color: 0x7289DA,
        fields: [
            {
                name: "Eingereichte Quotes:",
                value: statsSorted.reporters.join("\n"),
            },
            {
                name: "Vorkommen in Quotes:",
                value: statsSorted.characters.join("\n"),
            },
            {
                name: "Tags:",
                value: statsSorted.tags.join("\n")
            }
        ]
    }

    message.channel.send(new Discord.MessageEmbed(statEmbed))


}