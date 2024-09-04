const { ActionRowBuilder, ChannelType, Colors, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

// Load environment variables
require('dotenv').config();

module.exports = {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction, client) => {
        // Only handle string select menu interactions
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== 'ticket_category') return;

        const supportTeamId = process.env.support_team;
        const blacklistRoleId = process.env.blacklist_role;
        const color = parseInt('08f4ff', 16);

        // Check if user has the blacklist role
        if (interaction.member.roles.cache.has(blacklistRoleId)) {
            return interaction.reply({
                content: ":x: | Nie masz uprawnień do tworzenia ticketów, ponieważ jesteś na blackliście!",
                ephemeral: true
            });
        }

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
                channel.send({
                    embeds: [{
                        title: "Zgłoszenia",
                        description: `**Ticket użytkownika ${interaction.user} zostało pomyślnie utworzone!** \n\n- \`Typ ticketa:\` **${type}**`,
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

                channel.send({
                    content: `${interaction.user} <@${supportTeamId}>`
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete(), 1000
                    });
                });
            });
        };

        // Determine ticket type and create the appropriate ticket channel
        let ticket_type = "";
        switch (interaction.values[0]) {
            case 'ogolne':
                await createTicketChannel('Pomoc ogólna');
                ticket_type = "Pomoc ogólna";
                break;
            case 'platnosci':
                await createTicketChannel('Płatności');
                ticket_type = "Płatności";
                break;
            case 'wspolpraca':
                await createTicketChannel('Współpraca');
                ticket_type = "Współpraca";
                break;
            case 'inne':
                await createTicketChannel('Żadne z powyższych');
                ticket_type = "Żadne z powyższych";
                break;
        }

        // Send a reply to the user confirming ticket creation
        await interaction.reply({
            content: `:white_check_mark: | Twój ticket został utworzony w kategorii: **${ticket_type}**!`,
            ephemeral: true
        });
    }
};
