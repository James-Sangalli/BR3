var dotenv = require("dotenv");
dotenv.load();
var express = require('express'),
    app = express(),
    config = require('./knex/knexfile.js'),
    env = process.env.NODE_ENV || 'development',
    knex = require('knex')(config[env]),
    password = process.env.password,
    username = process.env.username,
    apiCode = process.env.apiCode,
    prompt = require('prompt'),
    bitreturnPayment = "1HhZVRtuTdfvfVFy5t3dGuindGUUFuRQUP",
    bodyParser = require('body-parser'),
    year = new Date().getFullYear(),
    db = require("./knex/db"),
    limit = require("simple-rate-limiter"),
    //blockr can only handle <300 calls per minute
    request = limit(require("superagent")).to(3).per(1000);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(8080,  () => {
  console.log('listening on port ', 8080);
});

findCharities();

request("https://blockchain.info/ticker",(err,data) => {
  console.log("bitcoin price: $USD", data.body.USD.buy)
})

function findCharities(){
  db.getCharities()
  .then((data) => {
    getCharity(data)
  })
  .catch((err) => {
    if (err){
      console.log("Error ", err)
      throw err
    }
  })
}

function getCharity (addresses) {
  for(address of addresses){
    var charity = address.charityAddress
    getDonations(charity)
  }
}

function getDonations(charity){
  var query = "http://btc.blockr.io/api/v1/address/txs/" + charity
  request(query, (req,res) => {
    var length = res.body.data.txs.length
    for(i=0;i<length;i++){
      var transaction = res.body.data.txs[i]
      if(transaction.time_utc.substring(0,4) > year - 5){
        //only selects donations that were done less than 5 years ago
        var dataObj = {
          value: transaction.amount,
          charity:charity,
          tx:transaction.tx
        }
        if(dataObj.value > 0){
          getDonor(dataObj) //gets only inputs (donations) and not outputs (spends)
        }
      }
    }
  })
}

function getDonor(dataObj){
  var query = "http://btc.blockr.io/api/v1/tx/info/"+dataObj.tx;
  request(query,(err,data) => {
    var donor = data.body.data.vins[0].address
    payTo(dataObj,donor)
  })
}

function payTo(dataObj,donor){
  console.log("donation found!", dataObj.tx)
  //values that are spent are negative, we only want to take in donations or positive values
  db.searchPayments(dataObj.tx)
  .then((data) => {
    if(data[0]){
      console.log("donation already processed")
      /*do nothing as donation rebate has already been handled*/
    }
    else{
      console.log("Paying out to donor: ", donor)
      addPaymentToDB(dataObj.value,donor,dataObj.charity,dataObj.tx)
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

setTimeout( () => {
  prompt.start();
  prompt.get(['confirm_payments'], (err, result) => {
      result.confirm_payments.toLowerCase()
      if(result.confirm_payments == "yes" || result.confirm_payments == "y"){
        db.findAll()
        .then( (data) => {
          payout(data[0].value, data[0].address)
        })
        .catch( (err) => {
          if(err){
            console.log(err)
            throw err;
          }
        })
      }
      else throw "no confirmation, program halted";
  });
},2000) //asks if want to pay every 10 minutes

function payout(value,address){
  var query = "http://localhost:3000/merchant/$guid/payment?password=$" +
  + password + "&to=$" + address + "&" +
  "amount=$" + value + "&api_code=$"+ apiCode + "&note=$" + "BitReturn tax rebate from BitReturn.com"

  request(query,(req,res) => {
    console.log("Here is the data back from the server: ", res)
    payFee(value * 0.005); //0.5% fee on each transaction
    res.send(200, " Payment completed!")
  })
}

function payFee(value){
  var query = "http://localhost:3000/merchant/$guid/payment?password=$" +
  + password + "&to=$" + bitreturnPayment + "&" +
  "amount=$" + value + "&api_code=$"+ apiCode + "&note=$" + "BitReturn Fee"

  request(query,(req,res) => {
    console.log("Paid fee to BitReturn!")
    res.send(200, " Fee Paid!")
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
