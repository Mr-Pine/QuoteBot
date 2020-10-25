import * as http from "http"
import { createQuote } from "./quoteListener"
import { readFileSync } from "fs"
import * as Discord from "discord.js"

export function listenServer(client: Discord.Client) {

    const server = http.createServer(function (request, response) {

        var body = ''
        request.on('data', function (data) {
            body += data
        })
        request.on('end', function () {
            body = decodeURIComponent(body)
            body = body.split("%20").join(" ")
            console.log('Body: ' + body)
            var bodyJSON = getBodyJSON(body)
            console.log(`content: ${bodyJSON["quote"].toString()}`)
            console.log(`server: ${bodyJSON["server"]}`)
            console.log(`user: ${bodyJSON["user"]}`)
            response.writeHead(200, { 'Content-Type': 'text/plain' })
            response.end('post received')

            var settings = JSON.parse(readFileSync("./src/settings.json").toString())


            client.channels.fetch(settings[bodyJSON["server"]]["QUOTE_CHANNEL_ID"] as string).then(quoteChannel => {
                createQuote(quoteChannel as Discord.TextChannel, bodyJSON["quote"].toString(), bodyJSON["user"], bodyJSON["server"])
            })

        })
    })

    const port = 3000
    const host = '192.168.178.52'
    server.listen(port, host)
    console.log(`Listening at http://${host}:${port}`)


}

function getBodyJSON(body: string) {
    var bodyObject: any = {}
    var pairs = body.split("&")
    pairs.forEach(pair => {
        var keyVal = pair.split("=")
        bodyObject[keyVal[0]] = keyVal[1]
    })

    return bodyObject
}
