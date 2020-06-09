import * as Discord from "discord.js"
import { readFileSync } from "fs";
import { setTimeout } from "timers";
import { getRequirements, getQuotes } from "../getRequirements";

export function list(message: Discord.Message, client: Discord.Client) {
    if (message.channel.id != "704275816598732840") {
        message.channel.send("Only possible in <#704275816598732840>")
        return;
    }

    const allQuotes = JSON.parse(readFileSync("./src/quotes.json").toString())

    var requirements = getRequirements(message.content)

    console.log(requirements)
    var quoteSelection = getQuotes(requirements, allQuotes)
    console.log(quoteSelection)
    
    if(quoteSelection.length == 0){
        message.channel.send("Nothing matched your selection")
    }else if(quoteSelection.length > 30){
        message.channel.send("Please limit your selection further. Maximum is 30 Messages")
    }else{
        sendNext(quoteSelection, 0, message)
    }


}

function sendNext(allQuotes: any[], index: number, message: Discord.Message) {
    var quote = allQuotes[index]
    message.channel.send(`${quote.text}\n     -${quote.author}`).then(() => {
        if (++index < allQuotes.length) {
            setTimeout(() => { sendNext(allQuotes, index, message) }, 200)
        }
    }
    )
}