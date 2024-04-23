class Synth {

    constructor(amp1, amp2, amp3) {
        this.isStarted = false;

        // create osc and filter objects
        this.osc1 = new p5.Oscillator('sawtooth');
        this.osc2 = new p5.Oscillator('sawtooth');
        this.osc3 = new p5.Oscillator('sine');

        this.synthFilter = new p5.Filter('lowpass');

        // map frequency and filter cutoff to mouse X and Y
        this.freqToPlay = map(mouseY, 0, width, 60, 260);
        this.cutoff = map(mouseX, 0, height, 20, 20000);
    }

    startSynth() {

        // start all oscillators
        this.osc1.start();
        this.osc2.start();
        this.osc3.start();

        // activate low pass filter
        this.osc1.disconnect();
        this.osc1.connect(this.synthFilter);
        this.osc2.disconnect();
        this.osc2.connect(this.synthFilter);
        this.osc3.disconnect();
        this.osc3.connect(this.synthFilter);

        // set amplitudes (volume, kinda)
        this.osc1.amp(this.amp1);
        this.osc2.amp(this.amp2);
        this.osc3.amp(this.amp3);

        this.isStarted = true;
    }

    setOscFreqs() {
        this.osc1.freq(this.freqToPlay); // root
        this.osc2.freq(this.freqToPlay * (3/2)); // high perfect fifth
        this.osc3.freq(this.freqToPlay * (1/2)); // low octave
    }

    setFilterCutoff() {
        this.synthFilter.freq(this.cutoff);
    }

    isPlaying() {
        if (this.osc1.amp > 0.0) {
            return true;
        }
        else if (this.osc1.amp <= 0.0) {
            return false;
        }
    }

    getActiveFreq() {
        return this.freqToPlay;
    }

    getActiveCutoff() {
        return this.cutoff;
    }
}