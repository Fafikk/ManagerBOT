const colors = require("colors");
const {
  ActionRowBuilder,
  Colors,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

require("dotenv").config();

module.exports = {
  name: "ready",
  once: false,
  execute: async (client) => {
    console.log(
      `[READY] ${client.user.tag} (${client.user.id}) is ready!`.green
    );

    let channelTicket = client.channels.cache.get(process.env.ticket_channel);

    if (!channelTicket) {
      console.error(
        `[ERROR] Ticket channel with ID ${process.env.ticket_channel} not found.`
      );
      return;
    }

    await channelTicket.send({ content: "." });
    await channelTicket.bulkDelete(2);

    await channelTicket.send({
      embeds: [
        {
          title: "Ticket System",
          description:
            "If you want to open a ticket to contact the staff, click on the button below!",
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
            .setCustomId("ticket")
            .setLabel("Open a ticket")
            .setStyle(ButtonStyle.Secondary)
        ),
      ],
    });
  },
};
