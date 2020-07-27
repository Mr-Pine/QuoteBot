import * as Discord from "discord.js"
import { readFileSync, writeFileSync } from "fs";

export function init(message: Discord.Message){
    
    var content = message.content

    var quoteMaster = content.substring(content.indexOf("<@&"), content.indexOf(">") + 1)
    var quoteChannel = content.substring(content.indexOf("<#"), content.lastIndexOf(">") + 1)

    message.channel.send(`Initializing QuoteBot on "${message.guild?.name}" with QuoteMaster Role: ${quoteMaster} and Channel: ${quoteChannel}`);

    var settings = JSON.parse(readFileSync("./src/settings.json").toString())

    var serverID = message.guild?.id as string

    settings[serverID] = {
        "quoteMaster": quoteMaster.substring(3, quoteMaster.length - 1),
        "QUOTE_CHANNEL_ID": quoteChannel.substring(2, quoteChannel.length - 1)
    }

    writeFileSync("./src/settings.json", JSON.stringify(settings))
}