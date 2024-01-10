import { Component } from "react";
import Sketch from "react-p5";
import InfiniteRainbowDrawer from "./sketchs/infiniterainbow.js";
import OutlineConfig from "./components/infiniterainbow/OutlineConfig.js"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SaveImage from './components/SaveImage.js'
import PresetSelect from './components/PresetSelect.js'


let drawer = null;


class InfiniteRainbowApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            outlines: [],
            prevOutlineProps: [],
            presetSelect: null,
            widthSavePNG: 0,
            heightSavePNG: 0,
            saveImage: null,
            presets: [
                [
                    {'fill': '#3AA6B9', 'radius': 30},
                    {'fill': '#FFD0D0', 'radius': 30},
                    {'fill': '#FF9EAA', 'radius': 30},
                    {'fill': '#C1ECE4', 'radius': 30},
                ],
                [
                    {'fill': '#C2DEDC', 'radius': 20},
                    {'fill': '#ECE5C7', 'radius': 30},
                    {'fill': '#CDC2AE', 'radius': 40},
                    {'fill': '#116A7B', 'radius': 50},
                    {'fill': 'white', 'radius': 3},
                ],
                [
                    {'fill': '#FFFAD7', 'radius': 50},
                    {'fill': '#FF2171', 'radius': 10},
                ],
                [
                    {'fill': 'black', 'radius': 20},
                    {'fill': '#CDC2AE', 'radius': 5},
                    {'fill': '#41644A', 'radius': 30},
                    {'fill': '#CDC2AE', 'radius': 5},
                    {'fill': '#263A29', 'radius': 30},
                    {'fill': '#CDC2AE', 'radius': 5},
                ],
            ]
        }
    }

    componentDidMount = () => {
        document.title = "Infinite Rainbow";
        this.setState({
            saveImage: <SaveImage
                            widthHandler={(value) => this.setState({widthSavePNG: value})}
                            heightHandler={(value) => this.setState({heightSavePNG: value})}
                            saveHandler={() => this.savePNG()}
                        />,
            presetSelect: <PresetSelect
                                presetsName={[
                                    "Rainbow 1",
                                    "Rainbow 2",
                                    "Rainbow 3",
                                    "Rainbow 4",
                                ]}
                                presetValue={0}
                                handleClick={this.handlePresetChange}
                            />
        })
    }

    handlePresetChange = (value) => {
        let preset = this.state.presets[value];
        drawer.outline_props = JSON.parse(JSON.stringify(preset))
        drawer.update_radius();
        this.setState(
            {
                outlines: []
            },
            () => {
                this.setupOutline();
                drawer.draw();
                this.setPrevProps();
            }
        )
    }


    setup = (p5, canvasParentRef) => {
        // use parent to render the canvas in this ref
        // (without that p5 will render the canvas outside of your component)
        p5.createCanvas(900, 700).parent(canvasParentRef);
        let outline_props = [
            {'fill': '#3AA6B9', 'radius': 30},
            {'fill': '#FFD0D0', 'radius': 30},
            {'fill': '#FF9EAA', 'radius': 30},
            {'fill': '#C1ECE4', 'radius': 30},
        ];
        drawer = new InfiniteRainbowDrawer(
            p5,
            p5,
            outline_props
        );
        this.setupOutline();
        drawer.draw();
        this.setPrevProps();
    }
    draw = (p5) => {
        if(this.has_update()) {
            drawer.draw();
            this.setPrevProps();
        }
    }
    updateOutlineRadius = (i, radius) => {
        radius = radius == 0 ? 1 : radius;
        drawer.outline_props[i]['radius'] = radius;
        drawer.update_radius();
    }
    updateOutlineFill = (i, fill) => {
        drawer.outline_props[i]['fill'] = fill;
    }
    setupOutline = () => {
        let tempOutlines = this.state.outlines.slice();
        // If too many outline ui
        if(this.state.outlines.length > drawer.outline_props.length) {
            tempOutlines = tempOutlines.slice(0, this.state.outlines.length - 1);
        }
        // Else if the good number of ui not enough
        else {
            for(let i = 0; i < drawer.outline_props.length; i++) {
                if(i > this.state.outlines.length - 1) {
                    let currentOutline = <OutlineConfig
                                            id={i}
                                            key={`Outline ${i}`}
                                            title={`Outline ${i}`}
                                            fill={drawer.outline_props[i]['fill']}
                                            radius={drawer.outline_props[i]['radius']}
                                            fillHandler={this.updateOutlineFill}
                                            radiusHandler={this.updateOutlineRadius}
                                        />
                    tempOutlines.push(currentOutline)
                }
            }
        }
        this.setState({outlines: tempOutlines})
    }
    has_update = () => {
        if(drawer === null) { return false; }
        return JSON.stringify(this.state.prevOutlineProps) !== JSON.stringify(drawer.outline_props);
    }
    setPrevProps = () => {
        this.setState({
            prevOutlineProps: JSON.parse(JSON.stringify(drawer.outline_props))
        })
    }
    addOutline = () => {
        drawer.add_outline();
        this.setupOutline();
    }
    remOutline = () => {
        drawer.rem_outline();
        this.setupOutline();
    }

    savePNG = () => {
        let width = parseInt(this.state.widthSavePNG);
        let height = parseInt(this.state.heightSavePNG);
        if(typeof width !== 'number' || typeof height !== 'number') {
            return;
        }
        let image = drawer.p5.createGraphics(width, height);
        let outline_props = JSON.parse(JSON.stringify(drawer.outline_props));
        let tempDrawer = new InfiniteRainbowDrawer(drawer.p5, image, outline_props);
        tempDrawer.draw();
        image.save("infiniterainbow.png");
        drawer.draw();
    }

    render() {
        return (
            <div>
                <span style={{display: "flex", flexDirection: "row"}}>
                    <Sketch id="InfiniteRainbowSketch" setup={this.setup} draw={this.draw}/>
                    <Card style={{backgroundColor:"#3e4554", display:"flex", alignItems: "stretch"}} variant="outlined">
                        <CardContent style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                            <div>
                                <Typography style={{color:"white", display: "flex", justifyContent: "center"}} variant="h4">Outlines</Typography>
                                {this.state.outlines}
                                <span style={{display: "flex", justifyContent: "center"}}>
                                    <Button variant="contained" onClick={this.addOutline}>+</Button>
                                    <Button variant="contained" onClick={this.remOutline}>-</Button>
                                </span>
                            </div>
                            <div style={{display: "flex", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                            {this.state.presetSelect}
                            </div>
                            {this.state.saveImage}
                        </CardContent>
                    </Card>
                </span>
            </div>
        )
    }
}

export default InfiniteRainbowApp;
