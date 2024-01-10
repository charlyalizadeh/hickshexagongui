import { Component } from "react";
import Sketch from "react-p5";
import HicksHexagonDrawer from "./sketchs/hickshexagon.js";
import OutlineConfig from "./components/hickshexagon/OutlineConfig.js";
import HexagonConfig from "./components/hickshexagon/HexagonConfig.js";
import SaveImage from "./components/SaveImage.js";
import PresetSelect from "./components/PresetSelect.js";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';


let drawer = null;


class HicksHexagonApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hexagon: null,
            outlines: [],
            widthSavePNG: 0,
            heightSavePNG: 0,
            saveImage: null,
            presetValue: 0,
            presetSelect: null,
            prevHexagonProps: {
                'dim': [],
                'color': "",
            },
            prevOutlineProps: {
                'size': [],
                'color': [],
            },
            presets: [
                {
                    'hexagon_props': { 'dim': [26, 14, 8], 'color': '#981F24' },
                    'outline_props': { 'size': [14, 7], 'color': ['black', '#DF5F18'] }
                },
                {
                    'hexagon_props': { 'dim': [26, 14, 8], 'color': '#9c8a70' },
                    'outline_props': { 'size': [6, 4, 3], 'color': ['#5a5d57', '#686d66', '#5b8c7a'] }
                },
                {
                    'hexagon_props': { 'dim': [75, 14, 14], 'color': '#8D6500' },
                    'outline_props': { 'size': [3, 6, 3, 16], 'color': ['#FBE6C1', '#4A6726', '#C6D3B5', '#242C1A'] }
                },
            ]
        }
    }

    componentDidMount = () => {
        document.title = "Hicks' Hexagon";
        this.setState({
            saveImage: <SaveImage
                            widthHandler={(value) => this.setState({widthSavePNG: value})}
                            heightHandler={(value) => this.setState({heightSavePNG: value})}
                            saveHandler={() => this.savePNG()}
                        />,
            presetSelect: <PresetSelect
                                presetsName={[
                                    "The Shining",
                                    "Preset 1",
                                    "Preset 2"
                                ]}
                                presetValue={0}
                                handleClick={this.handlePresetChange}
                            />
        })
    }
    handlePresetChange = (value) => {
        let preset = this.state.presets[value];
        drawer.hexagon_props = JSON.parse(JSON.stringify(preset['hexagon_props']));
        drawer.outline_props = JSON.parse(JSON.stringify(preset['outline_props']));
        drawer.setup_props();
        this.setState(
            {
                hexagon: null,
                outlines: []
            },
            () => {
                this.setupHexagon();
                this.setupOutline();
                drawer.draw();
                this.setPrevProps();
            }
        );
    }
    has_update = () => {
        if(drawer === null) { return false; }
        return JSON.stringify(this.state.prevHexagonProps['dim']) !== JSON.stringify(drawer.hexagon_props['dim']) ||
            JSON.stringify(this.state.prevHexagonProps['color']) !== JSON.stringify(drawer.hexagon_props['color']) ||
            JSON.stringify(this.state.prevOutlineProps['size']) !== JSON.stringify(drawer.outline_props['size']) ||
            JSON.stringify(this.state.prevOutlineProps['color']) !== JSON.stringify(drawer.outline_props['color']);
    }
    setPrevProps = () => {
        this.setState({
            prevHexagonProps: JSON.parse(JSON.stringify(drawer.hexagon_props)),
            prevOutlineProps: JSON.parse(JSON.stringify(drawer.outline_props))
        })
    }
    setup = (p5, canvasParentRef) => {
        // use parent to render the canvas in this ref
        // (without that p5 will render the canvas outside of your component)
        p5.createCanvas(900, 700).parent(canvasParentRef);
        let hexagon_props = {
            'dim': [26, 14, 8],
            'color': '#981F24'
        }
        let outline_props = {
            'size': [14, 7],
            'color': ['black', '#DF5F18']
        }
        drawer = new HicksHexagonDrawer(p5, p5, hexagon_props, outline_props);
        this.setupHexagon();
        this.setupOutline();
        drawer.draw();
        this.setPrevProps();
    }
    updateOutlineSize = (i, size) => {
        size = size == 0 ? 1 : size;
        drawer.outline_props['size'][i] = size;
        drawer.update_props();
    }
    updateOutlineColor = (i, color) => {
        drawer.outline_props['color'][i] = color;
        drawer.update_props();
    }
    updateHexagonWidth = (width) => {
        width = width == 0 ? 1 : width;
        drawer.hexagon_props['dim'][0] = width;
        drawer.update_props();
    }
    updateHexagonHeight = (height) => {
        height = height == 0 ? 1 : height;
        drawer.hexagon_props['dim'][1] = height;
        drawer.update_props();
    }
    updateHexagonTriangleHeight = (height) => {
        height = height == 0 ? 1 : height;
        drawer.hexagon_props['dim'][2] = height;
        drawer.update_props();
    }
    updateHexagonColor = (color) => {
        drawer.hexagon_props['color'] = color;
        drawer.update_props();
    }
    setupHexagon = () => {
        this.setState({hexagon: <HexagonConfig
            width={drawer.hexagon_props['dim'][0]}
            height={drawer.hexagon_props['dim'][1]}
            triangleHeight={drawer.hexagon_props['dim'][2]}
            color={drawer.hexagon_props['color']}
            colorHandler={this.updateHexagonColor}
            widthHandler={this.updateHexagonWidth}
            heightHandler={this.updateHexagonHeight}
            triangleHeightHandler={this.updateHexagonTriangleHeight}
        />});
    }
    setupOutline = () => {
        let tempOutlines = this.state.outlines.slice();
        // If too many outline ui
        if(this.state.outlines.length > drawer.outline_props['color'].length / 2) {
            tempOutlines = this.state.outlines.slice(0, this.state.outlines.length - 1);
        }
        // Else if the good number of ui not enough
        else {
            for(let i = 0; i < drawer.outline_props['color'].length / 2; i++) {
                if(i > this.state.outlines.length - 1) {
                    let currentOutline = <OutlineConfig
                                            id={i}
                                            key={`Outline ${i}`}
                                            title={`Outline ${i}`}
                                            color={drawer.outline_props['color'][i]}
                                            size={drawer.outline_props['size'][i]}
                                            sizeHandler={this.updateOutlineSize}
                                            colorHandler={this.updateOutlineColor}
                                        />
                    tempOutlines.push(currentOutline)
                }
            }
        }
        this.setState({outlines: tempOutlines})
    }
    addOutline = () => {
        drawer.add_outline(5, 'black');
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
        let hexagon_props = {
            'dim': drawer.hexagon_props['dim'],
            'color': drawer.hexagon_props['color']
        }
        let outline_props = {
            'size': drawer.outline_props['size'].slice(0, Math.ceil(drawer.n_outline / 2)),
            'color': drawer.outline_props['color'].slice(0, Math.ceil(drawer.n_outline / 2))
        }
        let tempDrawer = new HicksHexagonDrawer(drawer.p5, image, hexagon_props, outline_props)
        tempDrawer.draw();
        image.save("hickshexagon.png");
        drawer.draw();
    }
    draw = (p5) => {
        if(this.has_update()) {
            drawer.draw();
            this.setPrevProps();
        }
    }

    render() {
        return (
            <div>
                <span style={{display: "flex", flexDirection: "row"}}>
                    <Sketch id="HicksHexagonSketch" setup={this.setup} draw={this.draw} />
                    <Card style={{backgroundColor:"#3e4554", display:"flex", alignItems: "stretch"}} variant="outlined">
                        <CardContent style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                                <div>
                                    <Typography style={{color:"white", display: "flex", justifyContent: "center"}} variant="h4">Hexagon</Typography>
                                    {this.state.hexagon}

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
        );
    }
}

export default HicksHexagonApp;
