const density = "Ñ@#W$9876543210?!abc;:+=-,._        ";
// const density = '    .:-i|=+%O#@ '

let video, capture, segData, partMask;
let asciiDiv;

var leftBuffer;
var rightBuffer;

const CapturePreviewWidth = 600;
const CapturePreviewHeight = 600;

const options = {
  outputStride: 32, // 8, 16, or 32, default is 16
  segmentationThreshold: 0.1, // 0 - 1, defaults to 0.5
};

function preload() {
  bodypix = ml5.bodyPix(options);
}

function gotResults(err, segmentation) {
  if (err) {
    partMask = null;
    segData = null;
    console.log(err);
    bodypix.segmentWithParts(video, gotResults, options);
    return;
  }
  partMask = segmentation.partMask;
  segData = segmentation.segmentation.data;
  bodypix.segmentWithParts(video, gotResults, options);
}

function setup() {
  capture = createCapture(VIDEO);
  capture.hide();

  video = createCapture(VIDEO);
  video.size(64, 48);
  video.hide();
  asciiDiv = createDiv();

  createCanvas(CapturePreviewWidth * 2, CapturePreviewHeight);
  leftBuffer = createGraphics(CapturePreviewWidth, CapturePreviewHeight);
  // rightBuffer = createGraphics(CapturePreviewWidth, CapturePreviewHeight);

  // createHSBPalette();
  // createRGBPalette();
  createSimplePalette();

  bodypix.segmentWithParts(video, gotResults, options);
}

function draw() {
  // Draw on your buffers however you like
  drawLeftBuffer();
  // drawRightBuffer();
  drawAscii();

  // Paint the off-screen buffers onto the main canvas
  image(leftBuffer, 0, 0);
  // image(rightBuffer, CapturePreviewWidth, 0);
}

function drawLeftBuffer() {
  // leftBuffer.background(0, 0, 0);
  // leftBuffer.fill(255, 255, 255);
  // leftBuffer.textSize(32);
  // leftBuffer.text("Original Video", 90, 50);

  let capWidth, capHeight;
  if (capture.width > capture.height) {
    capWidth = leftBuffer.width;
    capHeight = (leftBuffer.height * capture.height) / capture.width;
  } else {
    capWidth = (leftBuffer.width * capture.width) / capture.height;
    capHeight = leftBuffer.height;
  }
  leftBuffer.image(
    capture,
    (leftBuffer.width - capWidth) / 2,
    (leftBuffer.height - capHeight) / 2,
    capWidth,
    capHeight
  );
}

function drawRightBuffer() {
  rightBuffer.fill(255, 255, 255);
  rightBuffer.textSize(32);
  rightBuffer.text("Rendered Video", 90, 50);

  if (partMask) {
    for (let j = 0; j < video.height; j++) {
      for (let i = 0; i < video.width; i++) {
        const idx = i + j * video.width;
        const pixelIndex = (i + j * video.width) * 4;

        if (segData[idx] === -1) {
          video.pixels[pixelIndex + 0] = 0;
          video.pixels[pixelIndex + 1] = 0;
          video.pixels[pixelIndex + 2] = 0;
        }
      }
    }

    rightBuffer.image(
      partMask,
      0,
      80,
      rightBuffer.width,
      (rightBuffer.width * video.height) / video.width
    );
  }
}

function drawAscii() {
  video.loadPixels();
  let asciiImage = "";
  for (let j = 0; j < video.height; j++) {
    for (let i = 0; i < video.width; i++) {
      const idx = i + j * video.width;
      const pixelIndex = (i + j * video.width) * 4;
      const r = video.pixels[pixelIndex + 0];
      const g = video.pixels[pixelIndex + 1];
      const b = video.pixels[pixelIndex + 2];
      let avg = (r + g + b) / 3;

      if (segData && segData[idx] === -1) {
        avg = Math.min(255, 50 + avg * 1.3);
      }
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
