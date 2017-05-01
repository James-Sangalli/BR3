let dotenv = require("dotenv");
dotenv.load();
let express = require('express');
let app = express();
let config = require('./knex/knexfile.js');
let env = process.env.NODE_ENV || 'development';
let knex = require('knex')(config[env]);
let bitreturnPaymentAddress = "1HhZVRtuTdfvfVFy5t3dGuindGUUFuRQUP";
let db = require("./knex/db");
let govtAddress = process.env.PUBLIC_KEY;
let privateKey = process.env.PRIVATE_KEY;
let bitcore = require("bitcore-lib");


app.listen(3001,  () => {
  console.log('listening on port ', 3001);
  findPayees();
});

function findPayees()
{
  db.findUnpaid()
  .then( (data) =>
  {
    for(record of data)
    {
      paid(record.tx);
      let paymentAmount = record.value * 0.33;
      payout(paymentAmount , record.address);
      payout(paymentAmount * 0.01, bitreturnPaymentAddress);
    }
  })
  .catch( (err) =>
  {
    if (err) throw err;
  })
}

function paid(tx)
{
  db.paid(tx)
  .then( (data) => {
    console.log("paid tax rebate ", tx);
  })
  .catch( (err) =>
  {
    if (err) throw err;
  });
}

// function payout(value,address) {
//   let query = "http://localhost:3000/merchant/$guid/payment?password=$" +
//   + password + "&to=$" + address + "&" +
//   "amount=$" + value + "&api_code=$"+ apiCode + "&note=$" + "BitReturn tax rebate from BitReturn.com"
//
//   request.get(query,(req,res) => {
//     console.log("Here is the data back from the server: ", res.body)
//     return;
//   })
// }

function payout(value, address)
{
    let tx = new bitcore.Transaction()
        .from(govtAddress)
        //value plus miner fee
        .to(address, (value + 0.0005))
        .change(govtAddress)
        .sign(privateKey);

    let txSerialized = tx.serialize();

    insight.broadcast(txSerialized, function (error, body) {
        if (error) {
            throw console.error();
        }
    });
}
