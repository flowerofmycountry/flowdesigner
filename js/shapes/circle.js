class Circle {
    constructor (x, y, radius, id) {
        this.x = x;
        this.y = y;
        this.radius = radius;
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
            case "start":
                ctx.lineWidth = 1.0;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fillStyle = "rgba(255,255,255,0.5)";
                ctx.fill();
                ctx.strokeStyle = "rgba(0,0,0,1)";
                ctx.stroke();
                break;
            case "end":
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fillStyle = "rgba(0,0,0,1)";
                ctx.fill();
                
                ctx.lineWidth = 5.0;
                ctx.strokeStyle = "rgba(255,255,255,1)";
                ctx.stroke();

                ctx.lineWidth = 1.0;
                ctx.strokeStyle = "rgba(255,48,48,1)";
                ctx.stroke();

                break;
            default:
                break;
        }
        
    }

    _drawSelectBox(ctx) {
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.rect(this.x - 50, this.y - 50, 100, 100);
        ctx.closePath();
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.stroke();
    }

    isHover (x, y) {
        const boxx = this.x - 50;
        const boxy = this.y - 50;

        return boxx <= x && boxx + 100 >= x && boxy <= y && boxy + 100 >= y;
    }
}

export default Circle;