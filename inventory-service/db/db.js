const { Client } = require('pg');

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres",
  port: 5432,
});

client.connect();

module.exports = {
  insert: async (table, data) => {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data).map((val) => `'${val}'`).join(', ');
    const query = `INSERT INTO ${table} (${columns}) VALUES (${values}) RETURNING *`;
    const result = await client.query(query);
    return result.rows[0];
  },
  update: async (table, conditions, data) => {
    const setClause = Object.entries(data)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(', ');
    const whereClause = Object.entries(conditions)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(' AND ');
    const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING *`;
    const result = await client.query(query);
    return result.rows[0];
  },
  findOne: async (table, conditions) => {
    const whereClause = Object.entries(conditions)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(' AND ');
    const query = `SELECT * FROM ${table} WHERE ${whereClause} LIMIT 1`;
    const result = await client.query(query);
    return result.rows[0];
  },

  find: async (table, filters = {}) => {
    let query = `SELECT * FROM ${table}`;
    const conditions = [];
    const values = [];

    if (filters.name) {
        conditions.push(`name ILIKE $${values.length + 1}`);
        values.push(`%${filters.name}%`);
    }
    if (filters.plu) {
        conditions.push(`plu = $${values.length + 1}`);
        values.push(filters.plu);
    }
    if (filters.quantity_in_stock_from) {
        conditions.push(`quantity_in_stock >= $${values.length + 1}`);
        values.push(filters.quantity_in_stock_from);
    }
    if (filters.quantity_in_stock_to) {
        conditions.push(`quantity_in_stock <= $${values.length + 1}`);
        values.push(filters.quantity_in_stock_to);
    }
    if (filters.quantity_in_order_from) {
        conditions.push(`quantity_in_order >= $${values.length + 1}`);
        values.push(filters.quantity_in_order_from);
    }
    if (filters.quantity_in_order_to) {
        conditions.push(`quantity_in_order <= $${values.length + 1}`);
        values.push(filters.quantity_in_order_to);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    try {
        const result = await client.query(query, values);
        return result.rows;
    } catch (err) {
        throw new Error(`Ошибка при выполнении запроса: ${err.message}`);
    }
}

};