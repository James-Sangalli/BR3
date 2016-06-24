module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './knex/dev.sqlite3'
    }
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: './Tests/test.sqlite3'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
