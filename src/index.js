const Bot = require('./bot');
const Classifier = require('./classifier');
const CorpusExtractor = require('./extractors/corpus_extractor');
const Dialog = require('./dialogs/dialog');
const DialogManager = require('./dialog_manager');
const FileCorpus = require('./corpora/file_corpus');
const MemoryBrain = require('./brains/memory_brain');
const Messages = require('./messages');
const MongoBrain = require('./brains/mongo_brain');
const Nlu = require('./nlu');
const PromptDialog = require('./dialogs/prompt_dialog');
const PromptView = require('./views/prompt_view');
const TextDialog = require('./dialogs/text_dialog');
const TextView = require('./views/text_view');
const WsExtractor = require('./extractors/ws_extractor');

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
