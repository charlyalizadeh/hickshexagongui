import { Component } from "react";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


class PresetSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            presetValue: props.presetValue,
        };
    }

    handleChange = (event) => {
        this.setState({ presetValue: event.target.value });
    }
    handleClick = (event) => {
        this.props.handleClick(this.state.presetValue);
    }


    render() {
        let menuItems = []
        for(let i = 0; i < this.props.presetsName.length; i++) {
            menuItems.push(<MenuItem key={`${this.props.presetsName[i]}`} value={i}>{this.props.presetsName[i]}</MenuItem>)
        }
        return (
            <Card style={{display:"flex", flexDirection: "row", justifyContent: "center", alignItems: "stretch"}} variant="outlined">
                <CardContent style={{display: "flex", justifyContent: "center"}}>
                    <Select
                       labelId="label-preset-select"
                       id="preset-select"
                       value={this.state.presetValue}
                       label="Preset"
                       onChange={this.handleChange}>
                       {menuItems}
                    </Select>
                </CardContent>
                <span style={{display: "flex", justifyContent: "center"}}>
                    <Button onClick={this.handleClick} className="saveDimButton" variant="contained">Apply</Button>
                </span>
            </Card>
        )
    }
}

export default PresetSelect;
