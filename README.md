# ManagerBOT
`ManagerBOT` is a free, self-hosted, open source discord bot, written using discord.js v14, that may help You manage your discord server.

# Features
comming soon

# Required dependencies
- Node.js (v18 or higher)
- NPM (v10 or higher)
- Discord.js v14

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
4. Replace `TOKEN="123"` and `CLIENT_ID=123` in `.env` with you application token and client ID from [Discord Developer Portal](https://discord.com/developers/applications).
5. Deploy slash commands to Your bot.
```bash
node deploy.js
```
6. Start the bot:
```bash
node .
```