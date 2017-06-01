import React from "react";

export class Header extends React.Component {
    render()
    {
        return (
            <div>

                {/*<div className="jumbotron">*/}
                    {/*<h1>*/}
                        {/*BitReturn*/}
                    {/*</h1>*/}
                {/*</div>*/}

                <nav className="navbar navbar-default">
                    <div className="container">
                        <div className="navbar-header">
                            <ul className="nav navbar-nav">
                                <li><a href="">Home</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>

            </div>
        );
    }
}