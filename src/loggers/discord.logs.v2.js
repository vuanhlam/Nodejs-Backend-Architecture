"use strict";

const { Client, GatewayIntentBits } = require('discord.js');
const e = require('express');
const { CHANNELID_DISCORD, TOKENDISCORD } = process.env

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    // add channelId or serverId
    this.channelId = CHANNELID_DISCORD

    this.client.on("ready", () => {
      console.log(`Logged is as ${this.client.user.tag}`);  
    });

    this.client.login(TOKENDISCORD);
  }


  sendToFormatCode(logData) {
    const { code, message = 'This is some additional information about the code.', title = 'Code Example' } = logData;
    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt('00ff00', 16), // Convert hexadevimal color code to integer
          title,
          description: '```json\n' + JSON.stringify(code, null, 2) + '\n```'
        }
      ]
    }
    this.sendToMessage(codeMessage)
  }

  sendToMessage(message = 'message') {
    const channel = this.client.channels.cache.get(this.channelId)
    if(!channel) {
        console.log(`Could not find channel with ID ${this.channelId} to send message`);
        return;
    }
    channel.send(message).catch(err => {
        console.error(err)
    })
  }
}

// const loggerService = new LoggerService()

module.exports = new LoggerService() // loggerService
