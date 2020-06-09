import fs from 'fs'
import * as Discord from "discord.js";
import { sendEmbed } from './sendEmbed';

export function getHelp(channel: Discord.DMChannel | Discord.NewsChannel | Discord.TextChannel){
    console.log("sending help!");
    
    var helpText = fs.readFileSync("./src/help.md")
    var helpString = helpText.toString()

    sendEmbed(helpString, [115, 176, 72], channel)
}