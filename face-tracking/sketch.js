var shape, convex = false, pd = 0.05, masked, zoom = 0;

function setup() {
    loadCamera(640,480);
    loadTracker();
    loadCanvas(640,480);
    // videoInput.hide();
    shape = createGraphics(640,480);
}
      
function draw() {
    pixelDensity(pd);

    getPositions();
    
    clear();
    
    drawPoints(shape);
    image(shape,0,0);
    videoInput.mask(shape);
    masked = image(videoInput,-zoom,-zoom,width+zoom,height+zoom);
}

function drawPoints(cnv) {
    cnv.clear();
    cnv.fill(`rgba(0,0,0,1)`);
    cnv.noStroke();
    if (convex) {
        cnv.beginShape();
        for (let i = 0; i < convexhull.length; i++) {
            if (convexhull[i]) {
                cnv.vertex(convexhull[i].x, convexhull[i].y);
            }
        }
        cnv.endShape(CLOSE);
    } else {
        // cnv.stroke(`rgba(255,255,255,0.75)`);
        // cnv.strokeWeight(3);
        // cnv.noFill();
        cnv.beginShape();
        for (let i = 0; i < positions.length - innerPointsLength; i++) {
            let index = (i-4);
            if (i < 4) {
                index = (positions.length - (innerPointsLength+1)) - i;
            }
            cnv.vertex(positions[index][0], positions[index][1]);
        }
        cnv.endShape(CLOSE);
    }
}