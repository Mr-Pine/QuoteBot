import * as Discord from "discord.js"
import {sayText} from "../textToSpeech"

export function getRandom(message: Discord.Message, client: Discord.Client){
    var args = message.content.substr(2).split(' ').slice(1)

    client.channels.fetch("702819863529521272").then(deepQuotesChannel => {
        var deepQuotes = deepQuotesChannel as Discord.TextChannel

        var globalArray: Discord.Message[] = []

        deepQuotes.messages.fetch({ limit: 100 }).then(messageCollection => {
            if (messageCollection.size == 100) {
                var lastMessage = messageCollection.last()
                console.log(lastMessage?.content)
                if (lastMessage) {
                    getMessages(lastMessage, messageCollection.array(), deepQuotes, message, args)
                }
            } else {
                send(messageCollection.array(), message, args)
            }
        })
    })
}

function getMessages(lastMessage: Discord.Message, messageArray: Discord.Message[], deepQuotes: Discord.TextChannel, original: Discord.Message, args: string[]) {
    deepQuotes.messages.fetch({ limit: 100, before: lastMessage.id }).then(messageCollection => {
        messageArray = messageArray.concat(messageCollection.array())
        if (messageCollection.size == 100) {
            var lastMessage = messageCollection.last()
            if (lastMessage) {
                getMessages(lastMessage, messageArray, deepQuotes, original, args)
            }
        } else {
            send(messageArray, original, args)
        }
    })
}

function send(messages: Discord.Message[], original: Discord.Message, args: string[]) {
    if (args[0] == "stats") {
        getStats(messages, original)
    } else {
        sendRandom(messages, original)
    }
}

function sendRandom(messages: Discord.Message[], original: Discord.Message) {
    var index = Math.floor(Math.random() * messages.length)

    var quote = messages[index].content

    original.channel.send(`>>> ${quote}`)

    sayText(quote, original)
}

function getStats(messages: Discord.Message[], original: Discord.Message) {
    var stats: any = {
        total: messages.length,
        users: {

        }
    }
    messages.forEach(message => {
        var authorTag = `<@${message.author.id}>`
        if (stats.users[authorTag]) {
            stats.users[authorTag] += 1
        } else {
            stats.users[authorTag] = 1
        }
    })

    console.log(stats)

    var output = `Gesamt: ${stats.total}\n`

    for(var userId in stats.users){
        if(stats.users[userId] > 1){
        output += `${userId}: ${stats.users[userId]} sehr deepe Quotes\n`
        }else{
            output += `${userId}: ${stats.users[userId]} sehr deepes Quote\n`
        }
    }

    console.log(output)

    original.channel.send(output)
}