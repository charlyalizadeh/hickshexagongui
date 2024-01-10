function line_intersection(p5, p1, p2, p3, p4) {
    let x_num = (p1.x*p2.y - p1.y*p2.x) * (p3.x - p4.x) - (p1.x - p2.x) * (p3.x*p4.y - p3.y*p4.x);
    let x_den = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);

    let y_num = (p1.x*p2.y - p1.y*p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x*p4.y - p3.y*p4.x);
    let y_den = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
    return p5.createVector(x_num / x_den, y_num / y_den);
}

class Line {
    constructor(p5, image, p1, p2) {
        this.p5 = p5;
        this.image = image;
        this.p1 = p1;
        this.p2 = p2;
    }
    get vector() {
        let vect = this.p5.createVector(this.p2.x - this.p1.x, this.p2.y - this.p1.y)
        if(vect.x < 0) {
            vect.mult(-1);
        }
        return vect;

    }
    intersect(line) {
        return line_intersection(this.p5, this.p1, this.p2, line.p1, line.p2)
    }
    draw() {
        this.image.line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    }
}

class Hexagon {
    constructor(p5, image, origin, width, height, triangle_height) {
        this.p5 = p5;
        this.p5Vector = p5.constructor.Vector;
        this.image = image;
        this.origin = origin;
        this.width = width;
        this.height = height;
        this.triangle_height = triangle_height;

        this.update_value();
    }
    update_value() {
        this.down_right = this.p5Vector.add(this.origin, this.p5.createVector(this.width, this.height));
        this.down_left = this.p5Vector.add(this.origin, this.p5.createVector(0, this.height));
        this.up_right = this.p5Vector.add(this.origin, this.p5.createVector(this.width, 0));
        this.up = this.p5Vector.add(this.origin, this.p5.createVector(this.width / 2, -this.triangle_height));
        this.down = this.p5Vector.add(this.origin, this.p5.createVector(this.width / 2, this.height + this.triangle_height));
        this.v1 = this.p5.createVector(
            this.p5.abs(this.down_right.x - this.origin.x),
            this.p5.abs(this.down_right.y - this.origin.y)
        );
        this.v2 = this.p5.createVector(
            this.p5.abs(this.up_right.x - this.down_left.x),
            -this.p5.abs(this.up_right.y - this.down_left.y)
        );
    }
    norm_vector_up_left() {
        let norm_vector = this.p5Vector.sub(this.up, this.origin);
        norm_vector.x += norm_vector.y;
        norm_vector.y = norm_vector.x - norm_vector.y;
        norm_vector.x -= norm_vector.y;
        norm_vector.y = -norm_vector.y;
        norm_vector.normalize();
        return norm_vector;
    }
    norm_vector_up_right() {
        let norm_vector = this.norm_vector_up_left();
        norm_vector.x = -norm_vector.x;
        return norm_vector;
    }
    norm_vector_down_right() {
        return this.norm_vector_up_left().mult(-1);
    }
    norm_vector_down_left() {
        let norm_vector = this.norm_vector_up_left();
        norm_vector.y = -norm_vector.y;
        return norm_vector;
    }
    outline_line_up_left(outline_size) {
        let offset_vector = this.norm_vector_up_left().mult(outline_size);
        let p1 = this.p5Vector.add(this.up, offset_vector);
        let p2 = this.p5Vector.add(this.origin, offset_vector);
        return new Line(this.p5, this.image, p1, p2);
    }
    outline_line_up_right(outline_size) {
        let offset_vector = this.norm_vector_up_right().mult(outline_size);
        let p1 = this.p5Vector.add(this.up, offset_vector);
        let p2 = this.p5Vector.add(this.up_right, offset_vector);
        return new Line(this.p5, this.image, p1, p2);
    }
    outline_line_left(outline_size) {
        let p1 = this.origin.copy();
        p1.x -= outline_size;
        let p2 = this.down_left.copy();
        p2.x -= outline_size;
        return new Line(this.p5, this.image, p1, p2)
    }
    outline_line_right(outline_size) {
        let p1 = this.up_right.copy();
        p1.x += outline_size;
        let p2 = this.down_right.copy();
        p2.x += outline_size;
        return new Line(this.p5, this.image, p1, p2)
    }
    outline_line_down_left(outline_size) {
        let offset_vector = this.norm_vector_down_left().mult(outline_size);
        let p1 = this.p5Vector.add(this.down_left, offset_vector);
        let p2 = this.p5Vector.add(this.down, offset_vector);
        return new Line(this.p5, this.image, p1, p2);
    }
    outline_line_down_right(outline_size) {
        let offset_vector = this.norm_vector_down_right().mult(outline_size);
        let p1 = this.p5Vector.add(this.down_right, offset_vector);
        let p2 = this.p5Vector.add(this.down, offset_vector);
        return new Line(this.p5, this.image, p1, p2);
    }
    outline_edge(outline_size) {
        let line_up_left = this.outline_line_up_left(outline_size);
        let line_up_right = this.outline_line_up_right(outline_size);
        let line_left = this.outline_line_left(outline_size);
        let line_right = this.outline_line_right(outline_size);
        let line_down_left = this.outline_line_down_left(outline_size);
        let new_origin = line_intersection(this.p5,
            line_up_left.p1, line_up_left.p2,
            line_left.p1, line_left.p2
        );
        let new_up_right = line_intersection(this.p5,
            line_up_right.p1, line_up_right.p2,
            line_right.p1, line_right.p2
        )
        let new_width = new_up_right.x - new_origin.x;
        let new_down_left = line_intersection(this.p5,
            line_down_left.p1, line_down_left.p2,
            line_left.p1, line_left.p2
        )
        let new_height = new_down_left.y - new_origin.y;
        let new_up = line_intersection(this.p5,
            line_up_right.p1, line_up_right.p2,
            line_up_left.p1, line_up_left.p2
        )
        let new_triangle_height = new_origin.y - new_up.y;
        return new Hexagon(this.p5, this.image, new_origin, new_width, new_height, new_triangle_height);
    }
    draw_vertices() {
        this.image.point(this.up);
        this.image.point(this.down);
        this.image.point(this.origin);
        this.image.point(this.up_right);
        this.image.point(this.down_left);
        this.image.point(this.down_right);
    }
    fill_correct_offset_up(color) {
        this.image.stroke(color)
        this.image.strokeWeight(1)
        this.image.strokeCap(this.p5.SQUARE)
        this.image.line(this.down_left.x + 0.6, this.down_left.y, this.down_right.x - 0.6, this.down_right.y)
    }
    fill_correct_offset_down(color) {
        this.image.stroke(color)
        this.image.strokeWeight(1)
        this.image.strokeCap(this.p5.SQUARE)
        this.image.line(this.origin.x + 0.6, this.origin.y, this.up_right.x - 0.6, this.up_right.y)
    }
    fill_correct_offset(color) {
        this.fill_correct_offset_up(color)
        this.fill_correct_offset_down(color)
    }
    fill(color) {
        this.fill_correct_offset(color)
        this.image.noStroke()
        this.image.fill(color);
        this.image.rect(this.origin.x, this.origin.y, this.width, this.height);
        this.image.triangle(
            this.origin.x,
            this.origin.y,

            this.up_right.x,
            this.up_right.y,

            this.up.x,
            this.up.y
        );
        this.image.triangle(
            this.down_left.x,
            this.down_left.y,

            this.down_right.x,
            this.down_right.y,

            this.down.x,
            this.down.y
        );
    }
    fill_up_limit(color, limit) {
        if(limit <= this.up.y) {
            this.fill(color);
            return;
        }
        this.fill_correct_offset(color)
        this.image.noStroke()
        this.image.fill(color);
        this.image.rect(this.origin.x, this.origin.y, this.width, this.height);

        if(limit < this.origin.y) {
            // COMPUTE ORIGIN SHIFT
            // Compute the distance between the upper rect and the limit
            let dist = this.origin.y - limit;
            // Get the shift vector
            let v1 = this.outline_line_up_left(1).vector
            v1.mult((-dist) / v1.y)
            let origin_shift = this.p5Vector.add(this.origin, v1);

            // Compute up_right shift
            let v2 = this.outline_line_up_right(1).vector // Get the shift vector
            v2.mult((-dist) / v2.y)
            let up_right_shift = this.p5Vector.add(this.up_right, v2);

            this.image.quad(
                this.origin.x,
                this.origin.y,

                this.up_right.x,
                this.up_right.y,


                up_right_shift.x,
                up_right_shift.y,

                origin_shift.x,
                origin_shift.y,
            );
        }
        this.image.triangle(
            this.down_left.x,
            this.down_left.y,

            this.down_right.x,
            this.down_right.y,

            this.down.x,
            this.down.y
        );
    }
}


