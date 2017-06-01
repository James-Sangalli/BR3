import React from "react";

export class Home extends React.Component
{
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
                    <button type="search" id="searchButton" className="btn-success">Search</button>
                    <div id="searchResults">
                        <li>
                            {this.props.searchData.map(searchEntry,i, () => { document.createElement("entry" + i).value(searchEntry)})}
                        </li>
                    </div>
                </div>
            </div>
        );
    }
}

//Good practise to prevent type problems as JS has dynamic variables
Home.propTypes = {
    searchData:Object
};

