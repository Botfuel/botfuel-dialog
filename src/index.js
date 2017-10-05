const Bot = require('./bot');
const Classifier = require('./classifier');
const CorpusExtractor = require('./extractors/corpus_extractor');
const Dialog = require('./dialogs/dialog');
const DialogManager = require('./dialog_manager');
const MemoryBrain = require('./brains/memory_brain');
const MongoBrain = require('./brains/mongo_brain');
const Messages = require('./messages');
const Nlu = require('./nlu');
const PromptDialog = require('./dialogs/prompt_dialog');
const TextDialog = require('./dialogs/text_dialog');
const WsExtractor = require('./extractors/ws_extractor');

module.exports = {
  Bot,
  Classifier,
  CorpusExtractor,
  Dialog,
  DialogManager,
  MemoryBrain,
  MongoBrain,
  Messages,
  Nlu,
  PromptDialog,
  TextDialog,
  WsExtractor,
};