class HicksHexagonDrawer {
    constructor(p5, image, hexagon_props, outline_props) {
        this.p5 = p5;
        this.image = image;
        this.hexagon_props = hexagon_props;
        this.outline_props = outline_props;

        this.setup_add_outline_mirror()
        this.n_outline = this.outline_props['size'].length;
        this.setup_add_outline_width()
        this.setup_save_template_hexagons()
        this.n_hexagon = this.hexagons_template.length;
        this.setup_compute_offset_x()
        this.setup_compute_offset_y()
        this.setup_compute_offset_row()
        this.setup_add_line_height()

        let last_hexagon = this.hexagons_template[this.n_hexagon - 1];
        this.padding_x = 2 * last_hexagon.width;
        this.padding_y = 2 * (last_hexagon.height + last_hexagon.triangle_height * 2);
    }
    setup_add_outline_mirror() {
        let temp_size_reversed = this.outline_props['size'].slice();
        temp_size_reversed.reverse();
        let temp_color_reversed = this.outline_props['color'].slice();
        temp_color_reversed.reverse();
        this.outline_props['size'] = this.outline_props['size'].concat(temp_size_reversed);
        this.outline_props['color'] = this.outline_props['color'].concat(temp_color_reversed);
    }
    setup_add_outline_width() {
        this.outline_props['width'] = [];
        for(let i = 0; i < this.outline_props['size'].length; i++) {
            if(i == 0) {
                this.outline_props['width'].push(this.outline_props['size'][i]);
            }
            else {
                this.outline_props['width'].push(this.outline_props['size'][i] * 2 + this.outline_props['width'][i - 1]);
            }
        }
    }
    setup_save_template_hexagons() {
        this.hexagons_template = [new Hexagon(this.p5, this.image,
            this.p5.createVector(0, 0),
            this.hexagon_props['dim'][0],
            this.hexagon_props['dim'][1],
            this.hexagon_props['dim'][2],
        )];
        for(let i = 0; i < this.outline_props['size'].length; i++) {
            let hexagon = this.hexagons_template[i].outline_edge(this.outline_props['size'][i]);
            this.hexagons_template.push(hexagon);
        }
    }
    setup_add_line_height() {
        this.outline_props['line_height'] = [];
        this.outline_props['line_reverse_height'] = [];
        for(let i = 0; i <= this.outline_props['size'].length - 1; i++) {
            let offset_vector = this.hexagons_template[this.n_hexagon - i - 1].outline_line_up_right(1).vector;
            offset_vector.mult((this.hexagons_template[this.n_hexagon - i - 1].width / 2) / offset_vector.x);

            let upper_point = this.hexagons_template[this.n_hexagon - i - 1].up.copy()
            upper_point.add(-this.offset_x, -this.offset_y)
            upper_point.add(offset_vector)
            let line_reverse_height = -(this.hexagons_template[0].up.y - upper_point.y);

            this.outline_props['line_reverse_height'].push(
                line_reverse_height
            )

            if(i == 0) {
                let temp_hexagon = this.hexagons_template[this.n_hexagon - 2];
                // TODO: Easier way to compute this but I'm tired
                let height = (temp_hexagon.up.y) - (temp_hexagon.up.y - this.offset_row + temp_hexagon.triangle_height + temp_hexagon.height / 2 + this.hexagons_template[0].height / 2 + this.hexagons_template[0].triangle_height)
                this.outline_props['line_height'].push(height);
            }
            else {
                this.outline_props['line_height'].push(0);
            }
        }
    }
    setup_compute_offset_x() {
        this.offset_x = this.hexagon_props['dim'][0] / 2 - this.outline_props['size'][0] / 2;
        for(let i = 0; i < this.outline_props['size'].length; i++) {
            this.offset_x += this.outline_props['size'][i];
        }
    }
    setup_compute_offset_y() {
        let offset_vector = this.hexagons_template[2].outline_line_down_right(1).vector;
        offset_vector.mult(this.offset_x / offset_vector.x);
        let last_hexagon = this.hexagons_template[this.n_hexagon - 1];
        this.temp_jsp = this.hexagons_template[0].down.y - last_hexagon.up.y;
        this.offset_y = this.temp_jsp + offset_vector.y;
    }
    setup_compute_offset_row() {
        let last_hexagon = this.hexagons_template[this.n_hexagon - 1];
        let before_last_hexagon = this.hexagons_template[this.n_hexagon - 2];
        let offset_vector = last_hexagon.outline_line_up_right(1).vector;
        offset_vector.mult((last_hexagon.width / 2 - this.outline_props['size'][0] / 2) / offset_vector.x)
        this.temp_offset_vector = offset_vector;
        this.offset_row = (before_last_hexagon.down.y + this.offset_y) - (last_hexagon.up.y + offset_vector.y) - 0.2
    }
    setup_props() {
        this.setup_add_outline_mirror()
        this.n_outline = this.outline_props['size'].length;
        this.setup_add_outline_width()
        this.setup_save_template_hexagons()
        this.n_hexagon = this.hexagons_template.length;
        this.setup_compute_offset_x()
        this.setup_compute_offset_y()
        this.setup_compute_offset_row()
        this.setup_add_line_height()

        let last_hexagon = this.hexagons_template[this.n_hexagon - 1];
        this.padding_x = 2 * last_hexagon.width;
        this.padding_y = 2 * (last_hexagon.height + last_hexagon.triangle_height * 2);
    }
    update_props() {
        this.outline_props['size'] = this.outline_props['size'].splice(0, Math.ceil(this.n_outline / 2))
        this.outline_props['color'] = this.outline_props['color'].splice(0, Math.ceil(this.n_outline / 2))
        this.setup_props();
    }
    add_outline(size, color) {
        this.outline_props['size'] = this.outline_props['size'].splice(0, Math.ceil(this.n_outline / 2))
        this.outline_props['color'] = this.outline_props['color'].splice(0, Math.ceil(this.n_outline / 2))
        this.outline_props['size'].push(size);
        this.outline_props['color'].push(color);
        this.setup_props();
    }

