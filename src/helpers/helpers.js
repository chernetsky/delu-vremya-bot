const r = require('ramda');
const {
  models: { List }
} = require('../db/db');
const { LIST_DEFAULT_NAME } = require('../constants');

const getCurrentList = async (userId) => {
  userId = String(userId);

  const userLists = await List.findAll({ where: { userId } });
  
  let list = r.find(r.propEq('current', true))(userLists);

  if (!list) {
    // Create new list
    list = await List.create({ name: LIST_DEFAULT_NAME, userId, current: true });
  }

  return list;
};

module.exports = {
  getCurrentList
};
