const db = require('../db/db'); 
const axios = require('axios');

const HISTORY_SERVICE_URL = 'http://localhost:4000';

const sendToHistoryService = async (action, data) => {
  try {
    await axios.post(`${HISTORY_SERVICE_URL}/api/history`, { action, ...data });
  } catch (err) {
    console.error('Ошибка отправки данных в history-service:', err.message);
  }
};

async function findStocks(product_id, shop_id) {
  const stock = await db.findOne('inventory.product_stocks', { product_id, shop_id });
  if (!stock) {
        throw new Error('Запас не найден');
  }
  return stock;
}
module.exports = {
createProduct: async (plu, name) => {
  try {
    const product = { plu, name };
    const result = await db.insert('inventory.products', product); 
    await sendToHistoryService('CREATE_PRODUCT', { plu, name });
    return result;
  } catch (err) {
    throw new Error(`Ошибка при создании продукта: ${err.message}`);
  }
},

createStock: async (product_id, shop_id, quantity_in_stock, quantity_in_order) => {
  try {
    const stock = { product_id, shop_id, quantity_in_stock, quantity_in_order };
    const product = await db.findOne('inventory.products', { id: product_id });
    const result = await db.insert('inventory.product_stocks', stock);
    await sendToHistoryService('CREATE_STOCK', { plu: product.plu, shop_id});
    return result;
  } catch (err) {
    throw new Error(`Ошибка при создании запаса: ${err.message}`);
  }
},

increaseStock: async (product_id, shop_id, quantity) => {
  try {
    const stock = await findStocks(product_id, shop_id);
    const product = await db.findOne('inventory.products', { id: product_id }); 
    stock.quantity_in_stock += quantity;
    const updatedStock = await db.update('inventory.product_stocks', { product_id, shop_id }, stock);
    await sendToHistoryService('INCREASE_STOCK', {plu: product.plu, shop_id, });
    return updatedStock;
  } catch (err) {
    throw new Error(`Ошибка при увеличении запаса: ${err.message}`);
  }
},

decreaseStock: async (product_id, shop_id, quantity) => {
  try {
    const stock = await findStocks(product_id, shop_id); 
    const product = await db.findOne('inventory.products', { id: product_id });
    if (stock.quantity_in_stock < quantity) {
      throw new Error('Недостаточно запаса');
    }
    stock.quantity_in_stock -= quantity;
    const updatedStock = await db.update('inventory.product_stocks', { product_id, shop_id }, stock);
    await sendToHistoryService('DECREASE_STOCK', { plu: product.plu, shop_id});
    return updatedStock;
  } catch (err) {
    throw new Error(`Ошибка при уменьшении запаса: ${err.message}`);
  }
},

getStocks: async (filters) => {
  try {
    const stocks = await db.find('inventory.product_stocks', filters); 
    return stocks;
  } catch (err) {
    throw new Error(`Ошибка при получении списка запасов: ${err.message}`);
  }
},

 getProducts: async (filters) => {
    try {
      const products = await db.find('inventory.products', filters);
      return products;
    } catch (err) {
      throw new Error(`Ошибка при получении списка продуктов: ${err.message}`);
    }
  },
};
