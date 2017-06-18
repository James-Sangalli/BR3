import React from "react";
import db from "../../../../knex/db";

export class Home extends React.Component
{
    constructor()
    {
        super();
        this.state = {}
    }

    static getResultsFromDB(searchTerm)
    {
        let searchResults = db.search(searchTerm);

        if(searchResults != null)
        {
            for(index in searchResults)
            {
                document.getElementById("results").appendChild("result" + index)
                    .value(searchResults[index]);
            }
        }

        this.setState = searchResults;

        return searchResults;
    }

    render()
    {
        return(
            <div id="page">
                <h3>
                    Search for bitcoin charities
                </h3>
                <div id="search form">
                    <div className="form-group">
                        <div id="inputForm">
                            <p>
                                If you are a registered charity that accepts bitcoin and
                                you are not registered with BitReturn,
                                email as at btcverifiednz@gmail.com
                            </p>
                            <input id="searchBox" type ="text" name="searchBox" className="form-control"/>
                        </div>
                    </div>
                </div>
                <div className="twelve columns">
                    <button type="search" id="searchButton" className="btn-success" onClick={this.getResultsFromDB(document.getElementById("searchBox").valueOf())}>Search</button>
                    <div id="searchResults">
                        <li id="results">
                            {this.state.Charity_Name}
                        </li>
                    </div>
                </div>
            </div>
        );
    }
}

//Good practise to prevent type problems as JS has dynamic variables
// Home.propTypes = {
//     searchData:Object
// };

