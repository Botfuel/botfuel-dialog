const { PromptDialog } = require('botfuel-dialog');

class ProductsDialog extends PromptDialog {}

ProductsDialog.params = {
  namespace: 'products',
  entities: {
    product: {
      dim: 'product',
    },
  },
};

module.exports = ProductsDialog;
