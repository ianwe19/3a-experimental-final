let canvas, userStarted, synthRunning;
let fMinScale = ['F3', 'G3', 'Ab3', 'Bb3', 'C3', 'Db3', 'Eb3', 'F4'];

let osc1 = new p5.Oscillator('sawtooth');
let osc2 = new p5.Oscillator('sawtooth');
let osc3 = new p5.Oscillator('sine');

let synthFilter = new p5.Filter('lowpass');


function setup() {
    canvas = createCanvas(windowWidth - 1, windowHeight);
    userStarted = false;

    //             Hue  Sat  Bri  Alpha
    //              v    v    v    v 
    colorMode(HSB, 360, 100, 100, 1.0);

}

function draw() {
    
    if (userStarted) {
        if (!synthRunning) {
            startSynth();
            synthRunning = true;
        }

        background(0, 255, 0); // black background
        noFill(); // no fill
        // stroke(frameCount / 2, frameCount / 2, frameCount / 3); // black stroke
        strokeWeight(w(0.001));

        // change numbers to modify circles (size and number), may kill performance
        for (let radius = 0.05; radius < 0.9; radius += 0.01) {

            // make some concentric circles (num of sides, radius)
            const circle = makeCircle(20, radius);

            // use perlin noise to offset vertices
            const distortedCircle = distortPolygon(circle);

            const smoothCircle = chaikin(distortedCircle, 3);
            
            // begin drawing path
            beginShape();

            // iterate through points array, set vertex at each
            smoothCircle.forEach(point => {
            vertex(w(point[0]), h(point[1]));
            });

            // CLOSE because the last point is not the first point
            endShape(CLOSE); 
        }

        // synth control
        let freqToPlay = map(mouseY, 0, width, 20, 300);
        let cutoff = map(mouseX, 0, height, 20, 2000);
        osc1.freq(freqToPlay);
        osc2.freq(freqToPlay * (3/2));
        osc3.freq(freqToPlay * (1/2));
        synthFilter.freq(cutoff);

        frameRate(freqToPlay / 2);

        cutoffColor = map(cutoff, 20, 2000, 5, 120);
        freqColor = map(freqToPlay, 60, 260, 0, 360);
        stroke(freqColor, 100, cutoffColor, 1.0);
    }
    else {
        textSize(36);
        textStyle(NORMAL);
        textAlign(CENTER);
        textFont(loadFont('assets/fonts/AppleGaramond-Light.ttf'));
        fill('white');
        text("press space bar to start", windowWidth / 2, windowHeight / 2);
        text("and then move the mouse or touchpad", windowWidth / 2, windowHeight / 2 + 100);
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

// make concentric circles using polygons, so we can deform them
function makeCircle(numSides, radius) {
    const points = [];
    const radiansPerStep = (Math.PI * 2.5) / numSides;
    for (let theta = 0; theta < Math.PI * 3; theta += radiansPerStep) {
        const x = 0.5 + radius * Math.cos(theta);
        const y = 0.5 + radius * Math.sin(theta);
        
        points.push([x, y]);
    }

    return points;
}

function distortPolygon(polygon) {

    // 
    return polygon.map(point => {
        const x = point[0];
        const y = point[1];
        const distance = dist(0.5, 0.5, x, y);

        const z = frameCount / 500;
        const z2 = frameCount / 200;
        
        // use perlin noise to offset x, y of vertex
        const noiseFn = (x, y) => {
            const noiseX = (x + 0.31) * distance * 2 + z;
            const noiseY = (y - 1.73) * distance * 2 + z2;
            return noise(noiseX, noiseY * frameCount / 2000, z);
        };
          
        // get noise value between 0.0 and 1.0, store in var theta
        const theta = noiseFn(x, y) * Math.PI * 3;
        
        // nudge vertices based on noise value
        const amountToNudge = 0.08 - (Math.cos(z) * 0.09);

        const newX = x + (amountToNudge * Math.cos(theta));
        const newY = y + (amountToNudge * Math.sin(theta));
        
        return [newX, newY];
    });
}

function chaikin(arr, num) {
    if (num === 0) return arr;
    const l = arr.length;
    const smooth = arr.map((c,i) => {
      return [[0.75*c[0] + 0.25*arr[(i + 1)%l][0],
               0.75*c[1] + 0.25*arr[(i + 1)%l][1]],
              [0.25*c[0] + 0.75*arr[(i + 1)%l][0],
              0.25*c[1] + 0.75*arr[(i + 1)%l][1]]];
      }).flat();
    return num === 1 ? smooth : chaikin(smooth, num - 1)
}

function keyTyped() {
    userStarted = true;
}

function startSynth() {
    osc1.start();
    osc1.disconnect();
    osc1.connect(synthFilter);
    osc1.amp(0.3);
    
    osc2.start();
    osc2.disconnect();
    osc2.connect(synthFilter);
    osc2.amp(0.3);
    
    osc3.start();
    osc3.disconnect();
    osc3.connect(synthFilter);
    osc3.amp(0.5);
}