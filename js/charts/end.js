class End {
    constructor (x, y, radius, strokeStyle) {
        this.type = "end"
        this.description = 'end';
        this.properties = '';
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.strokeStyle = strokeStyle;
        this.id = Math.random().toString(36).substr(2);
        this.selected = false;

        this.inArrows = [];
    }

    addToInArrows(arrowid) {
        this.inArrows.push(arrowid);
    }

    removeArrows(arrows) {
        const arrowSet = new Set(arrows);

        this.inArrows = this.inArrows.filter(arrow => !arrowSet.has(arrow));
    }

    getAllArrows() {
        return this.inArrows;
    }

    draw (ctx) {
        if (this.selected) {
            this._drawSelectBox(ctx);
        } 
        this._drawOrigin(ctx);
    }

    _drawOrigin(ctx) {
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
    }

    _drawSelectBox(ctx) {
        const box = this._getBox(4);

        ctx.beginPath();
        ctx.rect(box.x, box.y, box.width, box.height);
        ctx.closePath();
        ctx.strokeStyle = "red";
        ctx.stroke();
    }

    _getBox(offset) {
        return {
            x: this.x - this.radius - offset,
            y: this.y - this.radius - offset,
            width: this.radius * 2 + offset * 2,
            height: this.radius * 2 + offset * 2
        }
    }

    isHover (x, y) {
        return (Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)) <= Math.pow(this.radius, 2)
    }

    setPosition(x, y) {
        this.x = x - this.offsetX;
        this.y = y - this.offsetY;
    }

    setOffsetXY(x, y) {
        this.offsetX = x - this.x;
        this.offsetY = y - this.y;
    }

    getInConnector() {
        return {
            type: "in",
            x: this.x,
            y: this.y - this.radius
        }
    }
}

export default End;