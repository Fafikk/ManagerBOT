const { ActionRowBuilder, ChannelType, Colors, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

// Load environment variables
require('dotenv').config();

module.exports = {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction, client) => {
        // Only handle string select menu interactions
        if (!interaction.isStringSelectMenu()) return;

        // Get the support team ID from environment variables
        const supportTeamId = process.env.support_team;

        // Check if user already has an open ticket
        const existingTicketChannel = interaction.guild.channels.cache.find(c => c.topic === interaction.user.id);
        if (existingTicketChannel) {
            return interaction.reply({
                content: ":x: | You already have a ticket open!",
                ephemeral: true
            });
        }

        // Function to create a ticket channel
        const createTicketChannel = async (type) => {
            // Delete the interaction channel
            await interaction.channel.delete();

            // Create a new ticket channel
            interaction.guild.channels.create({
                name: `Ticket of ${interaction.user.username}`,
                topic: interaction.user.id,
                type: ChannelType.GuildText,
                parent: process.env.ticket_category,
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages],
                        deny: [PermissionFlagsBits.MentionEveryone]
                    },
                    {
                        id: supportTeamId,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages],
                        deny: [PermissionFlagsBits.MentionEveryone]
                    },
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages, PermissionFlagsBits.MentionEveryone]
                    }
                ]
            }).then((channel) => {
                // Send ticket creation message
                channel.send({
                    embeds: [{
                        title: "Ticket System",
                        description: `Welcome to your ticket ${interaction.user}!\nA staff member will assist you shortly.`,
                        color: Colors.Blurple,
                        footer: {
                            text: "Ticket System"
                        },
                        timestamp: new Date()
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder().setCustomId('close').setLabel('Close').setStyle(ButtonStyle.Danger)
                            )
                    ]
                });

                // Notify support team
                channel.send({
                    content: `${interaction.user} <@${supportTeamId}>`
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete(), 1000
                    });
                });
            });
        };

        // Handle different ticket types
        switch (interaction.values[0]) {
            case 'report':
                createTicketChannel('report');
                break;
            case 'question':
                createTicketChannel('question');
                break;
            case 'other':
                createTicketChannel('other');
                break;
        }
    }
};
