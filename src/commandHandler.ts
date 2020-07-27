import * as Discord from "discord.js";
import * as config from "./config.json"
import { commands as cmdTable } from "./cmdTable"
import {getHelp} from "./getHelp"

export function handle(message: Discord.Message, currentInvoker: string, client: Discord.Client) {
    var correctCommand = false;
    var help = true;
    cmdTable.forEach(command => {

        if (command.invokers.includes(currentInvoker)) {

            var permission = command.permission

            var allowed = getPermission(message, permission)

            console.log(allowed)

            if (allowed) {
                command.function(message, client)
                correctCommand = true
            } else {
                message.channel.send("You don't have Permission for this operation. See `<<help` for details")
                help = false
            }
        }
    })


    if (!correctCommand) {
        if (help) getHelp(message.channel)
    }
}

function getPermission(message: Discord.Message, permissions: string[]) {

    if (permissions.indexOf("everyone") > -1) {
        return true
    }

    if (permissions.indexOf("noone") > -1) {
        return false
    }

    for (var permissionIndex in permissions) {
        var permission = permissions[permissionIndex] as string
        if (message.member?.roles.cache.has(permission)) {
            return true;
        } else {
            return false
        }
    }
}