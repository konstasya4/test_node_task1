const historyService = require('../services/historyService');

module.exports = {
logAction: async (req, res) => {
  try {
    const { action, plu, shop_id, date = new Date() } = req.body;
    const result = await historyService.logAction(action, plu, shop_id, date);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
},

getHistory: async (req, res) => {
  try {
    const { shop_id, plu, action, date_from, date_to, page = 1, limit = 10 } = req.query;
    const result = await historyService.getHistory({
      shop_id,
      plu,
      action,
      date_from,
      date_to,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
},
}