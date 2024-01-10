import React, { Component } from 'react';
import Card from '@mui/material/Card';
import { MuiColorInput } from 'mui-color-input'
import InputSlider from '../InputSlider.js'




class OutlineConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fill: props.fill,
            radius: props.radius,
            stroke: props.stroke,
            strokeWeight: props.strokeWeight,
        }
    }
    handleChangeFill = (fill) => {
        this.setState({fill: fill});
        this.props.fillHandler(this.props.id, fill);
    }
    handleChangeRadius = (radius) => {
        this.setState({radius: radius})
        this.props.radiusHandler(this.props.id, radius);
    }


    render() {
        return (
        <Card sx={{ minWidth: 275 }}>
            <span style={{display: "flex", flexDirection: "row", justifyContent: "space-between", "alignItems": "center"}}>
                <MuiColorInput
                    isAlphaHidden={true}
                    value={this.state.fill}
                    onChange={this.handleChangeFill}
                />
                <InputSlider
                    fill={this.state.fill}
                    value={this.state.radius}
                    minValue={1}
                    maxValue={100}
                    onChange={this.handleChangeRadius}
                />
            </span>
        </Card>
        );
    };
}

export default OutlineConfig;
