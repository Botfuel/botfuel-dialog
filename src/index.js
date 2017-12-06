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
const CommonView = require('./views/common-view');
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
  CommonView,
  WsExtractor,
};
