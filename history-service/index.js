const express = require('express');
const bodyParser = require('body-parser');
const historyController = require('./controllers/historyController');

const app = express();
const PORT = 4000;
app.use(bodyParser.json());

app.post('/api/history', historyController.logAction);
app.get('/api/history', historyController.getHistory);

app.listen(PORT);


















// // index.js
// const express = require('express');
// const pool = require('./db');

// const app = express();
// app.use(express.json());

// // Эндпоинт для создания товара
// app.post('/products', async (req, res) => {
//   const { plu, name } = req.body;
//   try {
//     await pool.query('INSERT INTO products (plu, name) VALUES ($1, $2)', [plu, name]);
//     res.status(201).json({ message: 'Product created' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Эндпоинт для создания остатка
// app.post('/stocks', async (req, res) => {
//   const { plu, shop_id, quantity_in_stock, quantity_in_order } = req.body;
//   try {
//     const product = await pool.query('SELECT id FROM products WHERE plu = $1', [plu]);
//     if (product.rows.length === 0) return res.status(404).json({ error: 'Product not found' });

//     const product_id = product.rows[0].id;
//     await pool.query(
//       'INSERT INTO product_stocks (product_id, shop_id, quantity_in_stock, quantity_in_order) VALUES ($1, $2, $3, $4)',
//       [product_id, shop_id, quantity_in_stock, quantity_in_order]
//     );
//     res.status(201).json({ message: 'Stock created' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post('/stocks/increase', async (req, res) => {
//     const { plu, shop_id, quantity } = req.body;
  
//     try {
//       // Проверяем, существует ли продукт
//       const product = await pool.query('SELECT id FROM products WHERE plu = $1', [plu]);
//       if (product.rows.length === 0) {
//         return res.status(404).json({ error: 'Product not found' });
//       }
//       const product_id = product.rows[0].id;
  
//       // Проверяем, существует ли запись об остатках для этого продукта и магазина
//       const stock = await pool.query(
//         'SELECT id, quantity_in_stock FROM product_stocks WHERE product_id = $1 AND shop_id = $2',
//         [product_id, shop_id]
//       );
  
//       if (stock.rows.length === 0) {
//         return res.status(404).json({ error: 'Stock record not found for the specified shop and product' });
//       }
  
//       // Увеличиваем количество на складе
//       const newQuantity = stock.rows[0].quantity_in_stock + quantity;
//       await pool.query(
//         'UPDATE product_stocks SET quantity_in_stock = $1 WHERE id = $2',
//         [newQuantity, stock.rows[0].id]
//       );
  
//       res.status(200).json({ message: 'Stock quantity increased successfully', newQuantity });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });

// // Запуск сервера
// app.listen(3000, () => {
//   console.log('Inventory service running on port 3000');
// });







// module.exports = pool;

// Выполнение SQL-запроса
// exports.query = async (text, params) => {
//     const client = await pool.connect(); // Получаем соединение
//     try {
//       const result = await client.query(text, params); // Выполняем запрос
//       return result.rows; // Возвращаем строки результата
//     } catch (err) {
//       console.error('Ошибка выполнения запроса:', err.message);
//       throw err;
//     } finally {
//       client.release(); // Освобождаем соединение
//     }
//   };
  
//   // Вставка записи
//   exports.insert = async (table, data) => {
//     const keys = Object.keys(data).join(', ');
//     const values = Object.values(data);
//     const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
//     const query = `INSERT INTO ${table} (${keys}) VALUES (${placeholders}) RETURNING *`;
//     const result = await this.query(query, values);
//     return result[0];
//   };
  
//   // Поиск записей по фильтрам
//   exports.find = async (table, filters) => {
//     const keys = Object.keys(filters);
//     const values = Object.values(filters);
//     const conditions = keys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
//     const query = `SELECT * FROM ${table} WHERE ${conditions}`;
//     return await this.query(query, values);
//   };
  
//   // Поиск одной записи
//   exports.findOne = async (table, filters) => {
//     const result = await this.find(table, filters);
//     return result[0] || null;
//   };
  
//   // Обновление записи
//   exports.update = async (table, filters, data) => {
//     const dataKeys = Object.keys(data);
//     const dataValues = Object.values(data);
//     const dataPlaceholders = dataKeys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  
//     const filterKeys = Object.keys(filters);
//     const filterValues = Object.values(filters);
//     const filterPlaceholders = filterKeys.map((key, i) => `${key} = $${dataKeys.length + i + 1}`).join(' AND ');
  
//     const query = `
//       UPDATE ${table}
//       SET ${dataPlaceholders}
//       WHERE ${filterPlaceholders}
//       RETURNING *
//     `;
//     const result = await this.query(query, [...dataValues, ...filterValues]);
//     return result[0];
//   };
  
  // Удаление записи
//   exports.delete = async (table, filters) => {
//     const keys = Object.keys(filters);
//     const values = Object.values(filters);
//     const conditions = keys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
//     const query = `DELETE FROM ${table} WHERE ${conditions} RETURNING *`;
//     const result = await this.query(query, values);
//     return result[0];
//   };