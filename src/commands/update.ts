import * as Discord from "discord.js"
import { readFileSync, writeFileSync } from "fs"
import * as config from "../config.json"
import { generateQuote } from "../generateQuote"

export async function update(message: Discord.Message, client: Discord.Client){
    
    var quotes = JSON.parse(readFileSync("./src/quotes.json").toString()) as {
        text: string;
        author: string;
        reporter: string | undefined;
        character: string;
        tags: string[];
        message: string
    }[]

    //for(let i = 0; i < quotes.lenth; i++){
    let i = quotes.length - 1

    var messageID = quotes[i].message

    let quoteChannel = await client.channels.fetch(config.QUOTE_CHANNEL_ID) as Discord.TextChannel

    var quoteMessage = await quoteChannel.messages.fetch(messageID)

    console.log(quoteMessage.content)

    quoteMessage.delete()

    var newContent = generateQuote(quotes[i], i + 1, message)
    var newMessage = await quoteChannel.send(newContent)
    quotes[i].message = newMessage.id
    

    //}

    writeFileSync("./src/quotes.json", JSON.stringify(quotes))
}