var dotenv = require("dotenv");
dotenv.load();
var express = require('express'),
    app = express(),
    config = require('./knex/knexfile.js'),
    env = process.env.NODE_ENV || 'development',
    knex = require('knex')(config[env]),
    password = process.env.password,
    username = process.env.username,
    request = require("superagent"),
    apiCode = process.env.apiCode,
    bitreturnPayment = "1HhZVRtuTdfvfVFy5t3dGuindGUUFuRQUP",
    db = require("./knex/db")

app.listen(3001,  () => {
  console.log('listening on port ', 3001);
  findPayees();
});

function findPayees(){
  db.findUnpaid()
  .then( (data) => {
    for(record of data){
      paid(record.tx)
      payout(record.value * 0.33 , record.address)
    }
  })
  .catch( (err) => {
    if (err) throw err
  })
}

function paid(tx){
  db.paid(tx)
  .then( (data) => {
    console.log("paid tax rebate ", tx)
  })
  .catch( (err) => {
    if (err) throw err;
  })
}

function payout(value,address) {
  var query = "http://localhost:3000/merchant/$guid/payment?password=$" +
  + password + "&to=$" + address + "&" +
  "amount=$" + value + "&api_code=$"+ apiCode + "&note=$" + "BitReturn tax rebate from BitReturn.com"

  request.get(query,(req,res) => {
    console.log("Here is the data back from the server: ", res.body)
    payFee(value * 0.005); //0.5% fee on each transaction
    return;
  })
}

function payFee(value){
  var query = "http://localhost:3000/merchant/$guid/payment?password=$" +
  + password + "&to=$" + bitreturnPayment + "&" +
  "amount=$" + value + "&api_code=$"+ apiCode + "&note=$" + "BitReturn Fee"

  request.get(query,(req,res) => {
    console.log("Paid fee to BitReturn!")
    return;
  })
}
