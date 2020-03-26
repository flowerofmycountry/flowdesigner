import Palette from './palette.js'
import Diagram from './diagram.js'

class FlowDesigner {
    constructor() {
        const paletteDiv = document.getElementById("myPaletteDiv");
        const diagramDiv = document.getElementById("myDiagramDiv");

        this.palette = new Palette(paletteDiv);
        this.diagram = new Diagram(diagramDiv);

        // 修正this指向
        this.onMouseMove_diagram_newItem = this.onMouseMove_diagram_newItem.bind(this);
        this.onMouseMove_diagram_moveItem = this.onMouseMove_diagram_moveItem.bind(this);
        this.onMouseMove_diagram_drawLine = this.onMouseMove_diagram_drawLine.bind(this);
        this.onCallContextMenu = this.onCallContextMenu.bind(this);
        this.onClickContextMenuButton = this.onClickContextMenuButton.bind(this);

        // 工具栏事件注册
        this.palette.canvas.addEventListener("mousedown", (e) => this.onMouseDown_palette(e), false);
        this.palette.canvas.addEventListener("mouseup", (e) => this.onMouseUp_palette(e), false);

        // 绘图区域事件注册
        this.diagram.canvas.addEventListener("mousedown", (e) => this.onMouseDown_diagram(e), false);
        this.diagram.canvas.addEventListener("mouseup", (e) => this.onMouseUp_diagram(e), false);
        this.diagram.canvas.addEventListener("dblclick", (e) => this.onDblClick_diagram(e), false);
        this.diagram.canvas.addEventListener('contextmenu', this.onCallContextMenu, false);

        // 键盘事件注册
        document.addEventListener("keydown", (e) => this.keyCheck(e), false);

        this.drawFlag = null;
    }

    draw() {
        this.diagram.draw();
        this.palette.draw();
    }

    onMouseDown_palette(e) {
        const rect = this.palette.canvas.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;

        // drawFlg -> (drag shape)
        this.drawFlag = this.palette.getSelectedID(x, y);

        // start and end only once
        if ((this.drawFlag == "start" || this.drawFlag == "end") && this.diagram.items.find(item => item.type == this.drawFlag)) {
            this.drawFlag = null;
            return;
        }

        if (this.drawFlag != "solid_line" && this.drawFlag != "dotted_line") {
            this.diagram.canvas.addEventListener("mousemove", this.onMouseMove_diagram_newItem, false);
            this.diagram.drawLineReadyFlag = null;
        } else {
            this.diagram.drawLineReadyFlag = this.drawFlag;
        }

    }

    onMouseUp_palette() {
        this.diagram.canvas.removeEventListener("mousemove", this.onMouseMove_diagram_newItem, false);
        this.drawFlag = null;
    }

    onMouseMove_diagram_newItem(e) {
        const rect = this.diagram.canvas.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;

        this.diagram.drawHoldingNewItem(x, y, this.palette.items.find(i => i.selected).id);
    }

    onMouseMove_diagram_moveItem(e) {
        const rect = this.diagram.canvas.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;

        this.diagram.drawHoldingItem(x, y, this.diagram.items.find(i => i.selected));
    }

    onMouseMove_diagram_drawLine(e) {
        const rect = this.diagram.canvas.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;

        this.diagram.drawDrawingLine(x, y, this.diagram.items.find(i => i.selected));
    }

    onMouseUp_diagram(e) {
        this.diagram.canvas.removeEventListener("mousemove", this.onMouseMove_diagram_newItem, false);
        this.diagram.canvas.removeEventListener("mousemove", this.onMouseMove_diagram_moveItem, false);
        this.diagram.canvas.removeEventListener("mousemove", this.onMouseMove_diagram_drawLine, false);

        if (this.drawFlag == null && this.diagram.drawingLineStart == null) return;

        if (this.drawFlag) {
            this.diagram.itemsCount++;
        }

        if (this.diagram.drawingLineStart) {
            const rect = this.diagram.canvas.getBoundingClientRect(),
                x = e.clientX - rect.left,
                y = e.clientY - rect.top;

            this.diagram.drawLine(x, y);
        }

        this.drawFlag = null;
    }

    onMouseDown_diagram(e) {
        this.closeContextMenu();

        const rect = this.diagram.canvas.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;

        let topSelected = this.diagram.getTopNotInTypes(x, y, []);

        if (topSelected == null) return;

        this.diagram.items.forEach(item => {
            if (topSelected == null || item.id != topSelected.id) item.selected = false;
        })

        topSelected.selected = true;

        if (this.diagram.drawLineReadyFlag) {
            this.diagram.canvas.addEventListener("mousemove", this.onMouseMove_diagram_drawLine, false);
        } else {
            this.diagram.items.forEach(item => {
                item.setOffsetXY(x, y);
            })

            this.diagram.canvas.addEventListener("mousemove", this.onMouseMove_diagram_moveItem, false);
        }

    }

    keyCheck(e) {
        const keyCode = e.keyCode;
        switch (keyCode) {
            case 46:
                this.diagram.removeSelected();
                break;
            default:
                break;
        }
    }

    onDblClick_diagram(e) {
        console.log(e);
    }

    onCallContextMenu(e) {
        e.preventDefault();
        const menu = document.getElementById("contextmenu");
        menu.setAttribute("style", `left:${e.clientX}px; top:${e.clientY}px; display: block;`);

        const lis = menu.firstElementChild.children;

        for (let i=0, l=lis.length; i<l; i++) {
            lis[i].addEventListener("click", this.onClickContextMenuButton, false);
        }
    }

    onClickContextMenuButton(e) {
        e.preventDefault();
        console.log(e.srcElement.textContent);
        this.closeContextMenu();
    }

    closeContextMenu() {
        const menu = document.getElementById("contextmenu");
        menu.setAttribute("style", `display: none;`);
    }
}

export default FlowDesigner;