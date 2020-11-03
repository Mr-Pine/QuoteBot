import * as Discord from "discord.js"
import { readFileSync, writeFileSync } from "fs"

export async function remove(message: Discord.Message, client: Discord.Client) {
    var argString = message.content.slice(message.content.indexOf(" ") + 1)

    removeQuote(argString.split(" ")[0], message.guild?.id as string, client, message.member as Discord.GuildMember, message.channel)
    message.delete()
}

export async function removeQuote( number: string, guildID: string, client: Discord.Client, member: Discord.GuildMember, channel? : Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel){
    
    console.log(`deleting #${number}`)

    var allQuotes = JSON.parse(readFileSync("./src/quotes.json").toString())
    var quotes = allQuotes[guildID] as {
        text: string;
        author: string;
        reporter: string | undefined;
        character: string;
        tags: string[];
        message: string
    }[] | {}[]

    var quote = quotes[parseInt(number) - 1] as {
        text: string;
        author: string;
        reporter: string | undefined;
        character: string;
        tags: string[];
        message: string
    }

    if (parseInt(number) == quotes.length) {
        quotes.pop()
    } else {
        quotes[parseInt(number) - 1] = {};
    }

    allQuotes[guildID] = quotes

    writeFileSync("./src/quotes.json", JSON.stringify(allQuotes))

    var settings = JSON.parse(readFileSync("./src/settings.json").toString())

    if (quote.reporter != member.id && member.roles.cache.has(settings[guildID]["quoteMaster"])) {
        if(channel) channel.send("No permission to remove not self written Quotes!")
        return
    }

    let quoteChannel = await client.channels.fetch(settings[guildID].QUOTE_CHANNEL_ID) as Discord.TextChannel

    var messageID = quote.message
    var quoteMessage = await quoteChannel.messages.fetch(messageID)

    quoteMessage.delete();
}