// Import required modules
const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { TICKET_CHANNEL } = require("../../config.js");

require("dotenv").config();
require("colors");

module.exports = {
  name: "ready",
  once: false,
  execute: async (client) => {
    // Log connection status
    console.log(`[READY] Connected to websocket as ${client.user.tag}!`.green);

    // Get the ticket channel from the client
    const channelTicket = client.channels.cache.get(TICKET_CHANNEL);
    const color = parseInt("08f4ff", 16);

    // Fetch the last 20 messages from the ticket channel
    const messages = await channelTicket.messages.fetch({ limit: 20 });

    // Find and delete the old embed message if it exists
    const oldEmbedMessage = messages.find(
      (msg) => msg.embeds.length > 0 && msg.embeds[0].title === "Zgłoszenia",
    );
    if (oldEmbedMessage) {
      await oldEmbedMessage.delete();
    }

    // Create a select menu for ticket categories
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("ticket_category")
      .setPlaceholder("Wybierz kategorię ticketa")
      .addOptions([
        {
          label: "Pomoc ogólna",
          value: "general",
          emoji: "🐛",
        },
        {
          label: "Płatności",
          value: "payments",
          emoji: "💰",
        },
        {
          label: "Współpraca",
          value: "partnership",
          emoji: "💼",
        },
        {
          label: "Żadne z powyższych",
          value: "other",
          emoji: "📁",
        },
      ]);

    // Send the new embed message with the select menu
    await channelTicket.send({
      embeds: [
        {
          title: "Zgłoszenia",
          description:
            "> Aby stworzyć zgłoszenie, kliknij przycisk poniżej. Pamiętaj, że na raz możesz mieć otwarty tylko jeden ticket! W tickecie prosimy o nie oznaczanie administracji.",
          color: color,
          footer: {
            text: "© 2024 ManagerBOT",
            iconURL: client.user.displayAvatarURL(),
          },
        },
      ],
      components: [new ActionRowBuilder().addComponents(selectMenu)],
    });
  },
};
