import Circle from './shapes/circle.js'
import Rectangle from './shapes/rectangle.js'
import Arrow from './shapes/arrow.js'

class Palette {
    constructor (parent) {
        this.width = parent.clientWidth;
        this.height = parent.clientHeight;

        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.canvas.setAttribute("style", "background: url('./images/paper.gif');");

        this.context = this.canvas.getContext("2d");

        parent.appendChild(this.canvas);

        this.items = [
            new Arrow(10, 50, 90, 50, "solid_line"),
            new Arrow(10, 150, 90, 150, "dotted_line"),
            new Circle(50, 250, 30, "start"), 
            new Rectangle(10, 320, 80, 60, "single_handle"),
            new Rectangle(10, 420, 80, 60, "parallel_handle"),
            new Circle(50, 550, 30, "end")
        ];
    }

    draw() {
        this.context.clearRect(0, 0, this.width, this.height)
        this.items.forEach(item => {
            item.draw(this.context);
        })
    }

    getSelectedID(x, y) {
        let id = null;

        for (const p of this.items) {
            p.selected = false;

            if (p.isHover(x, y)) {
                p.selected = true;
                id = p.id;
            }
        }

        return id;
    }
 
}

export default Palette;