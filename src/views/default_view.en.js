const TextView = require('./text_view');

class DefaultView extends TextView {
  getText() {
    return 'Not understood.';
  }
}

module.exports = DefaultView;
