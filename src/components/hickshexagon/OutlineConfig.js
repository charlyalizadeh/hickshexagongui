import React, { Component } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { MuiColorInput } from 'mui-color-input'
import InputSlider from '../InputSlider.js'




class OutlineConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: props.color,
            size: props.size,
        }
    }
    handleChangeColor = (color) => {
        this.setState({color: color});
        this.props.colorHandler(this.props.id, color);
    }
    handleChangeSize = (size) => {
        this.setState({size: size})
        this.props.sizeHandler(this.props.id, size);
    }


    render() {
        return (
        <Card sx={{ minWidth: 275 }}>
            <span style={{display: "flex", flexDirection: "row", justifyContent: "space-between", "alignItems": "center"}}>
                <MuiColorInput
                    isAlphaHidden={true}
                    value={this.state.color}
                    onChange={this.handleChangeColor}
                />
                <InputSlider
                    color={this.state.color}
                    value={this.state.size}
                    minValue={1}
                    maxValue={100}
                    onChange={this.handleChangeSize}
                />
            </span>
        </Card>
        );
    };
}

export default OutlineConfig;
