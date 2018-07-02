// @flow

import type ClassificationResult, { QnaAnswers } from './nlus/classification-result';

/*
  Data used in the dialogs
*/

export type MessageEntities = { dim: string }[];

export type DialogDataData = {
  classificationResults?: ClassificationResult[],
  messageEntities?: MessageEntities,
  answers?: QnaAnswers,
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


/*
  Message types
*/

export type PostbackMessage = {
  type: 'postback',
  user: string,
  payload: {
    value: {
      dialog: string,
      dataDialog: DialogData,
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
