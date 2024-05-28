const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Odpowada z użyciem pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};