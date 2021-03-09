// import * as http from "http"
import { createQuote } from "./quoteListener"
import { readFileSync } from "fs"
import * as Discord from "discord.js"
import { removeQuote } from './commands/remove'
import { editQuote } from "./commands/edit"
const express = require('express');

export function listenServer(client: Discord.Client) {

    const settings = JSON.parse(readFileSync("./src/settings.json").toString())

    const port = 3000
    const host = 'localhost'//'192.168.178.52'

    const apiURL = "/api";

    const app = express();
    const server = app.listen(port, () => {
        console.log(`Express running → PORT ${server.address().port}`);
    });


    app.get('/server-list', (req: any, res: any) => {


        res.setHeader('Content-Type', 'text/plain')
        res.setHeader("Access-Control-Allow-Origin", "*");
        // res.statusCode = 200
        res.send(JSON.stringify({ servers: Object.keys(settings) }))

    })

    app.get('/', (req: any, res: any) => {

        res.sendStatus(200);

    })


    app.post(apiURL, async (req: any, res: any) => {

        var body = ''
        req.on('data', function (data: any) {
            body += data
        })
        req.on('end', function () {
            body = decodeURIComponent(body)
            body = body.split("%20").join(" ")
            console.log('Body: ' + body)
            var bodyJSON = getBodyJSON(body)
            console.log(`content: ${bodyJSON["quote"].toString()}`)
            console.log(`server: ${bodyJSON["server"]}`)
            console.log(`user: ${bodyJSON["user"]}`)
            res.sendStatus(200);


            client.channels.fetch(settings[bodyJSON["server"]]["QUOTE_CHANNEL_ID"] as string).then(quoteChannel => {
                createQuote(quoteChannel as Discord.TextChannel, bodyJSON["quote"].toString(), bodyJSON["user"], bodyJSON["server"])
            })

        })

    });

    app.delete(apiURL, async (req: any, res: any) => {
        console.log("delete")

        var body = ''
        req.on('data', function (data: any) {
            body += data
        })
        req.on('end', function () {
            body = decodeURIComponent(body)
            body = body.split("%20").join(" ")
            var bodyJSON = getBodyJSON(body)
            req.sendStatus(200);

            console.log(bodyJSON)

            var member = client.guilds.cache.get(bodyJSON['server'])?.members.cache.get(bodyJSON['user'])
            console.log(member)

            removeQuote(bodyJSON['number'], bodyJSON['server'], client, member as Discord.GuildMember)
        })
    });

    app.patch(apiURL, async (req: any, res: any) => {

        console.log("edit")

        var body = ''
        req.on('data', function (data: any) {
            body += data
        })
        req.on('end', function () {
            body = decodeURIComponent(body)
            body = body.split("%20").join(" ")
            var bodyJSON = getBodyJSON(body)
            res.sendStatus(200);


            var member = client.guilds.cache.get(bodyJSON['server'])?.members.cache.get(bodyJSON['user'])

            editQuote(bodyJSON["number"], bodyJSON["quote"].toString(), bodyJSON["server"], client, member as Discord.GuildMember)


        })

    })

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
