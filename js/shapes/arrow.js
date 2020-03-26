class Arrow {
    constructor (fromx, fromy, tox, toy, id) {
        this.fromx = fromx;
        this.fromy = fromy;
        this.tox = tox;
        this.toy = toy;
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

        // arrow length
        var headlen = 10;

        // arrow angle
        var theta = 45;
        var arrowX, arrowY;

        var angle = Math.atan2(this.fromy - this.toy, this.fromx - this.tox) * 180 / Math.PI;
        var angle1 = (angle + theta) * Math.PI / 180;
        var angle2 = (angle - theta) * Math.PI / 180;
        var topX = headlen * Math.cos(angle1);
        var topY = headlen * Math.sin(angle1);
        var botX = headlen * Math.cos(angle2);
        var botY = headlen * Math.sin(angle2);

        ctx.lineWidth = 1.0;
        ctx.beginPath();

        if (this.id == "dotted_line") {
            ctx.setLineDash([5, 5]);
        }

        ctx.moveTo(this.fromx, this.fromy);
        ctx.lineTo(this.tox, this.toy);

        // orange
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.stroke();

        ctx.beginPath();
        ctx.setLineDash([]);

        arrowX = this.tox + topX;
        arrowY = this.toy + topY;

        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(this.tox, this.toy);

        arrowX = this.tox + botX;
        arrowY = this.toy + botY;

        ctx.lineTo(arrowX, arrowY);

        // orange
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.stroke();
    }

    _drawSelectBox(ctx) {
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.rect((this.tox + this.fromx) / 2 - 50, (this.toy + this.fromy) / 2 - 50, 100, 100);
        ctx.closePath();
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.stroke();
    }

    isHover (x, y) {
        const boxx = (this.tox + this.fromx) / 2 - 50;
        const boxy = (this.toy + this.fromy) / 2 - 50;

        return boxx <= x && boxx + 100 >= x && boxy <= y && boxy + 100 >= y;

        //return (Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)) <= Math.pow(this.radius, 2)
    }
}

export default Arrow;