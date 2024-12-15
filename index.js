const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  ActivityType,
  Partials,
} = require("discord.js");
const { TOKEN } = require("./config.js");
require("dotenv").config();

// Create Discord Client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
    Partials.ThreadMember,
    Partials.User,
  ],
  restTimeOffset: 0,
  failIfNotExists: false,
  allowedMentions: {
    parse: ["roles", "users", "everyone"],
    repliedUser: false,
  },
});

// Initialize commands collection
client.commands = new Collection();

// Initialize command handler
require("./handlers/CommandHandler")(client);

// Handle slash commands
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.log(`[ERROR] ${error.message}`);
    const errorMessage = "An error occurred while executing the command.";
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMessage, ephemeral: true });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
});

// Activity management
const activities = [{ name: "Minecraft", type: ActivityType.Playing }];
let currentActivityIndex = 0;

const updateActivity = () => {
  const activity = activities[currentActivityIndex];
  client.user.setPresence({ activities: [activity], status: "dnd" });
  currentActivityIndex = (currentActivityIndex + 1) % activities.length;
};

// Ready event
client.on("ready", () => {
  console.log(`[INFO] Logged in as ${client.user.tag}`);
  updateActivity();
  setInterval(updateActivity, 5000);
});

// Error handling
process.on("unhandledRejection", (error) => {
  if (error.code === 10062) return;
  console.log(`[ERROR] ${error.message}`);
});

// Login
client.login(TOKEN);
