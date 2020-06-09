import * as Discord from "discord.js";

export function sendEmbed(text: string, color: Discord.ColorResolvable, channel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel){
    const embed = new Discord.MessageEmbed()
    .setDescription(text)
    .setColor(color)

    channel.send("", embed)
}