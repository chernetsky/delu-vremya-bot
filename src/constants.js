const pixelWidth = require('string-pixel-width');

const WHEN = {
  EVERYDAY: 'everyday',
  MONDAY: 'mon',
  TUESDAY: 'tue',
  WEDNESDAY: 'wed',
  THURSDAY: 'thu',
  FRIDAY: 'fri',
  SATURDAY: 'sat',
  SUNDAY: 'sun'
};

const LIST_DEFAULT_NAME = 'Мои дела';


const DEAL_BUTTON_LENGTH = 30;
const longStr = Array(DEAL_BUTTON_LENGTH).fill('Щ').join('');
const PIXEL_WIDTH_SETTINGS = { font: 'Impact', size: 14 };

const TEXT_METRICS = {
  maxPixelWidth: pixelWidth(longStr, PIXEL_WIDTH_SETTINGS),
  spacePixelWidth: pixelWidth(' ', PIXEL_WIDTH_SETTINGS),
  donePixelWidth: pixelWidth('✅', PIXEL_WIDTH_SETTINGS),

  dealButtonLength: DEAL_BUTTON_LENGTH
}


module.exports = {
  WHEN,
  LIST_DEFAULT_NAME,

  TEXT_METRICS,
  PIXEL_WIDTH_SETTINGS
};
