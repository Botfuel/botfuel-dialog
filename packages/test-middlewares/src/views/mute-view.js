const { TextView } = require('botfuel-dialog');

class MuteView extends TextView {
  getTexts() {
    return ['Muted!'];
  }
}

module.exports = MuteView;
