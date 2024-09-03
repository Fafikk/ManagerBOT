const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');
const transcript = require('discord-html-transcripts');

// Load environment variables
require('dotenv').config();

module.exports = {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction, client) => {
        // Only handle button interactions
        if (!interaction.isButton()) return;

        if (interaction.customId === "close") {
            // Confirm ticket closure
            interaction.reply({
                content: `Ten ticket zostanie usunięty.`,
                ephemeral: true,
            });

            // Prompt user for transcript choice
            interaction.channel.send({
                embeds: [{
                    title: "Tickety",
                    description: "Ten ticket zostanie usunięty. Czy chcesz zapisać jego logi?",
                    color: Colors.Blurple,
                    footer: {
                        text: "© 2024 YourCompany",
                        iconURL: client.user.displayAvatarURL(),
                    }
                }],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId('yes').setLabel('Tak').setStyle(ButtonStyle.Success),
                            new ButtonBuilder().setCustomId('no').setLabel('Nie').setStyle(ButtonStyle.Danger)
                        )
                ]
            });
        } else if (interaction.customId === "yes") {
            // Fetch ticket logs channel using environment variable
            const ticketLogsChannel = client.channels.cache.get(process.env.ticket_logs);

            if (!ticketLogsChannel) {
                console.error(`[ERROR] Nie odnaleziono kanału z logami ticketów o ID ${process.env.ticket_logs}.`);
                return;
            }

            // Send transcript to logs channel and delete ticket channel
            await ticketLogsChannel.send({
                embeds: [{
                    title: "Zgłoszenia",
                    description: `Nowy ticket został zamknięty (${interaction.channel.name}) przez ${interaction.user}`,
                    color: Colors.Blurple,
                    footer: {
                        text: "© 2024 YourCompany",
                        iconURL: client.user.displayAvatarURL(),
                    }
                }],
                files: [await transcript.createTranscript(interaction.channel)]
            });

            await interaction.channel.send({
                embeds: [{
                    title: "Ticket System",
                    description: `Ticket zamknięty przez ${interaction.user}`,
                    color: Colors.Blurple,
                    footer: {
                        text: "Ticket System"
                    }
                }]
            });

            await interaction.channel.delete();
        } else if (interaction.customId === "no") {
            // Close the ticket without a transcript
            interaction.channel.send({
                embeds: [{
                    title: "Ticket System",
                    description: `Ticket zamknięty przez ${interaction.user}`,
                    color: Colors.Blurple,
                    footer: {
                        text: "Ticket System"
                    }
                }]
            });

            await interaction.channel.delete();
        }
    }
};
