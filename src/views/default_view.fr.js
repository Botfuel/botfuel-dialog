const TextView = require('./text_view');

class DefaultView extends TextView {
  getTexts() {
    return ['Je n\'ai pas compris.'];
  }
}

module.exports = DefaultView;
