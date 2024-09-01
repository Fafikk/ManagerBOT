const fs = require('node:fs')
const path = require('node:path')
const {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    ActivityType,
    Partials
} = require('discord.js')
const { TOKEN } = require('./config.js')

require('dotenv').config()

const client = new Client({
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ],
    partials: [ Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User ],
    restTimeOffset: 0,
    failIfNotExists: false
})

client.commands = new Collection()

const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder)
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith('.js'))
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file)
        const command = require(filePath)
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command)
        } else {
            console.log(
                `[WARNING] W komendzie ${filePath} brakuje a wymaganych "data" lub "execute" właściwości.`,
            )
        }
    }
}

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) {
        console.error(`Nie znaleziono komendy: ${interaction.commandName}.`)
        return
    }

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'Wystąpił błąd podczas wykonywania tej komendy.',
                ephemeral: true,
            })
        } else {
            await interaction.reply({
                content: 'Wystąpił błąd podczas wykonywania tej komendy.',
                ephemeral: true,
            })
        }
    }
})

const activities = [
    // add more activities if you want | dodaj wiecej aktywnosci jesli chcesz
    { name: 'Minecraft', type: ActivityType.Playing },
    { name: 'panel klienta', type: ActivityType.Watching },
]

let currentActivityIndex = 0

client.on('ready', () => {
    require('./handler')(client);

    const updateActivity = () => {
        const activity = activities[currentActivityIndex]

        if (activity.type === ActivityType.Watching) {
            activity.name = `${client.guilds.cache.size} serwerów`
        }

        client.user.setPresence({ activities: [activity], status: 'dnd' })
        currentActivityIndex = (currentActivityIndex + 1) % activities.length
    }

    setInterval(updateActivity, 5000)
    console.log(`Połączono z websocket jako ${client.user.tag}`)
})

client.login(TOKEN)
