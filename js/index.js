


import Designer from './flowdesigner.js'
window.onload = function() {
    
    const designer = new Designer();
    animationFrame(designer);
}

function animationFrame(designer) {
    window.requestAnimationFrame(() => {
        designer.draw();
        animationFrame(designer);
    })
}

