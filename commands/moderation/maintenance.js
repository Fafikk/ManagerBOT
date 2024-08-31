const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionsBitField,
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('maintenance')
        .setDescription('Tworzy embed z powodem maintenance`u')
        .addStringOption((option) =>
            option
                .setName('treść')
                .setDescription('Powód maintenance`u')
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName('koniec')
                .setDescription('Planowany koniec przerwy technicznej')
                .setRequired(true),
        ),

    async execute(interaction) {
        if (
            !interaction.member.permissions.has(
                PermissionsBitField.Flags.Administrator,
            )
        ) {
            return interaction.reply({
                content:
                    'Nie masz uprawnień do użycia tej komendy (wymagane: **Administrator**).',
                ephemeral: true,
            })
        }

        const reason = interaction.options.getString('treść')
        const end = interaction.options.getString('koniec')

        const embed = new EmbedBuilder()
            .setTitle('Przerwa techniczna!')
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .addFields(
                { name: 'Powód przerwy technicznej', value: reason },
                { name: 'Planowany koniec przerwy technicznej', value: end },
            )
            .setTimestamp()
            .setColor([255, 0, 0])

        await interaction.reply({ embeds: [embed] })
    },
}
