import { APIMessage } from "discord.js";

export async function createAPIMessage(interaction, content, client) {
    const apiMessage = await APIMessage.create(client.channels.resolve(interaction.channel_id), content)
        .resolveData()
        .resolveFiles();

    return { ...apiMessage.data, files: apiMessage.files };
}