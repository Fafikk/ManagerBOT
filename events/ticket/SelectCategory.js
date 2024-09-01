const {
  ActionRowBuilder,
  ChannelType,
  Colors,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
} = require("discord.js");

require("dotenv").config();

module.exports = {
  name: "interactionCreate",
  once: false,
  execute: async (interaction, client) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "ticket") {
      interaction.guild.channels
        .create({
          name: `Select a category`,
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
                description: "Please select a category for your ticket!",
                color: Colors.Blurple,
              },
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                  .setCustomId("category")
                  .setPlaceholder("Select a category")
                  .addOptions([
                    {
                      label: "Report",
                      description: "Report a user",
                      value: "report",
                      emoji: "🐛",
                    },
                    {
                      label: "Question",
                      description: "Any question",
                      value: "question",
                      emoji: "📝",
                    },
                    {
                      label: "Other",
                      description: "Other",
                      value: "other",
                      emoji: "📁",
                    },
                  ])
              ),
            ],
          });

          channel
            .send({
              content: `${interaction.user}`,
            })
            .then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 1000);
            });
        });

      interaction.reply({
        content: `:white_check_mark: | Your ticket has been created!`,
        ephemeral: true,
      });
    }
  },
};
