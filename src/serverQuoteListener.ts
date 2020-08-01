import * as http from "http"
import { Console } from "console"

export function listenServer() {

    const server = http.createServer(function (request, response) {

        var body = ''
        request.on('data', function (data) {
            body += data
        })
        request.on('end', function () {
            body = decodeURIComponent(body)
            console.log('Body: ' + body)
            var bodyJSON = getBodyJSON(body)
            console.log(`content: ${bodyJSON["quote"].toString()}`)
            console.log(`server: ${bodyJSON["server"]}`)
            console.log(`user: ${bodyJSON["user"]}`)
            response.writeHead(200, { 'Content-Type': 'text/plain' })
            response.end('post received')
        })
    })

    const port = 3000
    const host = '127.0.0.1'
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