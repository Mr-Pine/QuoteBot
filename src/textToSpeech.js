import { VoiceState } from "discord.js"

var gtts = require("gtts")

export async function sayText(text, interaction, client) {

    var tts = new gtts(text, "de")
    await tts.save("./src/text.mp3")

    var voiceChannel = (await getVoice(interaction, client)).channel
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

async function getVoice(interaction, client) {
    const guild = await client.guilds.fetch(interaction.guild_id)
    const voice = guild.voiceStates.cache.get(interaction.member.user.id) || new VoiceState(guild, { user_id: interaction.member.user.id });
    return voice
}