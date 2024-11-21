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
    const values = Object.values(data).map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO ${table} (${columns}) VALUES (${values}) RETURNING *`;
    const result = await client.query(query, Object.values(data));
    return result.rows[0];
  },

  find: async (table, filters = {}, dateConditions = {}, limit = 10, offset = 0) => {
    let query = `SELECT * FROM ${table}`;
    const conditions = [];
    const values = [];

    Object.entries(filters).forEach(([key, value]) => {
      conditions.push(`${key} = $${values.length + 1}`);
      values.push(value);
    });

    if (dateConditions.date_from) {
      conditions.push(`date >= $${values.length + 1}`);
      values.push(dateConditions.date_from);
    }
    if (dateConditions.date_to) {
      conditions.push(`date <= $${values.length + 1}`);
      values.push(dateConditions.date_to);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY date DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const result = await client.query(query, values);
    return result.rows;
  },
};
