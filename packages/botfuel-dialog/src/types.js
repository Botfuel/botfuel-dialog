// @flow

import type ClassificationResult from './nlus/classification-result';


/*
  Data used in the dialogs
*/

export type MessageEntities = {};

export type DialogDataData = {
  classificationResults?: ClassificationResult[],
  messageEntities?: MessageEntities,
  answers?: {},
  url?: string,
};


export type DialogData = {
  name: string,
  data: DialogDataData,
  characteristics?: {
    reentrant: boolean,
  },
  date?: number,
  blocked?: boolean,
};

export type DialogsData = {
  stack: DialogData[],
  previous: DialogData[],
  isNewConversation?: boolean,
};

export type ConversationData = {
  _dialogs: DialogsData,
  _createdAt: number,
  uuid: string,
};

export type UserData = {
  _userId: string,
  _conversations: ConversationData[],
  _createdAt: number,
};


export type DialogWillDisplayData = {
};

export type DialogWillCompleteData = {
};


/*
  Message types
*/

export type PostbackMessage = {
  type: 'postback',
  user: string,
  payload: {
    value: {
      dialog: string,
      entities: MessageEntities,
    },
  },
  id?: string,
  timestamp?: number,
};

export type ImageMessage = {
  type: 'image',
  user: string,
  payload: {
    value: string,
  },
  id?: string,
  timestamp?: number,
};

export type TextMessage = {
  type: 'text',
  user: string,
  payload: {
    value: string,
  },
  id?: string,
  timestamp?: number,
};

export type UserMessage = PostbackMessage | ImageMessage | TextMessage;


export type BotMessage = {
  id?: string,
  timestamp?: number,
};
