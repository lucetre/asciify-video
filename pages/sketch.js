const density = "Ñ@#W$9876543210?!abc;:+=-,._        ";
// const density = '    .:-i|=+%O#@ '

let video, capture, segData, partMask;
let asciiDiv;

var buffer;

const CapturePreviewWidth = window.innerWidth;
const CapturePreviewHeight = 300;

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

function onAsciiSizeChange() {
  // console.log("onAsciiSizeChange");
  const width = document.getElementById("ascii-size-range").value;
  video.size(width, width*2/3);
}

function setup() {
  capture = createCapture(VIDEO);
  capture.hide();

  video = createCapture(VIDEO);
  video.size(64, 48);
  video.hide();
  asciiDiv = createDiv();

  createCanvas(CapturePreviewWidth, CapturePreviewHeight);
  buffer = createGraphics(CapturePreviewWidth, CapturePreviewHeight);

  createSimplePalette();
  bodypix.segmentWithParts(video, gotResults, options);
}

function draw() {
  // Draw on your buffers however you like
  drawBuffer();
  drawAscii();

  // Paint the off-screen buffers onto the main canvas
  image(buffer, 0, 0);
}

function drawBuffer() {
  let capWidth, capHeight;
  if (capture.width > capture.height) {
    capWidth = buffer.width;
    capHeight = (capture.height * buffer.width) / capture.width;
    if (capHeight > buffer.height) {
      capWidth = (capture.width * buffer.height) / capture.height;
      capHeight = buffer.height;
    }
  } else {
    capWidth = (capture.width * buffer.height) / capture.height;
    capHeight = buffer.height;
    if (capWidth > buffer.width) {
      capWidth = buffer.width;
      capHeight = (capture.height * buffer.width) / capture.width;
    }
  }
  buffer.image(
    capture,
    (buffer.width - capWidth) / 2,
    (buffer.height - capHeight) / 2,
    capWidth,
    capHeight
  );
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
