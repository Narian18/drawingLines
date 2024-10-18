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

function drawLines(pairs) {
    var svg = document.getElementById("connection-svg");
    clearSvg(svg);

    const offsetX = document.getElementById("flowchart-container").offsetLeft;
    const offsetY = document.getElementById("flowchart-container").offsetTop;

    for (const [source, dest] of pairs) {
        const sourceElem = document.getElementById(source);
        const destElem = document.getElementById(dest);

        const sourceCoords = getLinePosForElem(sourceElem, true, offsetX, offsetX);
        const destCoords = getLinePosForElem(destElem, false, offsetX, offsetY);
        
        const avgX = (sourceCoords[0] + destCoords[0]) / 2;
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `
            M ${sourceCoords[0]} ${sourceCoords[1]}
            C ${avgX} ${sourceCoords[1]}, 
              ${avgX} ${destCoords[1]}, 
              ${destCoords[0]} ${destCoords[1]}
        `);
        path.setAttribute("stroke", "black");
        path.setAttribute("fill", "transparent");
        svg.appendChild(path);
    }
}

var pairs = [
    ["l1", "m1"],
    ["l2", "m1"],
    ["l3", "m1"],
    ["m1", "r1"],
    ["m1", "r2"],
];
drawLines(pairs);
window.addEventListener("resize", function(){drawLines(pairs)});

