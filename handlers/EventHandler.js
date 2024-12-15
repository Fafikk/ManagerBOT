const fs = require("node:fs");
const path = require("node:path");

class EventHandler {
  constructor(client) {
    this.client = client;
  }

  async loadEvents() {
    const eventsPath = path.join(__dirname, "..", "events");
    const eventFolders = fs.readdirSync(eventsPath);

    for (const folder of eventFolders) {
      const folderPath = path.join(eventsPath, folder);
      const eventFiles = fs
        .readdirSync(folderPath)
        .filter((file) => file.endsWith(".js"));

      for (const file of eventFiles) {
        const filePath = path.join(folderPath, file);
        const event = require(filePath);

        if (event.once) {
          this.client.once(event.name, (...args) =>
            event.execute(...args, this.client)
          );
        } else {
          this.client.on(event.name, (...args) =>
            event.execute(...args, this.client)
          );
        }

        console.log(`[INFO] Loaded event: ${event.name}`);
      }
    }
  }

  async init() {
    await this.loadEvents();
  }
}

module.exports = (client) => {
  const handler = new EventHandler(client);
  handler.init();
};
