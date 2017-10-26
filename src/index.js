const Bot = require('./bot');
const Classifier = require('./classifier');
const CorpusExtractor = require('./extractors/corpus_extractor');
const FileCorpus = require('./corpora/file_corpus');
const Dialog = require('./dialogs/dialog');
const DialogManager = require('./dialog_manager');
const MemoryBrain = require('./brains/memory_brain');
const MongoBrain = require('./brains/mongo_brain');
const Nlu = require('./nlu');
const PromptDialog = require('./dialogs/prompt_dialog');
const TextDialog = require('./dialogs/text_dialog');
const WsExtractor = require('./extractors/ws_extractor');
const PromptView = require('./views/prompt_view');
const TextView = require('./views/text_view');
const Messages = require('./messages');

module.exports = {
  Bot,
  Classifier,
  CorpusExtractor,
  FileCorpus,
  Dialog,
  DialogManager,
  MemoryBrain,
  MongoBrain,
  Nlu,
  PromptDialog,
  TextDialog,
  WsExtractor,
  PromptView,
  TextView,
  Messages,
};
