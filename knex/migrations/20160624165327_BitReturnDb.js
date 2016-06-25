
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('approvedCharitiesTable', function(table) {
    table.increments('id')
    table.string('charityAddress').unique()
    table.string('Charity_Name').unique()
  })

  return knex.schema.createTableIfNotExists('payments', function(table) {
    table.increments('id')
    table.string('value')
    table.string('address')
    table.string('charity')
    table.string("tx").unique()
    table.boolean("paid").defaultTo(false)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('approvedCharitiesTable').then(function () {
    console.log('approvedCharitiesTable table was dropped')
  })
  return knex.schema.dropTableIfExists('payments').then(function () {
    console.log('payments table was dropped')
  })
};
