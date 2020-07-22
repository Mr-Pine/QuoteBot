import * as Discord from "discord.js"
import { readFileSync } from "fs"

export function generateQuote(quoteObject: {
    text: string;
    author: string;
    reporter: string | undefined;
    character: string;
    tags: string[];
    message?: string;
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
    template = template.replace("{tags}", quoteObject.tags.join(", "))
    template = template.replace("{number}", quoteNumber.toString())

    if(quoteObject.reporter){
        template = template.replace("{reporter}", `<@!${quoteObject.reporter}>`)
    } else {
        template = template.replace("{reporter}", `-`)
    }

    return template

}