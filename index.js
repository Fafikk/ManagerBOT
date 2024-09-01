const fs = require('node:fs')
const path = require('node:path')
const {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    ActivityType,
    IntentsBitField,
} = require('discord.js')
const { TOKEN } = require('./config.js')

require('dotenv').config()

const client = new Client({
    intents: [GatewayIntentBits.Guilds, IntentsBitField.Flags.Guilds],
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
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
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
    const updateActivity = () => {
        const activity = activities[currentActivityIndex]

        if (activity.type === ActivityType.Watching) {
            activity.name = `${client.guilds.cache.size} serwerów`
        }

        client.user.setPresence({ activities: [activity], status: 'dnd' })
        currentActivityIndex = (currentActivityIndex + 1) % activities.length
    }

    setInterval(updateActivity, 5000)
    console.log(`Connected to websocket as ${client.user.tag}`)
})

client.login(TOKEN)
