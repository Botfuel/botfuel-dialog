const TextView = require('./text_view');

class DefaultView extends TextView {
  getText() {
    return 'DefaultView text';
  }
}

module.exports = DefaultView;
