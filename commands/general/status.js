const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const net = require('net')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Umożliwia sprawdzenie statusu serwerów'),

    async execute(interaction) {
        function check_minecraft() {
            return new Promise((resolve, reject) => {
                const ip = ''
                const port = 25565

                const socket = new net.Socket()
                const startTime = Date.now()

                socket.setTimeout(2500)

                socket.on('connect', () => {
                    const endTime = Date.now()
                    const responseTime = endTime - startTime
                    socket.destroy()
                    resolve(responseTime)
                })

                socket.on('timeout', () => {
                    socket.destroy()
                    reject(new Error('timeout'))
                })

                socket.on('error', (err) => {
                    reject(err)
                })

                socket.connect(port, ip)
            })
        }

        function check_site() {
            return new Promise((resolve, reject) => {
                const ip = ''
                const port = 80

                const socket = new net.Socket()
                const startTime = Date.now()

                socket.setTimeout(2500)

                socket.on('connect', () => {
                    const endTime = Date.now()
                    const responseTime = endTime - startTime
                    socket.destroy()
                    resolve(responseTime)
                })

                socket.on('timeout', () => {
                    socket.destroy()
                    reject(new Error('timeout'))
                })

                socket.on('error', (err) => {
                    reject(err)
                })

                socket.connect(port, ip)
            })
        }

        let desc = ''
        let color

        try {
            const responseTime = await check_site()
            desc = `Strona internetowa: :white_check_mark: - ${responseTime} ms \n`
            color = 0x00ff00
        } catch (error) {
            desc = 'Strona internetowa: :x: - Przekroczono czas oczekiwania. \n'
            color = 0xff0000
        }

        try {
            const responseTime = await check_minecraft()
            desc += `Minecraft: :white_check_mark: - ${responseTime} ms`
            color = 0x00ff00
        } catch (error) {
            desc += 'Minecraft: :x: - Przekroczono czas oczekiwania.'
            color = 0xff0000
        }

        const embed = new EmbedBuilder()
            .setTitle('Status serwerów')
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(desc)
            .setTimestamp()
            .setColor(color)

        await interaction.reply({ embeds: [embed] })
    },
}
