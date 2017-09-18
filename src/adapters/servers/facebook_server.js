const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');

const server = express();

const VERIFY_TOKEN = 'BotSDK2Sample';
const PAGE_ACCESS_TOKEN = 'EAAEBdpxs1WkBALtbvWqCwupvQZCAfRvxZBDtZBvCW96gkMAS110MfoGHCDxV4sRKSN8hl34pkSAG97vMMI0NZBAW8VZAZC5LJAZB5wB7SCBhBm7dGynZC0Jl4DvykWrXqKc7W4KRKv4iTZBvoV7IyeAtpdZCZAGiZAhKcQZB2qHdKBUL6lQZDZD';

server.use(bodyParser.json());
server.use(express.static('public'));

const callSendAPI = (messageData) => {
  console.log('callSendAPI', messageData);
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData,
  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const recipientId = body.recipient_id;
      const messageId = body.message_id;
      console.log(`Successfully sent generic message with id ${messageId} to recipient ${recipientId}`);
    } else {
      console.error('Unable to send message.');
      console.error(response);
      console.error(error);
    }
  });
};

const sendTextMessage = (recipientId, messageText) => {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: messageText,
    },
  };
  callSendAPI(messageData);
};

// get messages
const receivedMessage = (event) => {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;
  const timeOfMessage = event.timestamp;
  const message = event.message;

  console.log(`Received message for user ${senderID} and page ${recipientID} at ${timeOfMessage} with message:`);
  console.log(JSON.stringify(message));

  const messageText = message.text;

  if (messageText) {
    sendTextMessage(senderID, messageText);
  }
};

// authentication
server.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VERIFY_TOKEN) {
    console.log('Validating webhook');
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error('Failed validation. Make sure the validation tokens match.');
    res.sendStatus(403);
  }
});

server.post('/webhook', (req, res) => {
  const data = req.body;
  // Make sure this is a page subscription
  if (data.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach((entry) => {
      // const pageID = entry.id;
      // const timeOfEvent = entry.time;
      console.log('data entry', entry);
      // Iterate over each messaging event
      entry.messaging.forEach((event) => {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log('Webhook received unknown event: ', event);
        }
      });
    });
    res.sendStatus(200);
  }
});

module.exports = { server, receivedMessage };
