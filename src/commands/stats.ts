import * as Discord from "discord.js"
import { getRequirements, getQuotes } from "../getRequirements"
import { readFileSync } from "fs"

export function stats(message: Discord.Message, client: Discord.Client) {
    const allQuotes = JSON.parse(readFileSync("./src/quotes.json").toString())

    var quotes = getQuotes(getRequirements(message.content), allQuotes)

    var stats: any = {
        authors: {},
        reporters: {},
        tags: {}
    }

    quotes.forEach(quote => {
        var reporter: string = quote.reporter
        if (stats.reporters[reporter]) {
            stats.reporters[reporter] += 1
        } else {
            stats.reporters[reporter] = 1
        }

        var author: string = quote.character
        if (author != "none") {
            if (stats.authors[author]) {
                stats.authors[author] += 1
            } else {
                stats.authors[author] = 1
            }
        }

        var tags: string[] = quote.tags
        tags.forEach(tag => {
            if (tag != "") {
                if (stats.tags[tag]) {
                    stats.tags[tag] += 1
                } else {
                    stats.tags[tag] = 1
                }
            }
        })
    })

    console.log(stats)

    var authorString: string = "";

    Object.keys(stats.authors as Object).forEach((author: string) => {
        authorString += `\n${author}: ${stats.authors[author]}`
    })

    var reporterString = "";

    Object.keys(stats.reporters as Object).forEach((reporter: string) => {
        reporterString += `\n<@!${reporter}>: ${stats.reporters[reporter]}`
    })

    var tagString = "";

    Object.keys(stats.tags as Object).forEach((tags: string) => {
        tagString += `\n${tags}: ${stats.tags[tags]}`
    })


    var statString = `**Gesamt**: ${quotes.length}

**Urheber**:${authorString}

**Reporter**:${reporterString}

**Tags**:${tagString}`

    message.channel.send(statString)
}

