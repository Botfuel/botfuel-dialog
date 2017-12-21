# PromptDialog

**PromptDialog** is a class that allows you to prompt users to answer questions.
Each question corresponds to an entity. When the user answers the questions, entities are extracted from the answer.
The PromptDialog uses the extracted entities to decide what to do next.

_For example, you can use a PromptDialog when you want to:_

_Configure a car purchase:_

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
    },
  },
}
```

_Book a hotel:_

```javascript
const { PromptDialog } = require('botfuel-dialog');

class BookHotelDialog extends PromptDialog {}

BookHotelDialog = {
  namespace: 'book-hotel',
  entities: {
    city: {
      dim: 'city',
    },
    personNumber: {
      dim: 'number',
      isFulfilled: number => number && number <= 10, // max 10 persons
    },
    fromDate: {
      dim: 'time',
      isFulfilled: fromDate => fromDate && fromDate > Date.now(),
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

_The following example illustrates a travel dialog:_

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
    },
    date: {
      dim: 'time',
      isFulfilled: date => date && date > Date.now(),
    },
  },
}
```

## Parameters

The PromptDialog has the following parameters:

- The **namespace** is used to identify the dialog in the brain, where things are stored.
- The **entities** are extracted from users answers by extractors and used to customize the flow of a conversation or to perform some actions.

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
  },
}
```

### Namespace

The namespace is a key used by the brain to store the dialog-related data into the brain and access it. The namespace must be unique.

### Entities

An entity is defined by the following properties: **dim**, **priority**, **isFulfilled** and **reducer**.

#### dim

The **dimension** defines the type of information that will be extracted from the user sentence. Dimensions can be pre-defined or user-defined.

> dim is a **required** property.

The entity extractor based on [**Botfuel NLP entity extraction** web service](http://docs.botfuel.io/api#entity-extraction) supports [31 dimensions](http://docs.botfuel.io/api#possible-dimensions).
Corpus extractors use user-defined dimensions.
There is also a built-in entity dimension `system:boolean` used to extract yes/no answers.

#### priority

The **priority** is a positive number, the greater the priority, the earlier the bot will ask for this entity.

> priority is an **optional** property with a default value of 0.

_For example, you can have the bot ask for the name of the user first, and then for his/her age:_

```javascript
age: {
  dim: 'number',
  priority: 1,
},
name: {
  dim: 'forename',
  priority: 2,
},
```

#### isFulfilled

The **isFulfilled** property is a function that returns a boolean value indicating if the entity value is matching the condition of done of the entity.

> isFulfilled (entityName, { dialogEntities })

> isFulfilled is an **optional** property. By default, an entity is fulfilled if the entity value is defined.

_For example, if you want to store exactly 3 cities:_

```javascript
cities: {
  dim: 'city',
  isFulfilled: cities => cities && cities.length === 3,
}
```

_Or if you want to retrieve a date later than today:_

```javascript
date: {
  dim: 'time',
  isFulfilled: date => date && date > Date.now(),
}
```

#### reducer

The **reducer** property is a function that defines how to deal with new values for the entity.

> reducer (newValue, oldValue)

> reducer is an **optional** property. By default the old value is replaced with the new one.

_For example, if you want to replace the color only if the new one extracted is blue:_

```javascript
color: {
  dim: 'color',
  reducer: (oldColor, newColor) => newColor === 'blue' ? newColor : oldColor,
}
```

_You want to replace the age only if is greater than the previous one:_

```javascript
number: {
  dim: 'number',
  reducer: (oldNumber, newNumber) => newNumber > oldNumber ? newNumber : oldNumber,
}
```

## Hooks

Hooks are very useful for performing actions before displaying messages or before completing a dialog without overriding other methods of the PromptDialog.

### dialogWillDisplay()

The `dialogWillDisplay` hook is triggered before displaying dialog messages. It allows you to perform API calls and actions in the brain, returned data will be passed to the view.

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

_For example you can call a weather API after extracting a location:_

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

The `dialogWillComplete` hook is triggered before completing the dialog. It allows you to perform actions in the brain or to branch to a specific dialog.

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

_For example you can branch to a new dialog with the `triggerNext()` method:_

```javascript
async PromptDialog.dialogWillComplete(adapter, userId, dialogData) {
  this.triggerNext('thanks');
}
```

_In addition, you can also perform actions in the brain:_

```javascript
async PromptDialog.dialogWillComplete(adapter, userId, dialogData) {
  await this.brain.conversationSet(userId, 'foo', 'bar');
}
```
