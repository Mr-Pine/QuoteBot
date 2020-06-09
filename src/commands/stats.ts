import * as Discord from "discord.js"
import { getRequirements } from "../getRequirements"

export function stats(message: Discord.Message, client: Discord.Client){
    console.log(getRequirements(message.content))
}

