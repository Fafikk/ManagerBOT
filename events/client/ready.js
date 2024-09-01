const colors = require('colors');
const config = require('../../config.js');
const { ActionRowBuilder, Colors, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'ready',
    once: false,
    execute: async (client) => {
        console.log(`[READY] ${client.user.tag} (${client.user.id}) jest gotowy !`.green);

        let channelTicket = client.channels.cache.get(config.ticket_channel);
        const color = parseInt('08f4ff', 16);

        await channelTicket.send({ content: "." })
        await channelTicket.bulkDelete(2);

        await channelTicket.send({
            embeds: [{
                title: "Zgłoszenia",
                description: "> Aby stworzyć zgłoszenie, kliknij przycisk poniżej. Pamiętaj, że na raz możesz mieć otwarty tylko jeden ticket! W tickecie prosimy o nie oznaczanie administracji.",
                color: color,
                footer: {
                    text: "© 2024 YourCompany",
                    iconURL: client.user.displayAvatarURL(),
                },
            }],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder() .setCustomId('ticket') .setLabel('📩 • Stwórz ticketa') .setStyle(ButtonStyle.Primary)
                )
            ]
        })
    }
}
