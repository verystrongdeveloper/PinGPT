export const CONSTANTS = {
  STORAGE_KEY: 'chatpins',
  NAMES_KEY: 'chatpinNames',
  LANGUAGE_KEY: 'chatpinLanguage',
  DIMENSIONS: {
    MIN_HEIGHT: 260,
    MAX_HEIGHT: 450,
    ITEM_HEIGHT: 54,
    HEADER_HEIGHT: 70,
    CONTENT_PADDING: 40,
    MAX_VISIBLE_ITEMS: 6,
  },
  ANIMATION: {
    STAGGER_DELAY: 80,
    DELETE_DURATION: 400,
    NOTIFICATION_DURATION: 2800,
    FADE_DURATION: 300
  },
  SWIPE: {
    THRESHOLD: 80,
    MIN_MOVE_DISTANCE: 5
  },
  SELECTORS: {
    MARKDOWN: '.markdown',
    PIN_BTN: '.pingpt-btn',
    NOTIFICATION: '.pingpt-notification',
    QUICK_JUMP: '#pingpt-quickjump'
  },
  DEBOUNCE_DELAY: 100,
}; 