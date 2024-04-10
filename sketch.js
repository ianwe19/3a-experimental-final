function setup() {
  createCanvas(400, 400);

  //             Hue  Sat  Bri  Alpha
  //              v    v    v    v 
  colorMode(HSB, 360, 100, 100, 1.0);
}

function draw() {
    background(0, 0, 100); // white background
    noFill(); // no fill
    stroke(0, 0, 0); // black stroke
    strokeWeight(w(0.001)); // light stroke weight

    // **************************************************************
    // *  concentric circles using polygons, so we can deform them  *
    // **************************************************************

    // numSteps = number of vertices in "circle"
    const numSteps = 10;

    // change the type of polygon
    const radiansPerStep = (Math.PI * 2) / numSteps;

    // change last num to make more densely packed polygons, kills performance
    for (let radius = 0.1; radius < 0.4; radius += 0.05) {
        beginShape();
        for (let theta = 0; theta < Math.PI * 2; theta += radiansPerStep) {
            const x = 0.5 + radius * Math.cos(theta);
            const y = 0.5 + radius * Math.sin(theta);
            
            vertex(w(x), h(y));
        }

        // CLOSE because the last point is not the first point
        endShape(CLOSE);
    }
}

// use relative coords for width, 0.0 - 1.0
function w(val) {
    if (val == null) return width;
    return width * val;
}


// use relative coords for height, 0.0 - 1.0
function h(val) {
    if (val == null) return height;
    return height * val;
}