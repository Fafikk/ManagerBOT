const { readdirSync } = require("fs");

module.exports = (client) => {
  const loadEvents = (dir = "./events/") => {
    readdirSync(dir).forEach((dirs) => {
      const events = readdirSync(`${dir}/${dirs}`).filter((files) =>
        files.endsWith(".js")
      );

      for (const file of events) {
        const event = require(`../${dir}/${dirs}/${file}`);
        client.on(event.name, (...args) => event.execute(...args, client));
        console.log(
          `[EVENTS]`.bold.red +
            ` Loading event :`.bold.white +
            ` ${event.name}`.bold.red
        );
      }
    });
  };

  loadEvents();
  console.log(`•----------•`.bold.black);
};
