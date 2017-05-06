import { Search } from "./components/Search";
import { render } from 'react-dom';

class App extends React.Component
{
    render()
    {
        return(
            <div className="container">
                <div className="jumbotron">
                    <h1>
                        BitReturn
                    </h1>
                </div>
                <div className="row">
                    <div className="col-xs-10 col-xs-offset-1">
                        <Search/>
                    </div>
                </div>
            </div>

        );
    }

}

render(<App />, window.document.getElementById('app'));