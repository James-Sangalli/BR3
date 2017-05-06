let request = require("superagent");

$(function() {

  $("#searchButton").click(function(){

    console.log("local api initiated");
    let searchTerm = $("#searchBox").val().toString();

    request
      .post("http://localhost:8000/search/"+searchTerm)
      .send(searchTerm)
      .end(function(err,res){    // get a response back about the result
        if (err) throw err;
        console.log(res.text); //response data from server with sql data
        $("#results").val(res.text); //renders to search page
      })
    });

});
