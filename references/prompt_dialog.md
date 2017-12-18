# PromptDialog

**PromptDialog** is a class that allow developer building complex dialogs.

> Remember **complex dialogs** are dialogues that requires additional informations called **entities** in order to customize the flow of a conversation according to an user.

## Implementation

In order to use the prompt dialog, you need to import the class and extend it to your dialog class.

```javascript
const { PromptDialog } = require('botfuel-dialog');

class MyPromptDialog extends PromptDialog {}
```

## Parameters

The prompt dialog have some parameters:

- The **namespace** is used to identify the dialog.
- The **entities** represents the informations we want to get from users to customize the flow of the conversation.

For example:

```javascript
MyPromptDialog.params = {
  namespace: 'my-prompt',
  entities: {
    entityName: {
      dim: String,
      priority: Number,
      isFulfilled: Function()
      reducer: Function(),
    }
  }
}
```

Here is defined a prompt dialog identfied by the namespace **my-prompt** which have only one entity called **entityName**.

This entity have some properties:

- **dim** is the dimension of the entity.
- **priority** is a number that give a priority to an entity, greater is the priority, earlier will the bot ask for this entity. _Default value is 0._
- **isFullfilled** is a function that return a boolean indicating if the entity value is matching condition of done of the entity. _By default, an entity is fullfilled if the entity value is not null._
- **reducer** is a function that define how we deal with new values for the entity. _By default old value is replaced with the new one._

> Note that the **dim** property is required, but **priority**, **isFullfilled** and **reducer** properties are optionnal, you can use them if you want more control on your entities.

## Methods

### matchParameterWithCandidates()
```javascript
PromptDialog.matchParameterWithCandidates({
  dialogParameter,
  candidates,
  initialValue,
})
```

Attempt to match an entity parameter with raw entities candidates extracted from a message by extractors.

> Note that we apply the reducer function to a raw entity candidate until we run out of candidates or if the isFulfilled condition is met.

### computeEntities()
```javascript
PromptDialog.computeEntities(
  candidates,
  parameters,
  [dialogEntities = {}], // optional
)
```

Computes **matched** and **missing** entities before displaying them.

> Note that **matchedEntities** are the entities that have a value and **missingEntities** not.

### execute()
```javascript
PromptDialog.execute(
  adapter,
  userId,
  candidates,
)
```

Computes **matched** and **missing** entities and display them before completing the dialog or waiting for others missing entities.

> Note that before completing a prompt dialog the `dialogWillComplete` hook is called.


### dialogWillComplete()
```javascript
PromptDialog.dialogWillComplete(
  adapter,
  userId,
  { matchedEntities, missingEntities },
)
```

Hook that allow to perform things before a prompt dialog is completed.

> For example you can **chaining** a new dialog or **performing** actions on the brain.
