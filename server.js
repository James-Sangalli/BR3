let express = require('express'),
    app = express(),
    config = require('./knex/knexfile.js'),
    env = process.env.NODE_ENV || 'development',
    knex = require('knex')(config[env]),
    bodyParser = require('body-parser'),
    year = new Date().getFullYear(),
    date = new Date(),
    db = require("./knex/db"),
    limit = require("simple-rate-limiter"),
    //blockr can only handle <300 calls per minute
    request = limit(require("superagent")).to(3).per(1000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(8080, function () {
  console.log('listening on port ', 8080);
});

findCharities();

request("https://blockchain.info/ticker",function (err,data) {
  console.log("bitcoin price: $USD", data.body.USD.buy)
});

function findCharities(){
  db.getCharities()
  .then(function(data) {
    getCharity(data)
  })
  .catch(function (err) {
    if (err){
      console.log("Error ", err)
      throw err
    }
  })
}

function getCharity (addresses) {
  for(address of addresses){
    let charity = address.charityAddress
    getDonations(charity)
  }
}

function getDonations(charity){
  let query = "http://btc.blockr.io/api/v1/address/txs/" + charity
  request(query, function (req,res) {
    let length = res.body.data.txs.length
    for(i=0;i<length;i++){
      let transaction = res.body.data.txs[i]
      if(transaction.time_utc.substring(0,4) > year - 5){
        //only selects donations that were done less than 5 years ago
        let dataObj = {
          value: transaction.amount,
          charity:charity,
          tx:transaction.tx,
          unixDatePaid:date.getTime(), //unix time
          datePaid:date
        }
        if(dataObj.value > 0){
          getDonor(dataObj) //gets only inputs (donations) and not outputs (spends)
        }
      }
    }
  })
}

function getDonor(dataObj){
  let query = "http://btc.blockr.io/api/v1/tx/info/"+dataObj.tx;
  request(query, function (err,data) {
    let donor = data.body.data.vins[0].address
    payTo(dataObj,donor)
  })
}

function payTo(dataObj,donor){
  console.log("donation found!", dataObj.tx)
  //values that are spent are negative, we only want to take in donations or positive values
  db.searchPayments(dataObj.tx)
  .then(function (data) {
    if(data[0])
    {
      console.log("donation already processed")
      /*do nothing as donation rebate has already been handled*/
    }
    else{
      console.log("Adding donation to db ", donor);
      addPaymentToDB(dataObj)
    }
  })
  .catch(function (err) {
    if (err.errno === 19) {
      console.log("Payment already completed")
    }
    else{
      throw err
    }
  })
}

function addPaymentToDB(paymentObj){

  db.paymentDb(paymentObj)
  .then(function(data)  {
    console.log("Payment record added to DB, ID: ", data)
  })
  .catch(function(err)  {
    if (err){
      console.log("Error ", err);
      throw err
    }

  })
}

module.exports = app;
