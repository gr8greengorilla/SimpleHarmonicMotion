const BLOTCH_SIZE = 4; // Blotch size in px
const BLOTCH_DECAY_SPEED = 50; // Blotches change color every 50 ms

const DATAPOINT_SPEED = 20; // Plot a datapoint every 10 ms
const TIME_MODIFIER = 1 // Time moves 2x as fast

var colors = [
    'rgb(255, 0, 0)', // red
    'rgb(255, 255, 0)', // yellow
    'rgb(0, 255, 0)', // green
    'rgb(0, 255, 255)', // cyan
    'rgb(0, 0, 255)', // blue
    'rgb(255, 0, 255)' // magenta
];

class DisplayAnimator {
    constructor(canvasName) {
        // Get canvas context and create a blotch array.
        this.canvas = document.getElementById(canvasName);
        this.ctx = this.canvas.getContext("2d");
        this.blotches = [];
    }

    // Add a new blotch at x, y
    addBlotch(x, y) {
        this.blotches.push(new Blotch(x, y));
    }

    // clear and draw all blotches onto the canvas.
    updateCanvas() {
        this.ctx.fillStyle = '#b8b8b8';
        this.ctx.fillRect(0,0, this.canvas.clientWidth, this.canvas.clientHeight);

        for (var i = 0; i < this.blotches.length; i++) {
            var blotch = this.blotches[i];
            // Get position and color of the blotch
            var pos = blotch.getPos();
            this.ctx.fillStyle = blotch.getColor();

            // Draw the blotch
            this.ctx.fillRect(pos[0], pos[1], BLOTCH_SIZE, BLOTCH_SIZE);
        }
    }

    incrementBlotches() {
        for (var i = 0; i < this.blotches.length; i++) {
            var blotch = this.blotches[i];

            // Increment the color, and delete if past its cycle.
            blotch.incrementTime();

            if (blotch.canDelete()) {
                this.blotches.splice(i, 1);
            }
        }
    }

    getCanvasWidth() {
        return this.canvas.clientWidth;
    }
    getCanvasHeight() {
        return this.canvas.clientHeight;
    }


}

// A blotch is a point on the canvas that will fade through the rainbow before disappearing
class Blotch {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.time = 0;
    }

    // Increment the color by 1
    incrementTime() {
        this.time += DATAPOINT_SPEED / 1000;
    }

    //
    getColor() {
        return colors[Math.floor(this.time / (BLOTCH_DECAY_SPEED / 1000))];
    }

    // Returns an array of the blotch position in form of [x, y]
    getPos() {
        return [this.x, this.y];
    }


    // Mark for deletion after the color cycling is complete
    canDelete() {
        return this.time > 6 * BLOTCH_DECAY_SPEED;
    }
}

// Create my DisplayAnimator object.
var display = new DisplayAnimator("myCanvas");
var time = 0.0;


setInterval(addDataPoint, DATAPOINT_SPEED);

function addDataPoint() {
    time += DATAPOINT_SPEED / 1000 * TIME_MODIFIER;

    display.incrementBlotches();

    var cord = Eq(time);

    // Add the blotch at eq position, translated to the center of the canvas

    display.addBlotch(cord[0] + display.getCanvasWidth() / 2, cord[1] + display.getCanvasWidth() / 2);

    display.updateCanvas();
}

// x(t) and y(t) function, input t and return x and y in an array in form of [x, y].
function Eq(t) {
    // x(t) = 100cos(t)
    // y(t) = 100sin(t)
    x = 100*Math.cos(t);
    y = 100*Math.sin(t);
    //y = 100*Math.sin(t);

    return [x, -y]; // We must inverse Y because the positive is down relative to the canvas.
}