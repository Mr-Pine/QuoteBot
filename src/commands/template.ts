import * as Discord from "discord.js"
import { readFileSync, writeFile, writeFileSync } from "fs"

export function setTemplate(message: Discord.Message) {

    //get template from message
    var template = message.content.slice(message.content.indexOf(" "))
    var startIndex = template.indexOf("[")
    var endIndex = template.lastIndexOf("]")

    if (startIndex == -1 || endIndex == -1) {
        message.channel.send("Please surround template with []")
        return
    }

    template = template.substring(startIndex + 1, endIndex)
    console.log(template)

    //save in settings
    var settings = JSON.parse(readFileSync("./src/settings.json").toString())
    var serverID = message.guild?.id as string

    if (settings[serverID] == null) {
        settings[serverID] = {}
    }
    settings[serverID]["template"] = template

    writeFileSync("./src/settings.json", JSON.stringify(settings))
}