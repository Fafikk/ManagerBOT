import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'

export default {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Usuwa wiadomości z kanału.')
        .addIntegerOption((option) =>
            option
                .setName('amount')
                .setDescription('Ilość wiadomości do usunięcia')
                .setMinValue(5)
                .setMaxValue(100),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false),

    async execute(interaction) {
        const { options, channel } = interaction
        const amountMessagesToDelete = options.getInteger('amount') ?? 5

        await interaction.reply({
            content: `Rozpoczynam usuwanie **${amountMessagesToDelete}** wiadomości.`,
            ephemeral: true,
        })

        const messages = await channel.bulkDelete(amountMessagesToDelete, true)

        await interaction
            .editReply(`Usunięto **${messages.size}** wiadomości.`)
            .catch(console.error)
    },
}
