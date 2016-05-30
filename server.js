var express = require('express')
var app = express()
var config = require('./knex/knexfile.js')
var env = process.env.NODE_ENV || 'development'
var dotenv = require("dotenv")
var knex = require('knex')(config[env])
var bodyParser = require('body-parser')
var port = 3000
var time = 1000 //1 second
var year = new Date().getFullYear()
var password = process.env.password
var price
var request = require('superagent')

var path = require("path")
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(__dirname));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port,  () => {
  console.log('listening on port ', port);
});

request.get("https://blockchain.info/ticker",(err,data) => {
  price = data.body.NZD.buy
  console.log("Today's bitcoin price: $NZD", data.body.NZD.buy)
})

setTimeout(function(){
  findCharities() //checks every time set interval
}, time);


function findCharities(){
  knex("approvedCharitiesTable").select("charityAddress")
  .then((data) => {
    console.log("Send to scanBlockchain()")
    scanBlockchain(data)
  })
  .catch((err) => {
    if (err){
      console.log("Error ", err)
      throw err
    }
  })
}

function scanBlockchain(addresses){
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
          getDonor(dataObj)
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
  if(dataObj.value > 0){
    //values that are spent are negative, we only want to take in donations or positive values
    knex("payment").select().where("tx",dataObj.tx)
    .then((data) => {
      if(data){
        console.log("payment already made")
      }
      else{
        console.log("Paying out to donor: ", donor)
        payout(dataObj.value,donor)
        addPaymentToDB(dataObj.value,donor,dataObj.charity,dataObj.tx)
      }
    })
    .catch((err) => {
      if (err) {
        console.log("Error ", err)
        throw err
      }
    })
  }
  else{
    console.log("Not counted as this was a spent not a donation")
  }
}

function payout(value,address){
  app.post("/payment",(req,res) => {

    res.header( 'Access-Control-Allow-Origin','*' );
    var query = "http://localhost:3000/merchant/$guid/payment?password=$" +
    + password + "&to=$" + address + "&" +
    "amount=$" + value + "&from=$" + "&note=$" + "BitReturn tax rebate from BitReturn.com"

    app.get(query,(err,data) => {
      console.log("here's the data I got from the API", data.text)
      console.log("payment made!")
      res.send(data)
    })
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
  res.json(data.body)
})


module.exports = app;
