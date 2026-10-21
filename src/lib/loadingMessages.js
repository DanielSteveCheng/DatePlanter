export const LOADING_MESSAGES = [
  'Planting…',
  'Watering…',
  'Fertilizing…',
  'Sprouting…',
  'Pruning…',
  'Soaking up the sun…',
  'Digging…',
  'Tending the garden…',
];

export const pickLoadingMessage = (random = Math.random, messages = LOADING_MESSAGES) =>
  messages[Math.min(messages.length - 1, Math.floor(random() * messages.length))];
