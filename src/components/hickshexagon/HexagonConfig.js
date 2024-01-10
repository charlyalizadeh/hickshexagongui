import React, { Component } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { MuiColorInput } from 'mui-color-input'
import InputSlider from '../InputSlider.js'


class HexagonConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "Hicks' Hexagon",
            color: props.color,
            width: props.width,
            height: props.height,
            triangleHeight: props.triangleHeight
        }
    }

    handleChangeColor = (color) => {
        this.setState({color: color});
        this.props.colorHandler(color);
    }
    handleChangeWidth = (width) => {
        this.setState({width: width})
        this.props.widthHandler(width);
    }
    handleChangeHeight = (height) => {
        this.setState({height: height})
        this.props.heightHandler(height);
    }
    handleChangeTriangleHeight = (triangleHeight) => {
        this.setState({triangleHeight: triangleHeight})
        this.props.triangleHeightHandler(triangleHeight);
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
                <div>
                    <div>
                        <Typography variant="h6"> Width  </Typography>
                        <InputSlider
                            color={this.state.color}
                            value={this.state.width}
                            minValue={1}
                            maxVallue={100}
                            onChange={this.handleChangeWidth}
                        />
                    </div>
                    <div>
                        <Typography variant="h6"> Height  </Typography>
                        <InputSlider
                            color={this.state.color}
                            value={this.state.height}
                            minValue={1}
                            maxVallue={100}
                            onChange={this.handleChangeHeight}
                        />
                    </div>
                    <div>
                        <Typography variant="h6"> Triangle height  </Typography>
                        <InputSlider
                            color={this.state.color}
                            value={this.state.triangleHeight}
                            minValue={1}
                            maxVallue={100}
                            onChange={this.handleChangeTriangleHeight}
                        />
                    </div>
                </div>
            </span>
        </Card>
        );
    };
}

export default HexagonConfig;
