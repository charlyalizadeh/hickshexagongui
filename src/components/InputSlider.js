// source: https://mui.com/material-ui/react-slider/
import React, { Component } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';


const Input = styled(MuiInput)`
  width: 42px;
`;


class InputSlider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: props.value,
        }
        this.handleSliderChange = this.handleSliderChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleSliderChange(event, newValue) {
        if(newValue < this.props.minValue) { newValue = this.props.minValue; }
        else if(newValue > this.props.maxValue) { newValue = this.props.maxValue; }
        this.setState({value: newValue});
        this.props.onChange(this.state.value);
    };
    handleInputChange(event) {
        let newValue = event.target.value === '' ? '' : Number(event.target.value)
        if(newValue !== '') {
            if(newValue < this.props.minValue) { newValue = this.props.minValue; }
            else if(newValue > this.props.maxValue) {newValue = this.props.maxValue; }
        }
        this.setState({value: newValue});
        this.props.onChange(newValue);
    };
    handleBlur() {
        if (this.state.value < this.props.minValue) {
            this.setState({value: this.props.minValue})
            this.props.onChange(this.props.minValue);
        } else if (this.state.value > this.props.maxValue) {
            this.setState({value: this.props.maxValue})
            this.props.onChange(this.props.maxValue);
        }
    };

    render() {
        return (
            <Box sx={{ width: 250 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                        <Slider
                            value={typeof this.state.value === 'number' ? this.state.value : this.props.minValue}
                            onChange={this.handleSliderChange}
                            aria-labelledby="input-slider"
                            color="primary"
                            inputprops={{min: this.props.minValue, max: this.props.maxValue}}
                        />
                        </Grid>
                        <Grid item>
                        <Input
                            value={this.state.value}
                            size="small"
                            onChange={this.handleInputChange}
                            onBlur={this.handleBlur}
                            inputProps={{
                                step: 1,
                                min: this.props.minValue,
                                max: this.props.maxValue,
                                type: 'number',
                                'aria-labelledby': 'input-slider',
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>
        );
    }
}

export default InputSlider;
