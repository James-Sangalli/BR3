var test = require("tape")
var app = require("../js/server.js")
var request = require("superagent")
var $ = require("jquery")
var index = require("../js/index.js")

test('get /v1/latestdata returns an object with the property value time', function(t) {
  request(app)
    .get('/v1/latestdata')
    .expect(200)
    .end(function(err, res) {
      t.false(err)
      t.true(JSON.parse(res.body).hasOwnProperty('time'))
      t.end()
    })
});

test("tests index functions", function(t){

  index.verifySig(address,signature,message,function(err,data){
    t.true(data, "signature should be valid and return true")
    t.end()
  })

  index.scriptToAddress(script,function(err,data){
    t.equal(data.toString,"1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN","should return the address 1HZwkjkeaoZfTSaJxDw6aKkxp45agDiEzN")
    t.end()
  })

});
