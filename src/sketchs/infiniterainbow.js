class Circle {
    constructor(p5, image, origin, outline_props) {
        this.p5 = p5;
        this.image = image;
        this.origin = origin;
        this.outline_props = outline_props;
    }

    draw() {
        for(let i = this.outline_props.length - 1; i >= 0; i--) {
            this.image.strokeWeight(0);
            this.image.fill(this.outline_props[i]['fill']);
            this.image.circle(this.origin.x, this.origin.y,  this.outline_props[i]['accumulated_radius']);
        }
    }

}

class InfiniteRainbowDrawer {
    constructor(p5, image, outline_props) {
        this.p5 = p5;
        this.image = image;
        this.outline_props = outline_props;
        this.compute_accumulated_radius();
        this.circle_template = new Circle(
            p5, image,
            this.p5.createVector(0, 0),
            outline_props
        )
        this.width_offset = this.get_width_offset();
        this.height_offset = this.get_height_offset();
        this.between_line_offset = this.get_between_line_offset();
    }

    get_width_offset() {
        return this.accumulated_radius;
    }
    get_height_offset() {
        return this.accumulated_radius / 4;
    }
    get_between_line_offset() {
        return this.accumulated_radius / 2;
    }
    update_offsets() {
        this.width_offset = this.get_width_offset();
        this.height_offset = this.get_height_offset();
        this.between_line_offset = this.get_between_line_offset();
    }
    update_circle_template_outline_props() {
        this.circle_template.outline_props = this.outline_props.slice();
    }
    compute_accumulated_radius() {
        this.accumulated_radius = 0;
        for(let i = 0; i < this.outline_props.length; i++) {
            this.outline_props[i]['accumulated_radius'] = this.outline_props[i]['radius'] + this.accumulated_radius;
            this.accumulated_radius += this.outline_props[i]['radius'];
        }
    }
    update_fill() {
        this.update_circle_template_outline_props();
    }
    update_radius() {
        this.compute_accumulated_radius()
        this.update_offsets();
        this.update_circle_template_outline_props();
    }

    add_outline() {
        this.outline_props.push(
            {'fill': 'black', 'radius': 10}
        )
        this.update_radius();
    }
    rem_outline() {
        this.outline_props = this.outline_props.splice(0, this.outline_props.length - 1);
        this.update_radius();
    }


    draw() {
        this.p5.clear();
        this.circle_template.origin.x = 0;
        this.circle_template.origin.y = 0;
        let i = 0;
        while(this.circle_template.origin.y < this.image.height + this.accumulated_radius) {
            while(this.circle_template.origin.x < this.image.width + this.accumulated_radius) {
                this.circle_template.draw();
                this.circle_template.origin.x += this.width_offset;
            }
            this.circle_template.origin.y += this.height_offset;
            if(i % 2 == 0) {
                this.circle_template.origin.x = 0;
            }
            else {
                this.circle_template.origin.x = this.between_line_offset;
            }
            i++;
        }
    }
}

export default InfiniteRainbowDrawer;
