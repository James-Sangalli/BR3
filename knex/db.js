let env = process.env.NODE_ENV || 'development';
let config = require('./knexfile.js');
let knex = require('knex')(config[env]);

module.exports = {
  getCharities:function() {
    return knex("approvedCharitiesTable").select("charityAddress")
  },

  paymentDb:function(paymentObj) {
    return knex("payments").insert({
      value:paymentObj.value,
      address:paymentObj.address,
      charity:paymentObj.charity,
      tx:paymentObj.tx,
      unixDatePaid:paymentObj.unixDatePaid,
      datePaid:paymentObj.datePaid
    })
  },

  search: function(searchTerm) {
    return knex('approvedCharitiesTable').select().where("Charity_Name",
    "LIKE","%" + searchTerm + "%");
  },

  searchPayments:function (tx) {
    return knex("payments").select().where("tx",tx);
  },

  findAll: function() {
    return knex('payments').select();
  },

  findUnpaid: function() {
    return knex('payments').select().where("paid",false);
  },

  paid: function(tx) {
    return knex('payments').update("paid",true).where("tx",tx);
  }

};
