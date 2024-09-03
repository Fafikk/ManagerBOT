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
        const color = parseInt('08f4ff', 16);

        // Check if user already has an open ticket
        const existingTicketChannel = interaction.guild.channels.cache.find(c => c.topic === interaction.user.id);
        if (existingTicketChannel) {
            return interaction.reply({
                content: ":x: | Masz już otwarty ticket!",
                ephemeral: true
            });
        }

        // Function to create a ticket channel
        const createTicketChannel = async (type) => {
            // Delete the interaction channel
            await interaction.channel.delete();

            // Create a new ticket channel
            interaction.guild.channels.create({
                name: `Ticket użytkownika ${interaction.user.username}`,
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
                        title: "Zgłoszenia",
                        description: `**Ticket użytkownika ${interaction.user} zostało pomyślnie utworzony!** \n\n- \`Typ ticketa:\` **${type}**`,
                        color: color,
                        footer: {
                            text: "© 2024 YourCompany",
                            iconURL: client.user.displayAvatarURL(),
                        }
                    }],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder().setCustomId('close').setLabel('Zamknij ticketa').setStyle(ButtonStyle.Danger)
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
            case 'ogolne':
                createTicketChannel('Pomoc ogólna');
                break;
            case 'platnosci':
                createTicketChannel('Płatności');
                break;
            case 'wspolpraca':
                createTicketChannel('Współpraca');
                break;
            case 'other':
                createTicketChannel('Żadne z powyższych');
                break;
        }
    }
};
