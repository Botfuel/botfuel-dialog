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

In order to use the PromptDialog, you need to import the class and extend it to your dialog class.

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

The PromptDialog have some parameters:

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

Here is defined a PromptDialog identified by the namespace **travel** which have 3 entities called **departureCity**, **destinationCity** and **date**.

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

For example:

You want the bot ask for the name first, then the age of the user:

```javascript
age: {
  dim: 'city',
  priority: 1,
},
name: {
  dim: 'forename',
  priority: 2,
}
```

#### isFulfilled

The **isFulfilled** property is a function that return a boolean indicating if the entity value is matching the condition of done of the entity.

> isFulfilled is an **optional** porperty. By default, an entity is fulfilled if the entity value is defined.

For example:

You want to store exactly 3 cities:

```javascript
cities: {
  dim: 'city',
  isFulfilled: cities => cities && cities.length === 3,
}
```

You want to retrieve a date later than today:

```javascript
date: {
  dim: 'time',
  isFulfilled: date => date && date > Date.now(),
}
```

#### reducer

The **reducer** property is a function that define how to deal with new values for the entity.

> reducer is an **optional** property. By default the old value is replaced with the new one.

For example:

You want to replace the color only if the color is blue:

```javascript
color: {
  dim: 'color',
  reducer: (oldColor, newColor) => newColor === 'blue' ? newColor : oldColor,
}
```

You want to replace the age only if is greater than the previous one:

```javascript
number: {
  dim: 'number',
  reducer: (oldNumber, newNumber) => newNumber > oldNumber ? newNumber : oldNumber,
}
```

## Hooks

Hooks are parts of a dialog lifecycle, they are very usefull the perform actions before displaying messages or before completing a dialog without overriding complexe methods of the PromptDialog.

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

The **dialogWillDisplay()** hook is triggered before displaying dialog messages, it allows to perform API call, actions in the brain, computes extra data and pass it to the view.

For example you can:

Call a weather api after extracting a location:

```javascript
async PromptDialog.dialogWillDisplay(adapter, userId, dialogData) {
	const { lat, long } = dialogData;
	let weather = null;
	if (lat && long) {
	  weather = await axios.get(`https://api.darksky.net/forecast/${API_KEY}/${lat},${long}`);
	}
	return weather;
}
```

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

The **dialogWillComplete()** hook is triggered before completing the dialog, it allows you to perform actions in the brain or chaining with another dialog.

For example you can:

**chaining** a new dialog with the `triggerNext()` method:

```javascript
async PromptDialog.dialogWillComplete(adapter, userId, dialogData) {
	this.triggerNext('thanks');
}
```

**performing** actions on the brain:

```javascript
async PromptDialog.dialogWillComplete(adapter, userId, dialogData) {
	await this.brain.conversationSet(userId, 'foo', 'bar');
}
```
