var segmentationData;

function createSimplePalette() {
  options.palette = bodypix.config.palette;
  Object.keys(options.palette).forEach((part) => {
    options.palette[part].color = [100, 100, 100];
  });
}

function createHSBPalette() {
  colorMode(HSB);
  options.palette = bodypix.config.palette;
  Object.keys(options.palette).forEach((part) => {
    const h = floor(random(360));
    const s = floor(random(100));
    const b = floor(random(100));
    const c = color(h, s, b);
    options.palette[part].color = c;
  });
}

function createRGBPalette() {
  colorMode(RGB);
  options.palette = bodypix.config.palette;
  Object.keys(options.palette).forEach((part) => {
    const r = floor(random(255));
    const g = floor(random(255));
    const b = floor(random(255));
    const c = color(r, g, b);
    options.palette[part].color = c;
  });
}
