const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActivityType, IntentsBitField } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		IntentsBitField.Flags.Guilds
	]
});

client.commands = new Collection();

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
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`Nie znaleziono komendy: ${interaction.commandName}.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'Wystąpił błąd podczas wykonywania tej komendy.', ephemeral: true });
		} else {
			await interaction.reply({ content: 'Wystąpił błąd podczas wykonywania tej komendy.', ephemeral: true });
		}
	}
});

const activities = [
    { name: 'BOT maintained by Fafikk', type: ActivityType.Playing },
    { name: `${client.guilds.cache.size} serwerów`, type: ActivityType.Watching }
];

let currentActivityIndex = 0;

client.on('ready', () => {

    // Funkcja zmieniająca status co 10 sekund
    const updateActivity = () => {
        const activity = activities[currentActivityIndex];

        // Zaktualizuj nazwę aktywności typu Watching
        if (activity.type === ActivityType.Watching) {
            activity.name = `${client.guilds.cache.size} serwerów`;
        }

        client.user.setPresence({ activities: [activity], status: 'online' });
        currentActivityIndex = (currentActivityIndex + 1) % activities.length;
    };

    // Wywołaj funkcję updateActivity co 10 sekund
    setInterval(updateActivity, 5000);
});

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);