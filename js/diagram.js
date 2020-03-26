import Start from './charts/start.js'
import Step from './charts/step.js'
import End from './charts/end.js'
import Arrow from './charts/arrow.js'

class Diagram {
    constructor(parent) {
        this.width = parent.clientWidth;
        this.height = parent.clientHeight;

        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.setAttribute("style", "background: url('./images/grid.jpeg');");

        this.context = this.canvas.getContext("2d");

        parent.appendChild(this.canvas);

        this.items = [];
        this.itemsCount = 0;
        this.drawingLineStart = null;
    }

    draw() {
        this.context.clearRect(0, 0, this.width, this.height)
        this.items.forEach(item => {
            item.draw(this.context);
        })

    }

    drawHoldingNewItem(x, y, toolID) {
        if (this.items.length > this.itemsCount) {
            this.items.pop();
        }

        switch (toolID) {
            case "start":
                this.items.push(new Start(x, y, 30));
                break;
            case "single_handle":
                this.items.push(new Step(x - 40, y - 30, 80, 60, toolID));
                break;
            case "parallel_handle":
                this.items.push(new Step(x - 40, y - 30, 80, 60, toolID));
                break;
            case "end":
                this.items.push(new End(x, y, 30));
                break;
            default: break;
        }
    }

    drawHoldingItem(x, y, holding) {
        if (!holding) return;

        if (holding.type == "arrow") {
            const from = this.get(holding.from);
            const to = this.get(holding.to);

            from.setPosition(x, y);
            to.setPosition(x, y);
            this.fixArrow(from);
            this.fixArrow(to);
        } else {
            this.fixArrow(holding);
        }

        holding.setPosition(x, y);
    }

    drawDrawingLine(x, y, holding) {
        if (!holding || !holding.getOutConnector) return;

        if (this.items.length > this.itemsCount) {
            this.items.pop();
        }

        const conn = holding.getOutConnector();

        this.items.push(new Arrow(conn.x, conn.y, x, y, this.drawLineReadyFlag));

        this.drawingLineStart = holding;
    }

    drawLine(x, y) {
        const top = this.getTopNotInTypes(x, y, ["arrow", "start"]);

        const popItem = this.items.pop();

        //if (top && this.drawingLineStart.id != top.id) {
        if (top && !this.hasPath(top.id, this.drawingLineStart.id)) {

            const conn = top.getInConnector();

            // already has the arrow
            const hadOne = this.items.filter(item => item.type == "arrow").find(item => item.from == this.drawingLineStart.id && item.to == top.id);

            if (!hadOne) {
                const arrow = new Arrow(popItem.fromx, popItem.fromy, conn.x, conn.y, this.drawLineReadyFlag, this.drawingLineStart.id, top.id)
                this.items.push(arrow);
                this.items.find(item => item.id == this.drawingLineStart.id).addToOutArrows(arrow.id);
                this.items.find(item => item.id == top.id).addToInArrows(arrow.id);
                this.itemsCount++;
            }
        }

        this.drawingLineStart = null;
    }

    getTopNotInTypes(x, y, notInTypes) {
        notInTypes = notInTypes && Array.isArray(notInTypes) ? new Set(notInTypes) : new Set([]);

        let top = null;

        for (let i = this.items.length - 1; i >= 0; i--) {
            if (this.items[i].isHover(x, y)) {
                if (notInTypes.has(this.items[i].type)) continue;
                top = this.items[i];
                break;
            }
        }

        return top;
    }

    removeSelected() {
        const removeArrows = [];

        this.items = this.items.filter(item => {
            if (item.selected) {
                if (item.type == "arrow") {
                    removeArrows.push(item.id);
                } else {
                    item.getAllArrows().forEach(arrow => removeArrows.push(arrow));
                }

                return false;
            }

            return true;
        });

        const arrowSet = new Set(removeArrows);

        this.items = this.items.filter(item => !arrowSet.has(item.id));
        //const remveArrows = removeItems.filter(item => item.type == "arrow").map(item => item.id);
        this.items.filter(item => item.type != "arrow").forEach(item => item.removeArrows(removeArrows));

        this.itemsCount = this.items.length;
    }

    get(id) {
        return this.items.find(item => item.id == id);
    }

    fixArrow(item) {
        if (item.inArrows) {
            const conn = item.getInConnector();
            item.inArrows.forEach(arrowId => {

                const arrow = this.get(arrowId);
                arrow.tox = conn.x;
                arrow.toy = conn.y;
            })

        }

        if (item.outArrows) {
            const conn = item.getOutConnector();

            item.outArrows.forEach(arrowId => {
                const arrow = this.get(arrowId);
                arrow.fromx = conn.x;
                arrow.fromy = conn.y;
            })
        }
    }

    hasPath(fromItemId, toItemId) {
        if (fromItemId == toItemId) return true;

        const visited = new Set([]);

        visited.add(fromItemId);

        const queue = [];

        queue.push(fromItemId)

        while (queue.length != 0) {
            fromItemId = queue.pop();

            const outs = this.get(fromItemId).outArrows;

            if (!outs) continue;

            let n;

            for (const next of outs) {
                n = this.get(next).to;

                if (n == toItemId) return true;

                if (!visited.has(n)) {
                    visited.add(n);
                    queue.push(n);
                }
            }
        }

        return false;
    }
}

export default Diagram;