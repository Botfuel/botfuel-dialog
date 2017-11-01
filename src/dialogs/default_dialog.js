const TextDialog = require('./text_dialog');

/**
 * DefaultDialog
 * @class
 * @classdesc the default dialog is used when the bot doesn't understand user intent
 * @extends TextDialog
 */
class DefaultDialog extends TextDialog {}

module.exports = DefaultDialog;
