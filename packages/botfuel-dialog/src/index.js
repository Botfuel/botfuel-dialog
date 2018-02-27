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

const Logger = require('logtown');
const Bot = require('./bot');
const Classifier = require('./classifier');
const Adapter = require('./adapters/adapter');
const BotfuelAdapter = require('./adapters/botfuel-adapter');
const MessengerAdapter = require('./adapters/messenger-adapter');
const ShellAdapter = require('./adapters/shell-adapter');
const TestAdapter = require('./adapters/test-adapter');
const WebAdapter = require('./adapters/web-adapter');
const ConfirmationDialog = require('./dialogs/confirmation-dialog');
const ConfirmationView = require('./views/confirmation-view');
const CorpusExtractor = require('./extractors/corpus-extractor');
const Dialog = require('./dialogs/dialog');
const DialogManager = require('./dialog-manager');
const FileCorpus = require('./corpora/file-corpus');
const Brain = require('./brains/brain');
const MemoryBrain = require('./brains/memory-brain');
const MongoBrain = require('./brains/mongo-brain');
const Nlu = require('./nlus/nlu');
const BotfuelNlu = require('./nlus/botfuel-nlu');
const PromptDialog = require('./dialogs/prompt-dialog');
const PromptView = require('./views/prompt-view');
const TextDialog = require('./dialogs/text-dialog');
const TextView = require('./views/text-view');
const View = require('./views/view');
const WsExtractor = require('./extractors/ws-extractor');
const Link = require('./messages/link');
const ActionsMessage = require('./messages/actions-message');
const BotTextMessage = require('./messages/bot-text-message');
const BotImageMessage = require('./messages/bot-image-message');
const Card = require('./messages/card');
const CardsMessage = require('./messages/cards-message');
const Postback = require('./messages/postback');
const PostbackMessage = require('./messages/postback-message');
const QuickrepliesMessage = require('./messages/quickreplies-message');
const UserImageMessage = require('./messages/user-image-message');
const UserTextMessage = require('./messages/user-text-message');
const QnasView = require('./views/qnas-view');

module.exports = {
  Logger: Logger.getLogger,
  Bot,
  BotfuelNlu,
  Brain,
  Classifier,
  Adapter,
  BotfuelAdapter,
  MessengerAdapter,
  ShellAdapter,
  TestAdapter,
  WebAdapter,
  ConfirmationDialog,
  ConfirmationView,
  CorpusExtractor,
  Dialog,
  DialogManager,
  FileCorpus,
  MemoryBrain,
  MongoBrain,
  Nlu,
  PromptDialog,
  PromptView,
  TextDialog,
  TextView,
  View,
  WsExtractor,
  Link,
  ActionsMessage,
  BotTextMessage,
  BotImageMessage,
  Card,
  CardsMessage,
  Postback,
  PostbackMessage,
  QuickrepliesMessage,
  UserImageMessage,
  UserTextMessage,
  QnasView,
};
