const { ConfirmationView } = require('botfuel-dialog');

class CarConfirmationView extends ConfirmationView {
  constructor() {
    super({
      dialogQuestion: 'Do you still want to purchase a car?',
      dialogConfirmed: 'You still want to purchase a car.',
      dialogDiscarded: 'You don’t want to purchase a car anymore.',
    });
  }
}

module.exports = CarConfirmationView;
