const ActionsMessage = require('./views/parts/actions_message');
const Bot = require('./bot');
const BotTextMessage = require('./views/parts/bot_text_message');
const Card = require('./views/parts/card');
const CardsMessage = require('./views/parts/cards_message');
const Classifier = require('./classifier');
const CorpusExtractor = require('./extractors/corpus_extractor');
const Dialog = require('./dialogs/dialog');
const DialogManager = require('./dialog_manager');
const Link = require('./views/parts/link');
const MemoryBrain = require('./brains/memory_brain');
const MongoBrain = require('./brains/mongo_brain');
const Nlu = require('./nlu');
const Postback = require('./views/parts/postback');
const PostbackMessage = require('./views/parts/postback_message');
const PromptDialog = require('./dialogs/prompt_dialog');
const QuickrepliesMessage = require('./views/parts/quickreplies_message');
const TextDialog = require('./dialogs/text_dialog');
const UserTextMessage = require('./views/parts/user_text_message');
const WsExtractor = require('./extractors/ws_extractor');
const FileCorpus = require('./corpora/file_corpus');

module.exports = {
  ActionsMessage,
  Bot,
  BotTextMessage,
  Card,
  CardsMessage,
  Classifier,
  CorpusExtractor,
  Dialog,
  DialogManager,
  Link,
  MemoryBrain,
  MongoBrain,
  Nlu,
  Postback,
  PostbackMessage,
  PromptDialog,
  QuickrepliesMessage,
  TextDialog,
  UserTextMessage,
  WsExtractor,
  FileCorpus,
};
