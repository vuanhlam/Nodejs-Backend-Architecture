'use strict'

const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
    intents: [ // option cho version 14 cấp quyền cho client hoạt động theo ý muốn chúng ta
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

client.on('ready', () => {
    console.log(`Logged is as ${client.user.tag}`);
})

const token = 'MTE5NzM0OTI4MzE5NjgzMzkxMg.GErN35.iwv5wkoEm19Mbc71-UDCTrJLNY3jVIU4M9YvhM'
client.login(token)

client.on('messageCreate', msg => {
    if(msg.author.bot) return
    if(msg.content === 'hello') {
        msg.reply(`hello! how can i assist you?`)
    }
})