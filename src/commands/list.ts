import * as Discord from "discord.js"
import { readFileSync } from "fs";
import { setTimeout } from "timers";

export function list(message: Discord.Message, client: Discord.Client) {
    if (message.channel.id != "704275816598732840") {
        message.channel.send("Only possible in <#704275816598732840>")
        return;
    }

    const allQuotes = JSON.parse(readFileSync("./src/quotes.json").toString())

    var requirements: { excluded: string[], included: string[][] } = {
        excluded: [],
        included: []
    }

    var tagString = message.content.substring(message.content.indexOf("{") + 1, message.content.indexOf("}"))

    var tagParts = tagString.split('|')
    tagParts.forEach((part, index) => {
        var tagArray = part.split(",")

        var includedArray: string[] = []

        tagArray.forEach((tag, index) => {
            while (tag.startsWith(" ")) {
                tag = tag.substring(1)
            }
            while (tag.endsWith(" ")) {
                tag = tag.substring(0, tag.length - 1)
            }
            tagArray[index] = tag
            if (tag.startsWith("!")) {
                requirements.excluded.push(tag.substring(1))
            } else {
                includedArray.push(tag)
            }
        })

        requirements.included.push(includedArray)
    })

    console.log(requirements)
    var quoteSelection = getQuotes(requirements, allQuotes)
    console.log(quoteSelection)
    
    if(quoteSelection.length == 0){
        message.channel.send("Nothing matched your selection")
    }else if(quoteSelection.length > 30){
        message.channel.send("Please limit your selection further. Maximum is 30 Messages")
    }else{
        sendNext(quoteSelection, 0, message)
    }


}

function getQuotes(requirements: { excluded: string[], included: string[][] }, allQuotes: any[]) {
    var listQuotes = allQuotes.filter(quote => {
        if (quote.character != "none") {
            quote.tags.push(quote.character.substring(0, quote.character.length - 1))
        }
        var meetsRequirements = false
        //check if has all required tags [works]
        requirements.included.forEach(part => {
            var meetsPart = true

            part.forEach(tag => {
                meetsPart = (quote.tags as string[]).includes(tag) && meetsPart
            })

            meetsRequirements = meetsRequirements || meetsPart
        })

        //check if has any of exluded tags [works]
        requirements.excluded.forEach(exclude => {
            meetsRequirements = !(quote.tags as string[]).includes(exclude) && meetsRequirements
        })
        return meetsRequirements
    })

    return listQuotes
}

function sendNext(allQuotes: any[], index: number, message: Discord.Message) {
    var quote = allQuotes[index]
    message.channel.send(`${quote.text}\n     -${quote.author}`).then(() => {
        if (++index < allQuotes.length) {
            setTimeout(() => { sendNext(allQuotes, index, message) }, 200)
        }
    }
    )
}