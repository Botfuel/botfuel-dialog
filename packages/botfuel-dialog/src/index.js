/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const ActionsMessage = require('./messages/actions-message');
const Adapter = require('./adapters/adapter');
const Bot = require('./bot');
const BotImageMessage = require('./messages/bot-image-message');
const BotTextMessage = require('./messages/bot-text-message');
const BotTableMessage = require('./messages/bot-table-message');
const BotfuelAdapter = require('./adapters/botfuel-adapter');
const BotfuelNlu = require('./nlus/botfuel-nlu');
const Brain = require('./brains/brain');
const Card = require('./messages/card');
const CardsMessage = require('./messages/cards-message');
const Classifier = require('./classifier');
const ConfirmationDialog = require('./dialogs/confirmation-dialog');
const ConfirmationView = require('./views/confirmation-view');
const CorpusExtractor = require('./extractors/corpus-extractor');
const Dialog = require('./dialogs/dialog');
const DialogManager = require('./dialog-manager');
const Extractor = require('./extractors/extractor');
const FileCorpus = require('./corpora/file-corpus');
const Link = require('./messages/link');
const Logger = require('logtown');
const MemoryBrain = require('./brains/memory-brain');
const MessengerAdapter = require('./adapters/messenger-adapter');
const MissingImplementationError = require('./errors/missing-implementation-error');
const MongoBrain = require('./brains/mongo-brain');
const Nlu = require('./nlus/nlu');
const Postback = require('./messages/postback');
const PostbackMessage = require('./messages/postback-message');
const PromptDialog = require('./dialogs/prompt-dialog');
const PromptView = require('./views/prompt-view');
const QnasView = require('./views/qnas-view');
const QuickrepliesMessage = require('./messages/quickreplies-message');
const RegexExtractor = require('./extractors/regex-extractor');
const ShellAdapter = require('./adapters/shell-adapter');
const TestAdapter = require('./adapters/test-adapter');
const TextDialog = require('./dialogs/text-dialog');
const TextView = require('./views/text-view');
const UserImageMessage = require('./messages/user-image-message');
const UserTextMessage = require('./messages/user-text-message');
const View = require('./views/view');
const WebAdapter = require('./adapters/web-adapter');
const WsExtractor = require('./extractors/ws-extractor');

module.exports = {
  ActionsMessage,
  Adapter,
  Bot,
  BotImageMessage,
  BotTableMessage,
  BotTextMessage,
  BotfuelAdapter,
  BotfuelNlu,
  Brain,
  Card,
  CardsMessage,
  Classifier,
  ConfirmationDialog,
  ConfirmationView,
  CorpusExtractor,
  Dialog,
  DialogManager,
  Extractor,
  FileCorpus,
  Link,
  Logger: Logger.getLogger,
  MemoryBrain,
  MessengerAdapter,
  MissingImplementationError,
  MongoBrain,
  Nlu,
  Postback,
  PostbackMessage,
  PromptDialog,
  PromptView,
  QnasView,
  QuickrepliesMessage,
  RegexExtractor,
  ShellAdapter,
  TestAdapter,
  TextDialog,
  TextView,
  UserImageMessage,
  UserTextMessage,
  View,
  WebAdapter,
  WsExtractor,
};
