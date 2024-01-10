import React, { Component } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


class SaveImage extends Component {
    render() {
        let saveDimInput = [
            <TextField key="widthDimInput" label="Width" variant="outlined" className="saveDimInput" onChange={(event) => {this.props.widthHandler(event.target.value)}}/>,
            <TextField key="heightDimInput" label="Height" variant="outlined" className="saveDimInput" onChange={(event) => {this.props.heightHandler(event.target.value)}}/>,
        ]
        return (
            <Card style={{display:"flex", alignItems: "stretch"}} variant="outlined">
                <CardContent style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <span style={{display: "flex", justifyContent: "center"}}>
                        {saveDimInput[0]}{saveDimInput[1]}
                    </span>
                </CardContent>
                    <span style={{display: "flex", justifyContent: "center"}}>
                        <Button onClick={this.props.saveHandler} className="saveDimButton" variant="contained">Save</Button>
                    </span>
            </Card>
        )
    }
}

export default SaveImage;
