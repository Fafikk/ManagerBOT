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
                .setName('reason')
                .setDescription('Powód maintenance`u')
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName('end')
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

        const reason = interaction.options.getString('reason')
        const end = interaction.options.getString('end')

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
