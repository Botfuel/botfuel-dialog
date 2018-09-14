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
const BaseDialog = require('./dialogs/base-dialog');
const Bot = require('./bot');
const BotImageMessage = require('./messages/bot-image-message');
const BotTextMessage = require('./messages/bot-text-message');
const BotTableMessage = require('./messages/bot-table-message');
const BotfuelAdapter = require('./adapters/botfuel-adapter');
const BotfuelNlu = require('./nlus/botfuel-nlu');
const Brain = require('./brains/brain');
const CancellationDialog = require('./dialogs/cancellation-dialog');
const Card = require('./messages/card');
const CardsMessage = require('./messages/cards-message');
const ClassificationResult = require('./nlus/classification-result');
const Config = require('./config');
const ConfirmationDialog = require('./dialogs/confirmation-dialog');
const ConfirmationView = require('./views/confirmation-view');
const CorpusExtractor = require('./extractors/corpus-extractor');
const Dialog = require('./dialogs/dialog');
const DialogManager = require('./dialog-manager');
const Extractor = require('./extractors/extractor');
const FileCorpus = require('./corpora/file-corpus');
const Link = require('./messages/link');
const Logger = require('logtown'); // eslint-disable-line
const MemoryBrain = require('./brains/memory-brain');
const Message = require('./messages/message');
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
const SdkError = require('./errors/sdk-error');
const ShellAdapter = require('./adapters/shell-adapter');
const TestAdapter = require('./adapters/test-adapter');
const UserImageMessage = require('./messages/user-image-message');
const UserFileMessage = require('./messages/user-file-message');
const UserTextMessage = require('./messages/user-text-message');
const View = require('./views/view');
const WebAdapter = require('./adapters/web-adapter');
const WsExtractor = require('./extractors/ws-extractor');

module.exports = {
  ActionsMessage,
  Adapter,
  BaseDialog,
  Bot,
  BotImageMessage,
  BotTableMessage,
  BotTextMessage,
  BotfuelAdapter,
  BotfuelNlu,
  Brain,
  CancellationDialog,
  Card,
  CardsMessage,
  ClassificationResult,
  Config,
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
  Message,
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
  SdkError,
  ShellAdapter,
  TestAdapter,
  UserImageMessage,
  UserTextMessage,
  UserFileMessage,
  View,
  WebAdapter,
  WsExtractor,
};
