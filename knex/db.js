var env = process.env.NODE_ENV || 'test'
var config = require('./knexfile.js')
var knex = require('knex')(config[env])

module.exports = {
  getCharities:() => {
    return knex("approvedCharitiesTable").select("charityAddress")
  },

  paymentDb:(paymentObj) => {
    return knex("payments").insert({value:paymentDb.value,
      address:paymentDb.address,
      charity:paymentDb.charity,
      tx:paymentDb.tx
    })
  },

  search:(searchTerm) => {
    return knex('approvedCharitiesTable').select().where("Charity_Name",
    "like","%" + searchTerm + "%");
  },

  searchPayments:(tx) => {
    return knex("payments").select().where("tx",tx);
  }

}
