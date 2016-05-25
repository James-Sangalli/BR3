var express = require('express')
var app = express()
var config = require('./bitreturn-knex/knexfile.js')
var env = process.env.NODE_ENV || 'development'
var knex = require('knex')(config[env])
var bodyParser = require('body-parser')
var request = require("superagent")
var port = process.ENV.port || 3000

var path = require("path")
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(__dirname));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port,  () => {
  console.log('listening on port ', port);
});

app.post("/payment",(req,res) => {

  res.header( 'Access-Control-Allow-Origin','*' );
  var query = "http://localhost:3000/merchant/$guid/payment?password=$" +
  + req.body.password + "&to=$" + req.body.to + "&" +
  "amount=$" + req.body.amount + "&from=$" + "&note=$" + "BitReturn tax rebate from BitReturn.com"

  res.header( 'Access-Control-Allow-Origin','*' );

  request.get(query,(err,data) => {
    console.log("here's the data I got from the API", data.text)
    res.send(data)
  })
})

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

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = date + ' ' + month + ' ' + year + ' ';
  return time;
}

module.exports = app;
