const db = require("../db/db");
module.exports = {
  logAction: async (action, plu, shop_id, date) => {
    try {
      const historyEntry = { action, plu, shop_id, date };
      const result = await db.insert("history.actions", historyEntry);
      return result;
    } catch (err) {
      throw new Error(`Failed to log action: ${err.message}`);
    }
  },

  getHistory: async ({
    shop_id,
    plu,
    action,
    date_from,
    date_to,
    page,
    limit,
  }) => {
    try {
      const filters = {};
      if (shop_id) filters.shop_id = shop_id;
      if (plu) filters.plu = plu;
      if (action) filters.action = action;

      const dateConditions = {};
      if (date_from) dateConditions.date_from = date_from;
      if (date_to) dateConditions.date_to = date_to;

      const offset = (page - 1) * limit;

      const result = await db.find(
        "history.actions",
        filters,
        dateConditions,
        limit,
        offset
      );
      return result;
    } catch (err) {
      throw new Error(`Failed to retrieve history: ${err.message}`);
    }
  },
};
