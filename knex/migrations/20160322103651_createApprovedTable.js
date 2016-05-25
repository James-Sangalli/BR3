exports.up = function(knex, Promise) {
  console.log('create table')

  return knex.schema.createTableIfNotExists('approvedCharitiesTable', function(table) {
    table.increments('id')
    table.string('charityAddress').unique()
    table.string('Charity_Name').unique()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('approvedCharitiesTable').then(function () {
    console.log('approvedCharitiesTable table was dropped')
  })
};
