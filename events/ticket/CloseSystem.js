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
                content: `Are you sure you want to delete the ticket?`,
                ephemeral: true,
            });

            // Prompt user for transcript choice
            interaction.channel.send({
                embeds: [{
                    title: "Ticket System",
                    description: "The ticket will be closed. Do you want the transcript of it?",
                    color: Colors.Blurple,
                    footer: {
                        text: "Ticket System"
                    },
                    timestamp: new Date()
                }],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId('yes').setLabel('Yes').setStyle(ButtonStyle.Success),
                            new ButtonBuilder().setCustomId('no').setLabel('No').setStyle(ButtonStyle.Danger)
                        )
                ]
            });
        } else if (interaction.customId === "yes") {
            // Fetch ticket logs channel using environment variable
            const ticketLogsChannel = client.channels.cache.get(process.env.ticket_logs);

            if (!ticketLogsChannel) {
                console.error(`[ERROR] Ticket logs channel with ID ${process.env.ticket_logs} not found.`);
                return;
            }

            // Send transcript to logs channel and delete ticket channel
            await ticketLogsChannel.send({
                embeds: [{
                    title: "Ticket System",
                    description: `New ticket closed (${interaction.channel.name}) by ${interaction.user}`,
                    color: Colors.Blurple,
                    footer: {
                        text: "Ticket System"
                    },
                    timestamp: new Date()
                }],
                files: [await transcript.createTranscript(interaction.channel)]
            });

            await interaction.channel.send({
                embeds: [{
                    title: "Ticket System",
                    description: `Ticket closed by ${interaction.user}`,
                    color: Colors.Blurple,
                    footer: {
                        text: "Ticket System"
                    },
                    timestamp: new Date()
                }]
            });

            await interaction.channel.delete();
        } else if (interaction.customId === "no") {
            // Close the ticket without a transcript
            interaction.channel.send({
                embeds: [{
                    title: "Ticket System",
                    description: `Ticket closed by ${interaction.user}`,
                    color: Colors.Blurple,
                    footer: {
                        text: "Ticket System"
                    },
                    timestamp: new Date()
                }]
            });

            await interaction.channel.delete();
        }
    }
};
