# Concepts

This document explains how a bot works and what the underlying concepts are.

The purpose of a bot is to exchange messages with a user.
A bot is thus composed of differents components:
- a nlu (Natural Language Understanding) component, it is used to process user text messages,
- a dialog manager, it decides which dialogs to call,
- a brain, it stores things,
- adapters, they adapt the messages to the messaging platform,
- dialogs, they interact with the brain and the views
- views, they generate the messages,
- extractors, they extract entities from user sentences.

Let's see how these components interact with a sequence diagram:

```
                 Adapter        Bot          Nlu       Extractor  DialogManager    Brain       Dialog        View
                 -------        ---          ---       ---------  -------------    -----       ------        ----
                    |            |            |            |            |            |            |            |
                    | ---------> |            |            |            |            |            |            |
                    |            | ---------> |            |            |            |            |            |
                    |            |            | ---------> |            |            |            |            |
                    |            |            | <--------- |            |            |            |            |
                    |            | <--------- |            |            |            |            |            |
                    |            | -----------|------------|----------> |            |            |            |
                    |            |            |            |            | ---------> |            |            |
                    |            |            |            |            | <--------- |            |            |
                    |            |            |            |            | -----------|----------> |            |
                    |            |            |            |            |            | <--------- |            |
                    |            |            |            |            |            | ---------> |            |
                    |            |            |            |            |            |            | ---------> |
                    |            |            |            |            |            |            | <--------- |
                    | <----------|------------|------------|------------|------------|----------- |            |
                    |            |            |            |            |            |            |            |

```

Note:
The bot implements the [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern where:
- the brain is the model : it contains all the information about the bot, the users, the conversations,
- the dialog is the controller : it updates the brain and calls its view with the required parameters,
- the view generates the messages to be sent to the user.

## Messages
The SDK defines its own message format and supports:
- text messages,
- images and image uploads,
- links,
- buttons and postbacks,
- quick replies,
- complex messages such as carrousels.

## Nlu

## Dialog Manager

## Brains
(the SDK offers different brain implementations)

## Adapters

## Dialogs

## Views

## Extractors
