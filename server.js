var express = require('express')
var app = express()
var config = require('./knex/knexfile.js')
var env = process.env.NODE_ENV || 'development'
var dotenv = require("dotenv")
var knex = require('knex')(config[env])
var bodyParser = require('body-parser')
var year = new Date().getFullYear()
var password = process.env.password
var request = require('superagent')

app.use(express.static(__dirname));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port,  () => {
  console.log('listening on port ', port);
});

request.get("https://blockchain.info/ticker",(err,data) => {
  console.log("Today's bitcoin price: $NZD", data.body.NZD.buy)
})

findCharities() //starts of the process

setTimeout(() => {
  findCharities()
}, 61000); //checks every minute and 1 second

function findCharities(){
  knex("approvedCharitiesTable").select("charityAddress")
  .then((data) => {
    scanBlockchain(data)
  })
  .catch((err) => {
    if (err){
      console.log("Error ", err)
      throw err
    }
  })
}

function scanBlockchain (addresses) {
  for(address of addresses){
    var query = "http://btc.blockr.io/api/v1/address/txs/" + address.charityAddress
    request.get(query, (req,res) => {
      var length = res.body.data.txs.length
      for(i=0;i<length;i++){
        var transaction = res.body.data.txs[i]
        if(transaction.time_utc.substring(0,4) > year - 5){
          //only selects donations that were done less than 5 years ago
          var dataObj = {
            value: transaction.amount,
            charity:address.charityAddress,
            tx:transaction.tx
          }
          if(dataObj.value > 0){
            getDonor(dataObj)
          }
          else{
            console.log("this is a spend not a donation")
          }
        }
      }
    })
  }
}

function getDonor(dataObj){
  var query = "http://btc.blockr.io/api/v1/tx/info/"+dataObj.tx;
  request.get(query,(err,data) => {
    var donor = data.body.data.vins[0].address
    payTo(dataObj,donor)
  })
}

function payTo(dataObj,donor){
  console.log("donation found!", dataObj.tx)
  //values that are spent are negative, we only want to take in donations or positive values
  knex("payments").select().where("tx",dataObj.tx)
  .then((data) => {
    if(data){
      console.log("Paying out to donor: ", donor)
      payout(dataObj.value,donor)
      addPaymentToDB(dataObj.value,donor,dataObj.charity,dataObj.tx)
    }
    else{
      console.log(data) //assumes payout has already been made
    }
  })
  .catch((err) => {
    if (err.errno == 19) {
      console.log("Payment already completed")
    }
    else{
      throw err
    }
  })
}

function payout(value,address){
  var query = "http://localhost:3000/merchant/$guid/payment?password=$" +
  + password + "&to=$" + address + "&" +
  "amount=$" + value + "&from=$" + "&note=$" + "BitReturn tax rebate from BitReturn.com"

  app.post(query,(req,res) => {
    res.header( 'Access-Control-Allow-Origin','*' )
    console.log("Here is the data back from the server: ", res)
    res.send("Payment completed!")
  })
}

function addPaymentToDB(value,address,charity,tx){
  knex("payments").insert({value:value,
    address:address,
    charity:charity,
    tx:tx
  })
  .then((data) => {
    console.log("Payment record added to DB, ID: ", data)
  })
  .catch((err) => {
    if (err){
      console.log("Error ", err)
      throw err
    }

  })
}

app.post("/search/:searchTerm",(req,res) => {
  res.header( 'Access-Control-Allow-Origin','*' );
  var searchTerm = req.params.searchTerm
  knex('approvedCharitiesTable').select().where("charityAddress","like","%" + searchTerm + "%")
  .then((data) => {
    console.log("Sucess!!",data)
  })
  .catch((err) => {
    console.log("Error! ",err)
  })
  // send to client
  res.send(data.body)
})


module.exports = app;
