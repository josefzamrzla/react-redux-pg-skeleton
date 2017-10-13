import _ from 'lodash';
import camelcaseKeys from 'camelcase-keys';
import { Pool } from 'pg';

export default (config) => {
  const pool = new Pool({
    user: config.db.user,
    host: config.db.host,
    database: config.db.database,
    password: config.db.password
  });

  const defaultLoggingFn = (sql, params = []) => {
    console.log(''); // eslint-disable-line
    console.log('Query', JSON.stringify({ // eslint-disable-line
      query: sql,
      params: params.reduce((acc, curr, i) => {
        acc[`$${i + 1}`] = curr;
        return acc;
      }, {})
    }, null, 2));
    console.log(''); // eslint-disable-line
  };

  const loggingFn = config.db.logging ? (_.isFunction(config.db.logging) ? config.db.logging : defaultLoggingFn) : () => {}; // eslint-disable-line

  const query = async (sql, params, opts = {}) => {
    loggingFn(sql.replace(/[\n\t]+/g, '').replace(/[ ]+/g, ' ').trim(), params);
    const result = await (opts && opts.client ? opts.client : pool).query(sql, params);
    return {
      ...result,
      rows: result.rows.map(row => camelcaseKeys(row, { deep: true }))
    };
  };

  return {
    query,
    async transaction() {
      const client = await pool.connect();
      const commit = async () => {
        await query('COMMIT', [], { client });
        return client.release();
      };

      const rollback = async () => {
        await query('ROLLBACK', [], { client });
        return client.release();
      };
      await query('BEGIN', [], { client });
      return { client, commit, rollback };
    },
    table(table) {
      const doInsert = async (data = {}, suffix = '', opts = {}) => {
        const cols = _.keys(data);
        const queryData = _.values(data);
        let paramNo = 1;
        const placeholders = [];
        const statements = cols.map((col) => {
          placeholders.push(`$${paramNo++}`);
          return _.snakeCase(col);
        });

        const result = await query(
          `INSERT INTO ${table} (${statements.join(', ')}) VALUES (${placeholders.join(', ')}) ${suffix} RETURNING *`,
          queryData,
          opts
        );

        return result.rowCount > 0 ? result.rows[0] : result.rows;
      };

      const findOne = async (where, params = [], opts = {}) => {
        const result = await query(
          `SELECT * FROM ${table} WHERE ${where} LIMIT 1`,
          params,
          opts
        );

        return result.rowCount > 0 ? result.rows[0] : null;
      };

      return {
        async delete(where, params = [], opts = {}) {
          const result = await query(
            `DELETE FROM ${table} WHERE ${where} RETURNING *`,
            params,
            opts
          );

          return result.rowCount > 0 ? result.rows[0] : null;
        },
        async find(queryObject = {}, fields = []) {
          const whereStatement = _.keys(queryObject).map((key, i) => {
            const col = key.includes('_') ? key : _.snakeCase(key);
            return _.isArray(queryObject[key]) ? `${col} = ANY($${i + 1})` : `${col} = $${i + 1}`;
          }).join(' AND ');
          const cols = fields.length > 0 ? fields.map(col => _.snakeCase(col)).join(', ') : '*';
          const result = await query(
            `SELECT ${cols} FROM ${table} ${whereStatement.length ? `WHERE ${whereStatement}` : ''}`, _.values(queryObject));

          return result.rows;
        },
        findOne,
        async getById(id, opts = {}) {
          const result = await query(`SELECT * FROM ${table} WHERE id = $1 LIMIT 1`, [id], opts);

          return result.rowCount > 0 ? result.rows[0] : null;
        },
        async getAll(...fields) {
          const cols = fields.length > 0 ? fields.map(col => _.snakeCase(col)).join(', ') : '*';
          const result = await query(`SELECT ${cols} FROM ${table}`);

          return result.rows;
        },
        insert(data = {}, opts = {}) {
          return doInsert(data, '', opts);
        },
        async insertIfNotExists(data = {}, where, params = [], opts = {}) {
          const existing = await findOne(where, params, opts);
          if (existing !== null) {
            return existing;
          }

          return doInsert(data, '', opts);
        },
        async update(data = {}, where, params = [], opts = {}) {
          const { id, ...rest } = data;
          const cols = _.keys(rest);
          let queryData = _.values(rest);
          let paramNo = 1;
          const statements = cols.map(col => `${_.snakeCase(col)} = $${paramNo++}`);
          const whereStatement = where.replace(/\$[0-9]+/g, () => `$${paramNo++}`);
          queryData = queryData.concat(params);

          const result = await query(
            `UPDATE ${table} SET ${statements.join(', ')} WHERE ${whereStatement} RETURNING *`,
            queryData,
            opts
          );

          return result.rowCount > 0 ? result.rows[0] : result.rows;
        }
      };
    }
  };
};

