const colors = require('colors');
const config = require('../../config.js');
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: 'ready',
    once: false,
    execute: async (client) => {
        console.log(`[READY] ${client.user.tag} (${client.user.id}) jest gotowy !`.green);

        let channelTicket = client.channels.cache.get(config.ticket_channel);
        const color = parseInt('08f4ff', 16);

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('ticket_category')
            .setPlaceholder('Wybierz kategorię ticketa')
            .addOptions([
                {
                    label: 'Pomoc ogólna',
                    value: 'ogolne',
                    emoji: '🐛'
                },
                {
                    label: 'Płatności',
                    value: 'platnosci',
                    emoji: '💰'
                },
                {
                    label: 'Współpraca',
                    value: 'wspolpraca',
                    emoji: '💼'
                },
                {
                    label: 'Żadne z powyższych',
                    value: 'inne',
                    emoji: '📁'
                }
            ]);

        await channelTicket.send({
            embeds: [{
                title: "Tickety",
                description: "> Aby otworzyć ticketa wybierz kategorię z poniższej listy.",
                color: color,
                footer: {
                    text: "© 2024 YourCompany",
                    iconURL: client.user.displayAvatarURL(),
                },
            }],
            components: [
                new ActionRowBuilder()
                    .addComponents(selectMenu)
            ]
        });
    }
}
