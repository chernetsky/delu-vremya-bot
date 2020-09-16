const moment = require('moment');
const { SETTINGS } = require('../constants');

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


module.exports = {
  getUndoneAt
}