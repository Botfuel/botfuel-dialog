const Adapter = require('./adapter');
const Messages = require('../messages');
const express = require('express');

class BotfuelAdapter extends Adapter {
  async run() {
    console.log('BotfuelAdapter.run');
    const app = express();
    app.post('/botfuel', (req, res) => {
      const payload = req.body;
      const userId = payload.appUser._id;
      const message = payload.messages[0];
      const userMessage = Messages.getUserTextMessage(this.config.id, userId, message);
      this.bot.sendResponse(userMessage);
      res.send(200);
    });
    app.listen(5000, () => console.log('Example app listening on port 5000!'));
  }

  async send(botMessages) {
    console.log('BotfuelAdapter.send', botMessages);
    for (const botMessage of botMessages) {
      // TODO: adapt to message type
      await sendText(botMessage);
    }
  }

  async sendText(botMessage) {
    console.log('BotfuelAdapter.sendText', botMessage);
    // data = JSON.stringify(data)
    // console.log("_sendPayload(#{userId}, #{data})")
    // url = @smoochEndpoint + "/#{ userId }/conversation/messages"
    // console.log("sendPayLoad: #{ url }")
    // console.log("sendPayLoad: #{ @jwt }")
    // @robot.http(url)
    // .header('Content-Type', "application/json")
    // .header('Authorization', "Bearer #{ @jwt }")
    // .post(data) (error, response, body) ->
    //   if error
    //     LOGGER.error("error sending message: #{error}")
    //   unless response.statusCode in [200, 201]
    //     LOGGER.error("send request returned status #{ response.statusCode }")
    //     LOGGER.error("send request returned body #{ body }")
  }
}

module.exports = BotfuelAdapter;
