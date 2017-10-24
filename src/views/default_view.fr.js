const TextView = require('./text_view');

class DefaultView extends TextView {
  getText() {
    return 'Je n\'ai pas compris.';
  }
}

module.exports = DefaultView;
