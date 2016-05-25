exports.up = function(knex, Promise) {
  console.log('create table')

  return knex.schema.createTableIfNotExists('BR3', function(table) {
    table.increments('id')
    table.string('tx').unique()
    table.string('value')
    table.string('charityAddress')
    table.string('donorAddress')
    table.string('date')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('BR3').then(function () {
    console.log('BR3 table was dropped')
  })
};
