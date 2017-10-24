const TextView = require('./text_view');

class QnasHeaderView extends TextView {
  getText() {
    return 'Que voulez vous dire?';
  }
}

module.exports = QnasHeaderView;
