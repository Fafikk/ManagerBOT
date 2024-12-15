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

// Initialize handlers
require("./handlers/CommandHandler")(client);
require("./handlers/EventHandler")(client);

// Activity management
const activities = [{ name: "Minecraft", type: ActivityType.Playing }];
let currentActivityIndex = 0;

const updateActivity = () => {
  const activity = activities[currentActivityIndex];
  client.user.setPresence({ activities: [activity], status: "dnd" });
  currentActivityIndex = (currentActivityIndex + 1) % activities.length;
};

// Ready event handler for activity
client.once("ready", () => {
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
