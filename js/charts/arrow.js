class Arrow {
    constructor(fromx, fromy, tox, toy, style, from, to) {
        this.type = 'arrow';
        this.fromx = fromx;
        this.fromy = fromy;
        this.tox = tox;
        this.toy = toy;
        this.style = style;
        this.id = Math.random().toString(36).substr(2);
        this.selected = false;

        this.from = from;
        this.to = to;
    }

    draw(ctx) {
        this._drawOrigin(ctx);

        if (this.selected) {
            this._drawSelectBox(ctx);
        }
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

        if (this.style == "dotted_line") {
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

        // draw connector in
        ctx.beginPath();
        ctx.arc(this.fromx, this.fromy, 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.strokeStyle = "red";
        ctx.stroke();

        if (this.from && this.to) {
            ctx.beginPath();
            ctx.arc(this.tox, this.toy, 2, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.strokeStyle = "red";
            ctx.stroke();
        }

    }

    _drawSelectBox(ctx) {
        ctx.beginPath();
        ctx.rect(this.fromx-3, this.fromy-3, 6, 6);
        ctx.rect(this.tox-3, this.toy-3, 6, 6);
        ctx.rect((this.tox + this.fromx) / 2-3, (this.fromy + this.toy) / 2-3, 6, 6);
        ctx.closePath();
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.fill();

        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.stroke();
    }

    isHover(x, y) {
        const dis = this.pDistance(x, y, this.fromx, this.fromy, this.tox, this.toy);

        return dis < 3;
    }

    pDistance(x, y, x1, y1, x2, y2) {

        var A = x - x1;
        var B = y - y1;
        var C = x2 - x1;
        var D = y2 - y1;

        var dot = A * C + B * D;
        var len_sq = C * C + D * D;
        var param = -1;
        if (len_sq != 0) //in case of 0 length line
            param = dot / len_sq;

        var xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        }
        else if (param > 1) {
            xx = x2;
            yy = y2;
        }
        else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        var dx = x - xx;
        var dy = y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    setPosition(x, y) {
        this.fromx = x - this.offsetFromX;
        this.fromy = y - this.offsetFromY;
        this.tox = x - this.offsetToX;
        this.toy = y - this.offsetToY;
    }

    setOffsetXY(x, y) {
        this.offsetFromX = x - this.fromx;
        this.offsetFromY = y - this.fromy;

        this.offsetToX = x - this.tox;
        this.offsetToY = y - this.toy;
    }
}

export default Arrow;