let mic, amplitude;

function setup() {
  createCanvas(400, 400);
  angleMode(RADIANS);

  // Setup microphone input
  mic = new p5.AudioIn();
  mic.start();

  amplitude = new p5.Amplitude();
  amplitude.setInput(mic);

  noLoop();
}

function draw() {
  background(240);

  // Get audio level
  let level = amplitude.getLevel();
  let angle = map(level, 0, 0.2, 0, PI / 3); // Rotate up to 60 degrees max

  // Vanishing point
  const vanishingPointX = width / 2;
  const vanishingPointY = height / 2;

  // Outer border
  strokeWeight(2);
  stroke(0, 0, 150);
  noFill();
  rect(50, 50, width - 100, height - 100);

  // Perspective lines
  drawConvergingLines(vanishingPointX, vanishingPointY);

  // Chessboard with rotation based on audio
  drawChessPattern(vanishingPointX, vanishingPointY, angle);
}

function drawConvergingLines(vpX, vpY) {
  stroke(0, 0, 150);
  strokeWeight(1);

  // Outer perspective lines
  line(vpX, vpY, 50, 50);
  line(vpX, vpY, width - 50, 50);
  line(vpX, vpY, 50, height - 50);
  line(vpX, vpY, width - 50, height - 50);

  // Horizontal grid lines
  for (let i = 1; i < 4; i++) {
    let y = map(i, 0, 4, 50, height - 50);
    line(50, y, width - 50, y);
  }

  // Vertical grid lines
  for (let i = 1; i < 4; i++) {
    let x = map(i, 0, 4, 50, width - 50);
    line(x, 50, x, height - 50);
  }
}

function drawChessPattern(vpX, vpY, angle) {
  stroke(0, 0, 150);
  strokeWeight(1);

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      let filled = (row + col) % 2 === 0;
      drawPerspectiveSquare(row, col, vpX, vpY, filled, angle);
    }
  }
}

function drawPerspectiveSquare(row, col, vpX, vpY, filled, angle = 0) {
  let x1 = map(col, 0, 4, 50, width - 50);
  let y1 = map(row, 0, 4, 50, height - 50);
  let x2 = map(col + 1, 0, 4, 50, width - 50);
  let y2 = map(row + 1, 0, 4, 50, height - 50);

  let cx = (x1 + x2) / 2;
  let cy = (y1 + y2) / 2;

  if (filled) {
    push();
    translate(cx, cy);
    rotate(angle);
    translate(-cx, -cy);

    stroke(0, 0, 150);
    noFill();
    rect(x1, y1, x2 - x1, y2 - y1);

    for (let i = 1; i < 5; i++) {
      let y = map(i, 0, 5, y1, y2);
      line(x1, y, x2, y);
    }

    for (let i = 1; i < 5; i++) {
      let x = map(i, 0, 5, x1, x2);
      line(x, y1, x, y2);
    }

    // Diagonals to vanishing point
    line(x1, y1, vpX, vpY);
    line(x2, y1, vpX, vpY);
    line(x1, y2, vpX, vpY);
    line(x2, y2, vpX, vpY);

    pop();
  }
}

function mousePressed() {
  // Needed for some browsers to allow mic input
  userStartAudio();
  loop(); // Redraw continuously to respond to audio
}
