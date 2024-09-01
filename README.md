# ManagerBOT

`ManagerBOT` is a free, self-hosted, open source Discord bot, written using discord.js v14, that may help You manage your Discord server.

# Commands

-   `/ping`: Display the bot's current latency.
-   `/help`: Show a list of available bot commands and their descriptions.
-   `/serverinfo`: Provide detailed information about the current Discord server.
-   `/botinfo`: Display information about the bot, including version and uptime.
-   `/userinfo`: Show details about a specified user or the command issuer.
-   `/embed`: (Admin only) Create and send a custom embed message.
-   `/maintenance`: (Admin only) Enable maintenance mode, restricting bot access.
-   `/clear`: Remove a specified number of recent messages from the channel.
-   `/online`: Disable maintenance mode and resume normal bot operations.
-   `/status`: Check the current status of services and features.

# Required dependencies

-   Node.js (v18 or higher)
-   NPM (v10 or higher)
-   Discord.js v14

# Installation

1. Clone the git repository

```git
git clone https://github.com/Fafikk/ManagerBOT.git
```

2. Install node dependencies

```bash
npm install
```

3. Copy environment file

```bash
cp .env.example .env
```

4. Replace `TOKEN` and `CLIENT_ID` in `.env` with you application token and client ID from [Discord Developer Portal](https://discord.com/developers/applications).
5. Deploy slash commands to Your bot.

```bash
node deploy.js
```

6. Start the bot:

```bash
node index.js
```
