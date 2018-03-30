const _ = require('lodash');
const { BotTextMessage, Logger, QuickrepliesMessage } = require('botfuel-dialog');
const { SearchView } = require('botfuel-facetedsearch');

const logger = Logger('ArticleView');

const questions = {
  type: 'What do you want to buy?',
  brand: 'Which brand do you like?',
  color: 'What color do you like?',
  size: 'What is your size?',
  form: 'Which form do you like?',
  sleave: 'What about sleave?',
};

const getBotResponse = (facet, valueCounts) => {
  let facetValues = [];
  if (facet === 'size') {
    // size value is array
    const array = valueCounts.map(o => o.value.substring(1, o.value.length - 1).split(','));
    facetValues = _.union(...array);
  } else {
    facetValues = valueCounts.map(o => o.value);
  }

  return [new BotTextMessage(questions[facet]), new QuickrepliesMessage(facetValues)];
};

const articleHtml = (data) => {
  let html = '<div>';
  html += `<div><img src="${data.image}" style="max-width:100%"/></div>`;
  html += `<div><strong>${data.brand}</strong> <strong style="float:right">${
    data.price
  } €</strong></div>`;
  html += `<div>${data.size.substring(1, data.size.length - 1)}</div>`;
  if (data.cut) {
    html += `<div>${data.cut}</div>`;
  }

  if (data.material) {
    html += `<div>${data.material}</div>`;
  }
  html += '</div>';
  return html;
};

/** @inheritdoc */
class ArticleView extends SearchView {
  /** @inheritdoc */
  renderEntities(matchedEntities, missingEntities, extraData) {
    logger.debug('renderEntities', {
      matchedEntities,
      missingEntities,
      extraData,
    });

    if (missingEntities.size !== 0) {
      return getBotResponse(missingEntities.values().next().value, extraData.facetValueCounts);
    }

    const messages = [];
    if (extraData.data && extraData.data.length > 0) {
      messages.push(
        new BotTextMessage(
          `Thank you. We have ${extraData.data.length} product${
            extraData.data.length > 1 ? 's' : ''
          }:`,
        ),
      );
      _.forEach(extraData.data, (data) => {
        messages.push(new BotTextMessage(articleHtml(data)));
      });
    } else {
      messages.push(new BotTextMessage("Sorry we don't find any result!"));
    }
    return messages;
  }
}

module.exports = ArticleView;
