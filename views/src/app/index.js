import React from 'react';
import { render } from 'react-dom';

import { Header } from "./components/Header";
import { Home } from "./components/Home";

class App extends React.Component {

    render() {
        let searchData = {

        };
        return (
            <div>
                <div className="jumbotron">
                    <h1>
                        BitReturn
                    </h1>
                </div>
            </div>
        );
    }
}

render(<App />, window.document.getElementById('app'));