let express = require('express'),
    app = express(),
    config = require('./knex/knexfile.js'),
    env = process.env.NODE_ENV || 'development',
    knex = require('knex')(config[env]),
    bodyParser = require('body-parser'),
    db = require("./knex/db");

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(8000,  () => {
  console.log('listening on port ', 8000);
});

app.post("/search/:searchTerm",(req,res) => {
  res.header( 'Access-Control-Allow-Origin','*' );
  let searchTerm = req.params.searchTerm
  db.search(searchTerm)
  .then((data) => {
    res.send(data.body)
  })
  .catch((err) => {
    console.log("Error! ",err)
    if(err) throw err
  })
})