    rem_outline() {
        this.outline_props['size'] = this.outline_props['size'].splice(0, Math.ceil(this.n_outline / 2) - 1)
        this.outline_props['color'] = this.outline_props['color'].splice(0, Math.ceil(this.n_outline / 2) - 1)
        this.setup_props();
    }


    draw_hexagon(x, y, add_outer_outline=true, reverse=false) {
        // Main hexagon
        let hexagon = new Hexagon(this.p5, this.image,
            this.p5.createVector(x, y),
            this.hexagon_props['dim'][0],
            this.hexagon_props['dim'][1],
            this.hexagon_props['dim'][2],
        )
        let hexagons = [];

        // Build the outlines
        let current_hexagon = hexagon;
        let offset_outline = add_outer_outline ? 0 : 1;
        for(let i = 0; i < this.outline_props['size'].length - offset_outline; i++) {
            current_hexagon = current_hexagon.outline_edge(this.outline_props['size'][i])
            hexagons.push(current_hexagon);
        }

        // Draw the outline
        let line_y = hexagon.down.y;
        let line_height = this.outline_props['line_height'];
        if(reverse) {
            line_y = hexagon.up.y;
            line_height = this.outline_props['line_reverse_height'];;
        }
        for(let i = hexagons.length - 1; i >= 0; i--) {
            let temp_x = x + hexagon.width / 2 - this.outline_props['width'][i] / 2;
            this.image.fill(this.outline_props['color'][i]);
            if(reverse) {
                hexagons[i].fill_up_limit(this.outline_props['color'][i], line_y + line_height[line_height.length - 1] + 5);
            }
            else {
                hexagons[i].fill(this.outline_props['color'][i]);
            }
            this.image.rect(temp_x, line_y, this.outline_props['width'][i], line_height[i]);
        }


        this.image.fill(this.hexagon_props['color']);
        hexagon.fill(this.hexagon_props['color']);
    }
    draw_up_down_hexagons() {
        let x = -this.padding_x;
        let y = -this.padding_y;
        while(y < this.image.height + this.padding_y) {
            x = -this.padding_x;
            while(x < this.image.width + this.padding_x) {
                this.draw_hexagon(x, y);
                x += 2 * this.offset_x;
            }
            y += this.offset_row;
        }
    }
    draw_down_up_hexagons() {
        let x = -this.padding_x;
        let y = -this.padding_y + this.offset_y;

        while(y < this.image.height + this.padding_y) {
            x = -this.padding_x + this.offset_x;
            while(x < this.image.width + this.padding_x) {
                this.draw_hexagon(x, y, false, true);
                x += 2 * this.offset_x;
            }
            y += this.offset_row;
        }
    }
    draw() {
        this.p5.clear();
        this.draw_up_down_hexagons();
        this.draw_down_up_hexagons();
    }
}

export default HicksHexagonDrawer;
