const Brain = require('./brains/brain');
const DialogManager = require('./dialog_manager');
const Nlu = require('./nlu');
const MemoryBrain = require('./brains/memory_brain');
// const MongoBrain = require('./brains/mongo_brain');
const Bot = require('./bot');
const Dialog = require('./dialogs/dialog');
const PromptDialog = require('./dialogs/prompt_dialog');
const Train = require('./train');

module.exports = {
  Bot,
  Brain,
  MemoryBrain,
  // MongoBrain,
  Nlu,
  DialogManager,
  Dialog,
  PromptDialog,
  Train,
};
