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