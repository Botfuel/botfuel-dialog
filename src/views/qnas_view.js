const TextView = require('./text_view');

class QnasView extends TextView {
  getText(parameters) {
    return parameters.answer;
  }
}

module.exports = QnasView;
