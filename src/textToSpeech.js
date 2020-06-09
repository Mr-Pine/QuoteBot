var gtts = require("gtts")

export async function sayText(text, message) {

    var tts = new gtts(text, "de")
    await tts.save("./src/text.mp3")

    var voiceChannel = message.member.voice.channel
    try {
        voiceChannel.join().then(connection => {
            const dispatcher = connection.play('./src/text.mp3')
            var started = false
            var counter = 0
            dispatcher.on("finish", () => {
                voiceChannel.leave()
            })
        }).catch(err => console.log(err))
    } catch (err) {
        console.log(err)
        console.log(message.member.voice)
    }
}
