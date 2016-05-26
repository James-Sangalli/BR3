var express = require('express')
var app = express()
var config = require('./knex/knexfile.js')
var env = process.env.NODE_ENV || 'development'
var knex = require('knex')(config[env])
var bodyParser = require('body-parser')
var request = require("superagent")
var port = 3000
var time = 10000 //10 seconds
var year = new Date().getFullYear()

var path = require("path")
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(__dirname));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port,  () => {
  console.log('listening on port ', port);
});

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
      res.header( 'Access-Control-Allow-Origin','*' );
      console.log("here is the response from the api: ", req)
      if(res.body.time_utc.substring(0,3) > year - 5){
        //only selects donations that were done less than 5 years ago
        var dataObj = {
          value: res.body.value,
          charity:address.charityAddress,
          tx:res.body.tx
        }
        getDonor(data)
      }
    })
  }
}

function getDonor(dataObj){
  var query = "https://blockchain.info/rawtx/"+data.tx+"/$tx_hash"
  res.header( 'Access-Control-Allow-Origin','*' );
  request.get(query,(err,data) => {
    console.log("here is the tx data from blockchain.info: ", data)
    var donor = data.body.inputs[0].prev_out.addr
    payTo(dataObj,donor)
  })
}

function payTo(dataObj,donor){
  if(value > 0){
    //values that are spent are negative, we only want to take in donations or positive values
    knex("payment").select().where("tx",dataObj.tx)
    .then((data) => {
      if(data){
        console.log("payment already made")
      }
      else{
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
    + req.body.password + "&to=$" + req.body.to + "&" +
    "amount=$" + req.body.amount + "&from=$" + "&note=$" + "BitReturn tax rebate from BitReturn.com"

    res.header( 'Access-Control-Allow-Origin','*' );

    request.get(query,(err,data) => {
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
