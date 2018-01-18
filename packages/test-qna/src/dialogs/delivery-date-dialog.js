const { TextDialog } = require('botfuel-dialog');

class DeliveryDateDialog extends TextDialog {
  async dialogWillDisplay() {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return { date };
  }
}

module.exports = DeliveryDateDialog;
