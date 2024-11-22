const inventoryService = require("../services/inventoryService");
module.exports = {
  createProduct: async (req, res) => {
    try {
      const { plu, name } = req.body;
      const result = await inventoryService.createProduct(plu, name);
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  createStock: async (req, res) => {
    try {
      const { product_id, shop_id, quantity_in_stock, quantity_in_order } =
        req.body;
      const result = await inventoryService.createStock(
        product_id,
        shop_id,
        quantity_in_stock,
        quantity_in_order
      );
      res.status(201).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  increaseStock: async (req, res) => {
    try {
      const { product_id, shop_id, quantity } = req.body;
      const result = await inventoryService.increaseStock(
        product_id,
        shop_id,
        quantity
      );
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  decreaseStock: async (req, res) => {
    try {
      const { product_id, shop_id, quantity } = req.body;
      const result = await inventoryService.decreaseStock(
        product_id,
        shop_id,
        quantity
      );
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getStocks: async (req, res) => {
    try {
      const filters = req.query;
      const stocks = await inventoryService.getStocks(filters);
      res.status(200).json(stocks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getProducts: async (req, res) => {
    try {
      const filters = req.query;
      const stocks = await inventoryService.getProducts(filters);
      res.status(200).json(stocks);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
