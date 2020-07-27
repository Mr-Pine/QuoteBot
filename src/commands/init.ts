import * as Discord from "discord.js"

export function init(message: Discord.Message){
    
    var content = message.content

    var quoteMaster = content.substring(content.indexOf("<@&"), content.indexOf(">") + 1)
    var quoteChannel = content.substring(content.indexOf("<#"), content.lastIndexOf(">") + 1)

    message.channel.send(`Initializing QuoteBot on "${message.guild?.name}" with QuoteMaster Role: ${quoteMaster} and Channel: ${quoteChannel}`);
}