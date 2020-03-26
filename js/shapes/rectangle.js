class Rectangle {
    constructor (x, y, width, height, id) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.id = id;
        this.selected = false;
    }

    draw (ctx) {
        if (this.selected) {
            this._drawSelectBox(ctx);
        }

        this._drawOrigin(ctx);
    }

    _drawOrigin(ctx) {
        switch(this.id) {
            case "single_handle":
                ctx.beginPath();
                ctx.rect(this.x, this.y, this.width, this.height);
                ctx.closePath();
                ctx.fillStyle = "rgba(139,137,137,1)";
                ctx.fill();
                break;
            case "parallel_handle":
                ctx.beginPath();
                ctx.rect(this.x, this.y, this.width-9, this.height-6);
                ctx.closePath();
                ctx.fillStyle = "rgba(0,0,0,1)";
                ctx.fill();

                ctx.beginPath();
                ctx.rect(this.x+3, this.y+2, this.width-9, this.height-6);
                ctx.closePath();
                ctx.fillStyle = "rgba(139,137,137,1)";
                ctx.fill();

                ctx.beginPath();
                ctx.rect(this.x+6, this.y+4, this.width-9, this.height-6);
                ctx.closePath();
                ctx.fillStyle = "rgba(205,201,201,1)";
                ctx.fill();
                break;
            default:
                break;
        }
    }

    _drawSelectBox(ctx) {
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.rect(this.x + this.width / 2 - 50, this.y + this.height / 2 - 50, 100, 100);
        ctx.closePath();
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.stroke();
    }

    isHover (x, y) {
        const boxx = this.x + this.width / 2 - 50;
        const boxy = this.y + this.height / 2 - 50;

        return boxx <= x && boxx + 100 >= x && boxy <= y && boxy + 100 >= y
    }
} 

export default Rectangle;