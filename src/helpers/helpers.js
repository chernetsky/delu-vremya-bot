const {
  models: { List }
} = require('../db/db');
const { LIST_DEFAULT_NAME } = require('../constants');

const getDefaultList = async (userId) => {
  userId = String(userId);
  
  let defaultList = await List.findOne({
    where: {
      userId,
      default: true
    }
  });

  if (!defaultList) {
    defaultList = await List.create({ name: LIST_DEFAULT_NAME, userId, default: true });
  }

  return defaultList;
};

module.exports = {
  getDefaultList
};
