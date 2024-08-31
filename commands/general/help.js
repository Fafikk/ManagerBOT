const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Pokazuje listę dostępnych komend.'),
    async execute(interaction) {
        const random1 = Math.floor(Math.random() * 255)
        const random2 = Math.floor(Math.random() * 255)
        const random3 = Math.floor(Math.random() * 255)

        const embed = new EmbedBuilder()
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTitle('Dostępne komendy')
            .setDescription('**Ogólne:**```/help, /embed, /ping, /status```')
            .setTimestamp()
            .setColor([random1, random2, random3])

        await interaction.reply({ embeds: [embed] })
    },
}
