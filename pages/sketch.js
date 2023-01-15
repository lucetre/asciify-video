const density = "Ñ@#W$9876543210?!abc;:+=-,._               ";
// const density = '       .:-i|=+%O#@'

let video, capture;
let asciiDiv;

var leftBuffer;
var rightBuffer;

function setup() {
  capture = createCapture(VIDEO);
  capture.hide();

  video = createCapture(VIDEO);
  video.size(64, 48);
  video.hide();
  asciiDiv = createDiv();

  // 800 x 400 (double width to make room for each "sub-canvas")
  createCanvas(400, 400);
  // Create both of your off-screen graphics buffers
  leftBuffer = createGraphics(400, 400);
  // rightBuffer = createGraphics(400, 400);
}

function draw() {
  // Draw on your buffers however you like
  drawLeftBuffer();
  drawAscii();
  // drawRightBuffer();

  // Paint the off-screen buffers onto the main canvas
  image(leftBuffer, 0, 0);
  // image(rightBuffer, 400, 0);
}

function drawLeftBuffer() {
  // leftBuffer.background(0, 0, 0);
  // leftBuffer.fill(255, 255, 255);
  leftBuffer.textSize(32);
  leftBuffer.text("Original Video", 90, 50);

  leftBuffer.image(
    capture,
    0,
    80,
    leftBuffer.width,
    (leftBuffer.width * capture.height) / capture.width
  );
  leftBuffer.filter(INVERT);
}

// function drawRightBuffer() {
// rightBuffer.background(255, 100, 255);
// rightBuffer.fill(0, 0, 0);
// rightBuffer.textSize(32);
// rightBuffer.text("This is the right buffer!", 50, 50);
// }

function drawAscii() {
  video.loadPixels();
  let asciiImage = "";
  for (let j = 0; j < video.height; j++) {
    for (let i = 0; i < video.width; i++) {
      const pixelIndex = (i + j * video.width) * 4;
      const r = video.pixels[pixelIndex + 0];
      const g = video.pixels[pixelIndex + 1];
      const b = video.pixels[pixelIndex + 2];
      const avg = (r + g + b) / 3;
      const len = density.length;
      const charIndex = floor(map(avg, 0, 255, len, 0));
      const c = density.charAt(charIndex);
      if (c == " ") asciiImage += "&nbsp;";
      else asciiImage += c;
    }
    asciiImage += "<br/>";
  }
  asciiDiv.html(asciiImage);
}
