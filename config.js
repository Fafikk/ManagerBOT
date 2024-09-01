require('dotenv').config()

module.exports = {
    TOKEN: process.env.TOKEN,
    CLIENT_ID: process.env.CLIENT_ID,
    ticket_channel: process.env.ticket_channel,
    ticket_category: process.env.ticket_category,
    ticket_logs: process.env.ticket_logs,
    support_team: process.env.support_team,
}
