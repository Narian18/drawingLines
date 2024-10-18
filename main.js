function clearSvg(svgElem) {
    while (svgElem.firstChild) {
      svgElem.removeChild(svgElem.firstChild);
    }
}

function getLinePosForElem(elem, isSource, offsetX=0, offsetY=0) {
    const elemX = elem.getBoundingClientRect().x;
    const elemY = elem.getBoundingClientRect().y;
    const elemHeight = elem.clientHeight;
    
    const startY = elemY + (elemHeight / 2) - offsetY;
    var startX = elemX - offsetX;
    if (isSource) {
        startX += elem.clientWidth;
    }

    return [startX, startY];
}

function createLine(arc, colour="#888") {
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", arc);
    path.setAttribute("stroke", colour);
    path.setAttribute("fill", "transparent");

    return path;
}

function createMovingCircle(path, colour="#AAAAAA") {
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("stroke", colour);
    circle.setAttribute("stroke-width", "3");
    circle.setAttribute("fill", colour);
    circle.setAttribute("r", 4);
    circle.setAttribute("cx", 0);
    circle.setAttribute("cy", 0);

    var circleAnimation = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
    circleAnimation.setAttribute("dur", "2");
    circleAnimation.setAttribute("path", path);
    circleAnimation.setAttribute("keyPoints", "0.1;0.9");
    circleAnimation.setAttribute("fill", "freeze");
    circleAnimation.setAttribute("keyTimes", "0;1");
    circleAnimation.setAttribute("calcMode", "linear");
    circleAnimation.setAttribute("repeatCount", "indefinite");
    circle.appendChild(circleAnimation);

    return circle;
}

function drawLines(pairs) {
    var svg = document.getElementById("connection-svg");
    clearSvg(svg);

    const offsetX = document.getElementById("flowchart-container").offsetLeft;
    const offsetY = document.getElementById("flowchart-container").offsetTop;

    for (const [source, dest, colour, runStatus] of pairs) {
        const sourceElem = document.getElementById(source);
        const destElem = document.getElementById(dest);

        const sourceCoords = getLinePosForElem(sourceElem, true, offsetX, offsetX);
        const destCoords = getLinePosForElem(destElem, false, offsetX, offsetY);
        
        const avgX = (sourceCoords[0] + destCoords[0]) / 2;
        const pathString = `
            M ${sourceCoords[0]} ${sourceCoords[1]}
            C ${avgX} ${sourceCoords[1]}, 
              ${avgX} ${destCoords[1]}, 
              ${destCoords[0]} ${destCoords[1]}
        `
        const path = createLine(pathString, colour);
        if (runStatus) {
            const circle = createMovingCircle(pathString, colour);
            svg.appendChild(circle);
        }

        svg.appendChild(path);
    }
}

var pairs = [
    ["l1", "m1", "green", true],
    ["l2", "m1", "red", true],
    ["l3", "m1", "green", true],
    ["m1", "r1", "green", true],
    ["m1", "r2"],
];
drawLines(pairs);
window.addEventListener("resize", function(){drawLines(pairs)});

