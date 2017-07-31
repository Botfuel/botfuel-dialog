const Bot = require('./src/bot');
const DialogManager = require('./src/dialog_manager');
const Dialog = require('./src/dialogs/dialog');
const PromptDialog = require('./src/dialogs/prompt_dialog');
const Entities = require('./src/entities');
const Features = require('./src/features');
const Nlu = require('./src/nlu');
const Train = require('./src/train');

module.exports = {
  Bot: Bot,
  DialogManager: DialogManager,
  Dialog: Dialog,
  PromptDialog: PromptDialog,
  Entities: Entities,
  Features: Features,
  Nlu: Nlu,
  Train: Train
};
