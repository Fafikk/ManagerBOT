const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('maintenance')
        .setDescription('Tworzy embed z powodem maintenance`u')
        .addStringOption(option =>
            option.setName('treść')
                .setDescription('Powód maintenance`u')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('koniec')
                .setDescription('Planowany koniec przerwy technicznej')
                .setRequired(true)),

    async execute(interaction) {
        const allowedUserId = '1050456185637179412';

        if(interaction.user.id !== allowedUserId){
            return interaction.reply({ content: 'Nie masz uprawnień do użycia tej komendy.', ephemeral: true });
        }

        const tresc = interaction.options.getString('treść');
        const koniec = interaction.options.getString('koniec');

        const embed = new EmbedBuilder()
            .setTitle('Przerwa techniczna!')
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .addFields(
                { name: 'Powód przerwy technicznej', value: tresc },
                { name: 'Planowany koniec przerwy technicznej', value: koniec},
            )
            .setTimestamp()
            .setColor([255, 0, 0]);

        await interaction.reply({ embeds: [embed] });
    }
}