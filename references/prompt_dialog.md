# PromptDialog

**PromptDialog** is a class that allows to prompt users to answer questions.
Each question corresponds to an entity. When the user answers the questions, entities are extracted from the answer.
The PromptDialog uses the extracted entities to decide what to do next.

For example you have to use a PromptDialog when you want:

- configure a travel
- get the weather in given location
- search a movie by criteria

## Implementation

In order to use the prompt dialog, you need to import the class and extend it to your dialog class.

```javascript
const { PromptDialog } = require('botfuel-dialog');

class TravelDialog extends PromptDialog {}
```

## Parameters

The prompt dialog have some parameters:

- The **namespace** is used to identify the dialog in the brain, where things are stored.
- The **entities** are extracted from users answers by extractors and used to customize the flow of a conversation or to be able to do some actions.

_For example:_

```javascript
TravelDialog.params = {
  namespace: 'travel',
  entities: {
    departureCity: {
      dim: String,
      priority: Number,
      isFulfilled: Function(),
      reducer: Function(),
    },
    destinationCity: {
      dim: String,
      priority: Number,
      isFulfilled: Function(),
      reducer: Function(),
    }
    date: {
      dim: String,
      isFulfilled: Function(),
    }
  }
}
```

Here is defined a prompt dialog identified by the namespace **travel** which have 3 entities called **departureCity**, **destinationCity** and **date**.

An entity have some properties:

- **dim** is the dimension of the entity, it's used to extract the correct information from a user answer.
- **priority** is a number that give a priority to an entity, greater is the priority earlier will the bot ask for this entity. _Default value is 0._
- **isFulfilled** is a function that return a boolean indicating if the entity value is matching the condition of done of the entity. _By default, an entity is fulfilled if the entity value is not null._
- **reducer** is a function that define how we deal with new values for the entity. _By default old value is replaced with the new one._

> There is also a built-in entity dimension `system:boolean` used to extract yes/no answers

> Note that the **dim** property is required, but **priority**, **isFulfilled** and **reducer** properties are optional, you can use them if you want more control on your entities.

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

### dialogWillComplete()
```javascript
async PromptDialog.dialogWillComplete(
  adapter,
  userId,
  { matchedEntities, missingEntities },
)
```

Allows to perform things before a prompt dialog is completed.

> For example you can **chaining** a new dialog or **performing** actions on the brain.
