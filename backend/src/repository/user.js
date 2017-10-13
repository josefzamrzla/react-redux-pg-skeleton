export default (db) => {
  const tableName = '"user"';
  const table = db.table(tableName); // must be quoted because of PG
  return {
    table,
    getById: () => new Promise(resolve => resolve({ id: 1001, username: 'joe' }))

  };
};
