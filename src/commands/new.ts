import * as Discord from "discord.js"
import { setTimeout } from "timers"

export function newQuote(message: Discord.Message, client: Discord.Client){
    var template = 
    "Text: [replace this]\n\n\n"+
    "Urheber: [replace this]\n\n\n"+
    "Urheber tag: [replace with tag. If not on Server: none]\n\n\n"+
    "Tags: [replace with fitting tags, separated by ',']"
    message.delete()
    var messageTemplate = message.channel.send(template)
    var messageInfo = message.channel.send("Please copy and fill out this template. Leave the line breaks in.")
    setTimeout(() => {
        messageTemplate.then(message => message.delete())
        messageInfo.then(message => message.delete())
    }, 10000)
}