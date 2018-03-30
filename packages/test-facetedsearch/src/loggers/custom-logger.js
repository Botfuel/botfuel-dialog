const WinstonWrapper = require('logtown-winston');
const winston = require('winston');

const transports = [
  new winston.transports.Console({
    json: false,
    colorize: true,
    prettyPrint: true,
    timestamp: true,
    handleExceptions: true,
    align: false,
    level: 'debug',
  }),
];

const options = {
  exitOnError: false,
};

module.exports = {
  wrapper: new WinstonWrapper(transports, options),
  config: {
    namespaces: {
      BotfuelNlu: {
        disable: ['debug'],
      },
      Adapter: {
        disable: ['debug'],
      },
      TestAdapter: {
        disable: ['debug'],
      },
      MessengerAdapter: {
        disable: ['debug'],
      },
      MessengerBCAAdapter: {
        disable: ['debug'],
      },
      WebAdapter: {
        disable: ['debug'],
      },
      Bot: {
        disable: ['debug'],
      },
      Brain: {
        disable: ['debug'],
      },
      Classifier: {
        disable: ['debug'],
      },
      Corpus: {
        disable: ['debug'],
      },
      FileCorpus: {
        disable: ['debug'],
      },
      CorpusExtractor: {
        disable: ['debug'],
      },
      RegexExtractor: {
        disable: ['debug'],
      },
      Dialog: {
        disable: ['debug'],
      },
      DialogManager: {
        disable: ['debug'],
      },
      TextDialog: {
        disable: ['debug'],
      },
      PromptDialog: {
        disable: ['debug'],
      },
      SearchDialog: {
        disable: ['debug'],
      },
      FeedbackDialog: {
        disable: ['debug'],
      },
      MongoBrain: {
        disable: ['debug'],
      },
      MemoryBrain: {
        disable: ['debug'],
      },
      Nlu: {
        disable: ['debug'],
      },
      WsExtractor: {
        disable: ['debug'],
      },
      CompositeExtractor: {
        disable: ['debug'],
      },
      View: {
        disable: ['debug'],
      },
      ViewManager: {
        disable: ['debug'],
      },
      PromptView: {
        disable: ['debug'],
      },
      SearchView: {
        disable: ['debug'],
      },
      QnasView: {
        disable: ['debug'],
      },
      TextView: {
        disable: ['debug'],
      },
      Resolver: {
        disable: ['debug'],
      },
      AdapterResolver: {
        disable: ['debug'],
      },
      ViewResolver: {
        disable: ['debug'],
      },
      MiddlewareManager: {
        disable: ['debug'],
      },
    },
  },
};
