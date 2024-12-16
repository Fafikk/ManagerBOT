// Import required modules
const { REST, Routes } = require('discord.js')
const fs = require('node:fs')
const path = require('node:path')
const { TOKEN, CLIENT_ID } = require('../config.js')

class CommandHandler {
  constructor(client) {
    this.client = client
    this.commands = []
  }

  async loadCommands() {
    // Path to commands directory
    const commandsPath = path.join(__dirname, '..', 'commands')
    const commandFolders = fs.readdirSync(commandsPath)

    for (const folder of commandFolders) {
      const folderPath = path.join(commandsPath, folder)
      const commandFiles = fs
        .readdirSync(folderPath)
        .filter((file) => file.endsWith('.js'))

      const category = folder.charAt(0).toUpperCase() + folder.slice(1)

      for (const file of commandFiles) {
        const filePath = path.join(folderPath, file)
        const command = require(filePath)

        if ('data' in command && 'execute' in command) {
          command.category = category
          this.commands.push(command)
          this.client.commands.set(command.data.name, command)
          console.log(
            `[INFO] Loaded command: ${command.data.name} (${category})`,
          )
        }
      }
    }
  }

  async registerCommands() {
    const rest = new REST().setToken(TOKEN)

    try {
      console.log('[INFO] Started refreshing application commands...')

      await rest.put(Routes.applicationCommands(CLIENT_ID), {
        body: this.commands.map((cmd) => cmd.data.toJSON()),
      })

      console.log(
        `[SUCCESS] Successfully registered ${this.commands.length} commands!`,
      )
    } catch (error) {
      console.error('[ERROR] Failed to register commands:', error)
    }
  }

  async init() {
    await this.loadCommands()
    await this.registerCommands()
  }
}

module.exports = (client) => {
  const handler = new CommandHandler(client)
  handler.init()
}
