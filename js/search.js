let request = require("superagent");

$(function() {

  $("#searchButton").click(function(){

    console.log("local api initiated");
    let searchTerm = $("#searchBox").val().toString();

    request
      .get("http://localhost:3000/search/" + searchTerm)
      .send(searchTerm)
      .end(function(err,res){    // get a response back about the result
        if (err) throw err;
        console.log(res.text); //response data from server with sql data
        if(res.text == null || res.text == "")
        {
            alert("No Results found");
        }
        else
        {
            for(result of res.text)
            {
                $("#searchResults").addClass("col-md-4").append(
                    "<h2>" + result.Charity_Name + "</h2>").append("<p>" + result.charityAddress + "</p>");
            }

        }

      })
    });

});
