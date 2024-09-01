const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActivityType, Partials } = require('discord.js');
const colors = require('colors');
require('dotenv').config();

const { TOKEN } = require('./config.js');

// Create a new Discord client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildEmojisAndStickers, 
        GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, 
        GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, 
        GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, 
        GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, 
        Partials.Reaction, Partials.ThreadMember, Partials.User
    ],
    restTimeOffset: 0,
    failIfNotExists: false,
    allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false
    }
});

// Collection for commands
client.commands = new Collection();

// Load commands
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] Command ${filePath} is missing required "data" or "execute" properties.`);
        }
    }
}

// Handle interactions
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`Command not found: ${interaction.commandName}.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'An error occurred while executing this command.',
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: 'An error occurred while executing this command.',
                ephemeral: true,
            });
        }
    }
});

// Load event handlers
require('./handler')(client);

// Set and update presence
const activities = [
    { name: 'Minecraft', type: ActivityType.Playing },
    { name: 'panel klienta', type: ActivityType.Watching },
];

let currentActivityIndex = 0;

const updateActivity = () => {
    const activity = activities[currentActivityIndex];
    if (activity.type === ActivityType.Watching) {
        activity.name = `${client.guilds.cache.size} servers`;
    }

    client.user.setPresence({ activities: [activity], status: 'dnd' });
    currentActivityIndex = (currentActivityIndex + 1) % activities.length;
};

client.on('ready', () => {
    updateActivity();
    setInterval(updateActivity, 5000);
    console.log(`Connected to websocket as ${client.user.tag}`);
});

// Error handling
process.on('unhandledRejection', (error) => {
    if (error.code === 10062) return; // Ignore unknown interaction errors

    console.log(`[ERROR] ${error}`.red);
});

// Log in to Discord
client.login(TOKEN);
