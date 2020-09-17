const moment = require('moment');
const { WHEN, SETTINGS } = require('../constants');

const getUndoneAt = () => {
  const {
    undoneAt: { hours: undoneHours, minutes: undoneMinutes }
  } = SETTINGS;

  const now = moment();
  const undoneAt = moment(now.valueOf());

  undoneAt.hours(undoneHours).minutes(undoneMinutes).seconds(0);

  if (now.isAfter(undoneAt)) {
    undoneAt.add(1, 'day');
  }

  return undoneAt.valueOf();
};

const whenIsToday = (when) => {
  if (when == WHEN.EVERYDAY) return true;

  const now = moment();
  const weekDay = now.format('ddd').toLowerCase();
  if (when.indexOf(weekDay) != -1) return true;

  return false;
};

module.exports = {
  getUndoneAt,
  whenIsToday
};
