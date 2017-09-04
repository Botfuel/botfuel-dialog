/**
 * Adapter main class.
 */
class Adapter {
  getId(message) {
    return message.id;
  }

  getText(message) {
    return message.text;
  }

  send(response) {
    console.log('Adapter.send', response);
    // when text (TODO: fix this)
    console.log(response.payload);
  }
}

module.exports = Adapter;
