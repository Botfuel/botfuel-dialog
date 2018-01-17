const { TextView } = require('botfuel-dialog');

class OnboardingView extends TextView {
  getTexts() {
    return ['How can I help you?'];
  }
}

module.exports = OnboardingView;
