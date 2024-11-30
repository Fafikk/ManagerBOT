# ManagerBOT

`ManagerBOT` is a free, self-hosted, open source Discord bot, written using discord.js v14, that may help You manage your Discord server.

# Features
- General commands
- Moderation
- Tickets

# Commands

- `/ping`: Display the bot's current latency.
- `/help`: Show a list of available bot commands and their descriptions.
- `/serverinfo`: Provide detailed information about the current Discord server.
- `/botinfo`: Display information about the bot, including version and uptime.
- `/userinfo`: Show details about a specified user or the command issuer.
- `/embed`: (Admin only) Create and send a custom embed message.
- `/maintenance`: (Admin only) Enable maintenance mode, restricting bot access.
- `/clear`: (Admin only) Remove a specified number of recent messages from the channel.
- `/online`: (Admin only) Disable maintenance mode and resume normal operations.
- `/status`: Check the current status of services and features.

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

4. Replace values in `.env`:
- `TOKEN` with you application token from [Discord Developer Portal](https://discord.com/developers/applications),
- `CLIENT_ID` with you client ID from [Discord Developer Portal](https://discord.com/developers/applications),
- `ticket_channel` with channel ID where you want to have message with button, that create's ticket,
- `ticket_category` with category ID where you want to have open ticket as channels,
- `ticket_logs` with channel ID where you want to save logs, after closing ticket,
- `support_team` with role ID that the administrators in charge of the tickets have,
- `blacklist_role` with role ID that the blacklisted users have.

5. Deploy slash commands to Your bot
```bash
node deploy.js
```

6. Start the bot
```bash
node index.js
```

# Copyright
The ticket system has been taken from [github.com/t3mq/Ticket-Bot-V14](https://github.com/t3mq/Ticket-Bot-V14)
