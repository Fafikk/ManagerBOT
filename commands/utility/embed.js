const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Tworzy embed z treścią wpisaną przez użytkownika')
        .addStringOption(option =>
            option.setName('treść')
                .setDescription('Treść embedu')
                .setRequired(true)),

    async execute(interaction) {
        const tresc = interaction.options.getString('treść');

        const random1 = Math.floor(Math.random() * 255);
        const random2 = Math.floor(Math.random() * 255);
        const random3 = Math.floor(Math.random() * 255);

        const embed = new EmbedBuilder()
            .setTitle('Custom embed')
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(tresc)
            .setTimestamp()
            .setColor([random1, random2, random3]);

        await interaction.reply({ embeds: [embed] });
    }
}