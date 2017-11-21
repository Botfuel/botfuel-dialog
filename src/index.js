const Bot = require('./bot');
const Classifier = require('./classifier');
const CorpusExtractor = require('./extractors/corpus-extractor');
const Dialog = require('./dialogs/dialog');
const DialogManager = require('./dialog-manager');
const FileCorpus = require('./corpora/file-corpus');
const MemoryBrain = require('./brains/memory-brain');
const Messages = require('./messages');
const MongoBrain = require('./brains/mongo-brain');
const Nlu = require('./nlu');
const PromptDialog = require('./dialogs/prompt-dialog');
const PromptView = require('./views/prompt-view');
const TextDialog = require('./dialogs/text-dialog');
const TextView = require('./views/text-view');
const WsExtractor = require('./extractors/ws-extractor');

module.exports = {
  Bot,
  Classifier,
  CorpusExtractor,
  Dialog,
  DialogManager,
  FileCorpus,
  MemoryBrain,
  Messages,
  MongoBrain,
  Nlu,
  PromptDialog,
  PromptView,
  TextDialog,
  TextView,
  WsExtractor,
};
