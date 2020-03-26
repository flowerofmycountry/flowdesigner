class Step {
    constructor(x, y, width, height, style) {
        this.type = 'step';
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.style = style;
        this.id = Math.random().toString(36).substr(2);
        this.selected = false;

        this.outArrows = [];
        this.inArrows = [];
    }

    addToOutArrows(arrowid) {
        this.outArrows.push(arrowid);
    }

    addToInArrows(arrowid) {
        this.inArrows.push(arrowid);
    }

    removeArrows(arrows) {
        const arrowSet = new Set(arrows);

        this.outArrows = this.outArrows.filter(arrow => !arrowSet.has(arrow));
        this.inArrows = this.inArrows.filter(arrow => !arrowSet.has(arrow));
    }

    getAllArrows() {
        return this.outArrows.concat(this.inArrows);
    }

    draw(ctx) {
        if (this.selected) {
            this._drawSelectBox(ctx);
        }

        this._drawOrigin(ctx);
    }

    _drawOrigin(ctx) {
        switch (this.style) {
            case "single_handle":
                ctx.beginPath();
                ctx.rect(this.x, this.y, this.width, this.height);
                ctx.closePath();
                ctx.fillStyle = "rgba(139,137,137,1)";
                ctx.fill();
                break;
            case "parallel_handle":
                ctx.beginPath();
                ctx.rect(this.x, this.y, this.width - 9, this.height - 6);
                ctx.closePath();
                ctx.fillStyle = "rgba(0,0,0,1)";
                ctx.fill();

                ctx.beginPath();
                ctx.rect(this.x + 3, this.y + 2, this.width - 9, this.height - 6);
                ctx.closePath();
                ctx.fillStyle = "rgba(139,137,137,1)";
                ctx.fill();

                ctx.beginPath();
                ctx.rect(this.x + 6, this.y + 4, this.width - 9, this.height - 6);
                ctx.closePath();
                ctx.fillStyle = "rgba(205,201,201,1)";
                ctx.fill();
                break;
            default:
                break;
        }
    }

    _drawLineToolArea(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y - 5, this.width, 10);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.fill();

        ctx.beginPath();
        ctx.rect(this.x, this.y + this.height - 5, this.width, 10);
        ctx.closePath();
        ctx.fillStyle = 'rgba(105, 0, 0, 0.5)';
        ctx.fill();
    }

    _drawSelectBox(ctx) {
        const box = this._getBox(4);

        ctx.beginPath();
        ctx.rect(box.x, box.y, box.width, box.height);
        ctx.closePath();
        ctx.strokeStyle = "red";
        ctx.stroke();
    }

    isHover(x, y) {
        return this.x <= x && this.x + this.width >= x && this.y <= y && this.y + this.height >= y
    }

    _getBox(offset) {
        return {
            x: this.x - offset,
            y: this.y - offset,
            width: this.width + offset * 2,
            height: this.height + offset * 2
        }
    }

    setPosition(x, y) {
        this.x = x - this.offsetX;
        this.y = y - this.offsetY;
    }

    setOffsetXY(x, y) {
        this.offsetX = x - this.x;
        this.offsetY = y - this.y;
    }

    getOutConnector() {
        return {
            type: "out",
            x: this.x + this.width / 2,
            y: this.y + this.height
        }
    }

    getInConnector() {
        return {
            type: "in",
            x: this.x + this.width / 2,
            y: this.y
        }
    }
}

export default Step;