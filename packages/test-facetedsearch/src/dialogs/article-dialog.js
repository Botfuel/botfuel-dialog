const { SearchDialog } = require('botfuel-facetedsearch');
const ArticleDb = require('../db/article-db');

class ArticleDialog extends SearchDialog {}

ArticleDialog.params = {
  namespace: 'assurance',
  db: new ArticleDb(),
  entities: {
    type: {
      dim: 'type',
      priority: 10,
    },
    brand: {
      dim: 'brand',
    },
    size: {
      dim: 'size',
      priority: 5,
    },
    sleave: {
      dim: 'sleave',
    },
    color: {
      dim: 'color',
    },
    form: {
      dim: 'form',
    },
  },
};

module.exports = ArticleDialog;
