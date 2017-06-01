let test = require("tape")
let app = require("../server")
let request = require("superagent")
let db = require("../knex/db")

test('tests db functions', function(t) {
  db.getCharities()
  .then((data) => {
      t.true(typeof data, Object, "returns a charity address object")
      t.end()
  })
});

// let charities = {
//   first:"Sean's OutPost"
// }
//
// test('tests search function', function(t) {
//   request(app)
//     .get('/search/' + charities.first)
//     .expect(200)
//     .end(function(err, res) {
//       t.false(err)
//       t.true(JSON.parse(res.body))
//       t.end()
//     })
// });
