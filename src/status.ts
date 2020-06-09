import * as Discord from "discord.js";
import { setTimeout } from "timers";

const functions = [
    function(bot: Discord.Client){
        bot.user?.setActivity("deepen Quotes", {type: "LISTENING"})
    },
    function(bot: Discord.Client){
        bot.user?.setActivity("Help: <<help", {type: "STREAMING"})
    },
    function(bot: Discord.Client){
        bot.user?.setActivity("deep herunter", {type: "WATCHING"})
    },
    function(bot: Discord.Client){
        bot.user?.setActivity("mit seinen Gedanken", {type: "PLAYING"})
    }
]

var current = 0

export function setStatus(bot: Discord.Client) {
    executeAsync(15000, bot)
}

function executeAsync(delay: number, bot: Discord.Client) {
    setTimeout(function () {
        functions[current](bot)
        current ++
        current %= functions.length
        executeAsync(delay, bot)
    }, delay)
}