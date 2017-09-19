const WebAdapter = require('./web_adapter');
const Messages = require('../messages');
const express = require('express');
const rp = require('request-promise');
const bodyParser = require('body-parser');

const WEBCHAT_SERVER = 'https://botfuel-webchat-server.herokuapp.com';
const WEBHOOK = '/botfuel';

class BotfuelAdapter extends WebAdapter {
 async handleMessage(req, res) {
    console.log('BotfuelAdapter.handleMessage');
    const payload = req.body;
    console.log('BotfuelAdapter.handleMessage: payload', payload);
    const userId = payload.appUser._id;
    await this.bot.brain.initUserIfNecessary(userId);
    // if text message
    const message = payload.messages[0].text;
    const userMessage = Messages.getUserTextMessage(this.config.id, userId, message);
    this.bot.sendResponse(userMessage);
    res.sendStatus(200);
  }

  getUrl(botMessage) {
    return `${CHAT_SERVER}/bots/${this.config.id}/users/${botMessage.userId}/conversation/messages`;
  }

  async sendText(botMessage) {
    console.log('BotfuelAdapter.sendText', botMessage);
    const body = {
      type: 'text',
      text: botMessage.payload,
    };
    const url = getUrl(botMessage);
    postResponse({ uri: url }, body);
  }
}

module.exports = BotfuelAdapter;
