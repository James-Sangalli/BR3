var env = process.env.NODE_ENV || 'development'
var config = require('./knexfile.js')
var knex = require('knex')(config[env])

module.exports = {
  getCharities:() => {
    return knex("approvedCharitiesTable").select("charityAddress")
  },

  paymentDb:(paymentObj) => {
    return knex("payments").insert({value:paymentObj.value,
      address:paymentObj.address,
      charity:paymentObj.charity,
      tx:paymentObj.tx
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
