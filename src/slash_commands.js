import { Client } from "discord.js";
import { commands } from "./cmdTable";
import { handleSlash } from "./commands/random";

export function registerSlash(client) {
    var table = commands
    table.forEach(command => {
        if (command.commandObject) {
            client.api.applications(client.user.id).guilds("492426074396033035").commands.post(command.commandObject)
        }
    })

    client.ws.on('INTERACTION_CREATE', async interaction => {
        const commandName = interaction.data.name.toLowerCase()
        var topArgs = interaction.data.options
        var args = false

        if (topArgs) {
            if (topArgs.length > 0) {
                args = topArgs[0].options ? topArgs[0].options : topArgs
            }
        }

        table.find(command => command.commandObject ? (command.commandObject.data.name.toLowerCase() == commandName) : false).function(client, interaction, args)

    })
}