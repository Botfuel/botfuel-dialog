'use strict';

const { PromptDialog } = require('botfuel-dialog');

class CitiesDialog extends PromptDialog {}

CitiesDialog.params = {
  namespace: 'cities',
  entities: {
    favoriteCities: {
      dim: 'city',
      isFulfilled: cities => cities && cities.length >= 5,
      reducer: (oldCities, newCity) => [...(oldCities || []), newCity],
    },
  },
};

module.exports = CitiesDialog;
