const PromptDialog = require('./prompt_dialog');

class IntentConfirmationDialog extends PromptDialog {
  constructor(config, brain, dialogLabel) {
    const entities = {};
    entities[dialogLabel] = null;
    super(config, brain, { entities });
    this.brain = brain;
    this.dialogLabel = dialogLabel;
  }


}

module.exports = IntentConfirmationDialog;
