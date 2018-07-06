async function intentFilter(intents, { userMessage }) {
  if (userMessage.payload.value === 'Je veux') {
    return [];
  }

  if (userMessage.payload.value === 'je veux') {
    return intents;
  }

  if (userMessage.payload.value === 'Je Veux') {
    return [intents[1]];
  }
  return intents;
}

module.exports = intentFilter;
