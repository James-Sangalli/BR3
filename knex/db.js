var env = process.env.NODE_ENV || 'development'
var config = require('./knexfile.js')
var knex = require('knex')(config[env])

module.exports = {
  getCharities:() => {
    return knex("approvedCharitiesTable").select("charityAddress")
  },

  paymentDb:(paymentObj) => {
    return knex("payments").insert({
      value:paymentObj.value,
      address:paymentObj.address,
      charity:paymentObj.charity,
      tx:paymentObj.tx,
      unixDatePaid:paymentObj.unixDatePaid,
      datePaid:paymentObj.datePaid
    })
  },

  search:(searchTerm) => {
    return knex('approvedCharitiesTable').select().where("Charity_Name",
    "like","%" + searchTerm + "%");
  },

  searchPayments:(tx) => {
    return knex("payments").select().where("tx",tx);
  },

  findAll: () => {
    return knex('payments').select();
  },

  findUnpaid: () => {
    return knex('payments').select().where("paid",false);
  },

  paid: (tx) => {
    return knex('payments').update("paid",true).where("tx",tx);
  }

}
