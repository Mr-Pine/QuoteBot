import * as Discord from "discord.js"

export function getTag(message: Discord.Message, client: Discord.Client) {
    var content = message.content
    var tag = content.substring(content.indexOf(' '), content.length).trim()

    if(!tag.startsWith('<@') || !tag.endsWith('>')){
        message.channel.send("Bitte korrekten Tag eingeben")
        return;
    }

    message.channel.send('\\' + tag)
}