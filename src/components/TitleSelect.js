import React, {Component} from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


class TitleSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
        }
    }

    handleChange = (event) => {
        this.setState({ title: event.target.value });
        this.props.handleChange(event.target.value);

    }


    render() {
        return (
                <FormControl>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={this.state.title}
                        label=""
                        onChange={this.handleChange}
                        style={{color: "#FFFFFF", fontSize: 50}}
                    >
                    <MenuItem value={"Hicks' Hexagon"}>Hicks' Hexagon</MenuItem>
                    <MenuItem value={"Infinite Rainbow"}>Infinite Rainbow</MenuItem>
                    </Select>
                </FormControl>
        );
    }
}

export default TitleSelect;
