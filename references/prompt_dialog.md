# PromptDialog

**PromptDialog** is a class that allows to prompt users to answer questions.
Each question corresponds to an entity. When the user answers the questions, entities are extracted from the answer.
The PromptDialog uses the extracted entities to decide what to do next.

_For example you can to use a PromptDialog when you want to:_

Configure a car purchase:

```javascript
const { PromptDialog } = require('botfuel-dialog');

class CarDialog extends PromptDialog {}

CarDialog = {
  namespace: 'car',
  entities: {
    color: {
      dim: 'color'
    },
    brand: {
    	dim: 'brand' // use a corpus extractor
    },
    transmission: {
    	dim: 'transmission' // use a corpus extractor
    },
    isNew: {
      dim: 'system:boolean'
    }
  }
}
```

Book a trip in a foreign country:

```javascript
const { PromptDialog } = require('botfuel-dialog');

class TripDialog extends PromptDialog {}

TripDialog = {
  namespace: 'trip',
  entities: {
    city: {
      dim: 'city',
    },
    accommodation: {
    	dim: 'accommodation', // use a corpus extractor
    },
    personNumber: {
    	dim: 'number',
    	isFulfilled: number => number && number <= 10, // max 10 persons
    },
    fromDate: {
    	dim: 'time',
    },
    toDate: {
      dim: 'time',
      isFulfilled: (toDate, { dialogEntities }) => toDate > dialogEntities.fromDate,
    },
  },
}
```

## Implementation

In order to use the prompt dialog, you need to import the class and extend it to your dialog class.

_The following example illustrate a travel dialog_

```javascript
const { PromptDialog } = require('botfuel-dialog');

class TravelDialog extends PromptDialog {}

TravelDialog.params = {
  namespace: 'travel',
  entities: {
    departure: {
      dim: 'city',
      priority: 3,
      isFulfilled: (city, { dialogEntities }) => city & city !== dialogEntities.destination,
    },
    destination: {
      dim: 'city',
      priority: 2,
      isFulfilled: (city, { dialogEntities }) => city & city !== dialogEntities.departure,
    }
    date: {
      dim: 'time',
      isFulfilled: date => date && date > Date.now(),
    }
  }
}
```

## Parameters

The prompt dialog have some parameters:

- The **namespace** is used to identify the dialog in the brain, where things are stored.
- The **entities** are extracted from users answers by extractors and used to customize the flow of a conversation or to be able to do some actions.

_For example:_

```javascript
<dialog-name>.params = {
  namespace: '<dialog-namespace>',
  entities: {
    <entity-name>: {
      dim: String,
      priority: Number,
      isFulfilled: Function(),
      reducer: Function(),
    },
    ...
  }
}
```

Here is defined a prompt dialog identified by the namespace **travel** which have 3 entities called **departureCity**, **destinationCity** and **date**.

### Namespace

The namespace is a key used by the brain to store the dialog related data into the brain and access it, the namespace **must be unique**.

#### Entities

An entity is defined by some properties: **dim**, **priority**, **isFulfilled** and **reducer**.

#### dim

The **dim** property is the dimension of the entity. this dimension is used by an entity extractor or a corpus extractor to extract informations from a user answer.

> dim is a **required** porperty.

There is also a built-in entity dimension `system:boolean` used to extract yes/no answers.

[Here](https://app.botfuel.io/docs#possible-dimensions) you can find the list of availables dimensions used by the entity extractor of Botfuel.

#### priority

The **priority** property is a number that give a priority to an entity, greater is the priority earlier will the bot ask for this entity.

> priority is an **optional** porperty with a default value of 0.

#### isFulfilled

The **isFulfilled** property is a function that return a boolean indicating if the entity value is matching the condition of done of the entity.

> isFulfilled is an **optional** porperty. By default, an entity is fulfilled if the entity value is defined.

#### reducer

The **reducer** property is a function that define how to deal with new values for the entity.

> reducer is an **optional** property. By default the old value is replaced with the new one.

_isFulfilled and reducer implementations examples_

We want to store exactly 3 cities and replace the old ones with the new ones:

```javascript
cities: {
  dim: 'city',
  isFulfilled: cities => cities && cities.length === 3,
  reducer: (cities, newCity) => [...(cities || []), newCity],
}
```

We want to store a date that is greater than the current date:

```javascript
date: {
  dim: 'time',
  isFulfilled: date => date && date > new Date(),
}
```

We want to store a positive number and replace it only if the given number is greater than 21:

```javascript
positiveNumber: {
  dim: 'number',
  isFulfilled: number => number && number > 0,
  reducer: (oldNumber, newNumber) => newNumber > 21 ? newNumber : oldNumber,
}
```

## Hooks

### dialogWillDisplay()
```javascript
/**
 * Hook to be overridden before dialog displays.
 * Returns null by default.
 * @async
 * @param {Adapter} adapter - the adapter
 * @param {String} userId - the user id
 * @param {Object} dialogData - the dialog data
 * @returns {Promise.<*>} the data extended to the display method
 */
async PromptDialog.dialogWillDisplay(
  adapter,
  userId,
  dialogData,
)
```

Allows to perform things before a prompt dialog view is displayed, like API call or actions in the brain.

> For example you can **chaining** a new dialog or **performing** actions on the brain.

### dialogWillComplete()
```javascript
/**
 * Hook to be overridden before dialog completes.
 * Does nothing by default.
 * @async
 * @param {Adapter} adapter - the adapter
 * @param {String} userId - the user id
 * @param {Object} dialogData - the dialog data
 * @returns {Promise.<*>}
 */
async PromptDialog.dialogWillComplete(
  adapter,
  userId,
  dialogData,
)
```

Allows to perform things before a prompt dialog is completed, like chaining with another dialog or actions in the brain.

> For example you can **chaining** a new dialog or **performing** actions on the brain.
