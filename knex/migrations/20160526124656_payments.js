
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('payments', function(table) {
    table.increments('id')
    table.string('value')
    table.string('address')
    table.string('charity')
    table.string("tx").unique()
    table.boolean("paid").defaultTo(false)
    table.string("unixDatePaid")
    table.string("datePaid")
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('payments').then(function () {
    console.log('payments table was dropped')
  })
};
