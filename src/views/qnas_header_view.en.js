const TextView = require('./text_view');

class QnasHeaderView extends TextView {
  getText() {
    return 'What do you mean?';
  }
}

module.exports = QnasHeaderView;
