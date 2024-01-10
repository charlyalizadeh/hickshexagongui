import { Component } from "react";
import HicksHexagonApp from "./HicksHexagonApp.js"
import InfiniteRainbowApp from "./InfiniteRainbowApp.js"
import TitleSelect from "./components/TitleSelect.js"
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            app: "Hicks' Hexagon"
        }
    }

    handleChangePattern = (value) => {
        this.setState({ app: value });
    }


    render() {
        let app = null;
        switch(this.state.app) {
            case "Hicks' Hexagon":
                app = <HicksHexagonApp/>;
                break;
            case "Infinite Rainbow":
                app = <InfiniteRainbowApp/>;
                break;
        }
        return (
            <div className="App" style={{display: "flex", flexDirection: "column"}}>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <TitleSelect title={this.state.app} handleChange={this.handleChangePattern}/>
                </div>
                {app}
            </div>
        );
    }
}

export default App;
