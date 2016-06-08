var express = require('express'),
    app = express(),
    config = require('./knex/knexfile.js'),
    env = process.env.NODE_ENV || 'development',
    dotenv = require("dotenv"),
    knex = require('knex')(config[env]),
    bodyParser = require('body-parser'),
    year = new Date().getFullYear(),
    password = process.env.password,
    db = require("./knex/db"),
    request = require('superagent'),
    Limiter = require('api-client-limiter'),
    limit = new Limiter(300, 60000); //blockr api only allows 300 calls per minute

app.use(express.static(__dirname));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(3000,  () => {
  console.log('listening on port ', 3000);
});

getPrice(0);

function getPrice(time){
  setTimeout(() => {
    request.get("https://blockchain.info/ticker",(err,data) => {
      console.log("bitcoin price: $NZD", data.body.NZD.buy)
      getPrice(60000) //checks price every ten minutes
    })
  },time)
}

findCharities() //starts of the process

function findCharities(){
  db.getCharities()
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
    limit(request.get(query, (req,res) => {
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
            getDonor(dataObj) //gets only inputs (donations) and not outputs (spends)
          }
        }
      }
    }))
  }
}

function getDonor(dataObj){
  var query = "http://btc.blockr.io/api/v1/tx/info/"+dataObj.tx;
  limit(request.get(query,(err,data) => {
    var donor = data.body.data.vins[0].address
    payTo(dataObj,donor)
  }))
}

function payTo(dataObj,donor){
  console.log("donation found!", dataObj.tx)
  //values that are spent are negative, we only want to take in donations or positive values
  db.searchPayments(dataObj.tx)
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
    res.send(200, " Payment completed!")
  })
}

function addPaymentToDB(value,address,charity,tx){

  var paymentObj = {
    value:value,
    address:address,
    charity:charity,
    tx:tx
  }

  db.paymentDb(paymentObj)
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
  db.search(searchTerm)
  .then((data) => {
    res.send(data.body)
  })
  .catch((err) => {
    console.log("Error! ",err)
    if(err) throw err
  })
})


module.exports = app;
