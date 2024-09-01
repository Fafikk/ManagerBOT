const {
  ActionRowBuilder,
  ChannelType,
  Colors,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");

require("dotenv").config();

module.exports = {
  name: "interactionCreate",
  once: false,
  execute: async (interaction, client) => {
    if (!interaction.isStringSelectMenu()) return;

    const supportTeamId = process.env.SUPPORT_TEAM;

    const existingTicketChannel = interaction.guild.channels.cache.find(
      (c) => c.topic === interaction.user.id
    );
    if (existingTicketChannel) {
      return interaction.reply({
        content: ":x: | You already have a ticket open!",
        ephemeral: true,
      });
    }

    const createTicketChannel = async (type) => {
      await interaction.channel.delete();

      interaction.guild.channels
        .create({
          name: `Ticket of ${interaction.user.username}`,
          topic: interaction.user.id,
          type: ChannelType.GuildText,
          parent: process.env.TICKET_CATEGORY,
          permissionOverwrites: [
            {
              id: interaction.user.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.SendMessages,
              ],
              deny: [PermissionFlagsBits.MentionEveryone],
            },
            {
              id: supportTeamId,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.SendMessages,
              ],
              deny: [PermissionFlagsBits.MentionEveryone],
            },
            {
              id: interaction.guild.id,
              deny: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.MentionEveryone,
              ],
            },
          ],
        })
        .then((channel) => {
          channel.send({
            embeds: [
              {
                title: "Ticket System",
                description: `Welcome to your ticket ${interaction.user}!\nA staff member will assist you shortly.`,
                color: Colors.Blurple,
                footer: {
                  text: "Ticket System",
                },
                timestamp: new Date(),
              },
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("close")
                  .setLabel("Close")
                  .setStyle(ButtonStyle.Danger)
              ),
            ],
          });

          channel
            .send({
              content: `${interaction.user} <@${supportTeamId}>`,
            })
            .then((msg) => {
              setTimeout(() => {
                msg.delete(), 1000;
              });
            });
        });
    };

    switch (interaction.values[0]) {
      case "report":
        createTicketChannel("report");
        break;
      case "question":
        createTicketChannel("question");
        break;
      case "other":
        createTicketChannel("other");
        break;
    }
  },
};
