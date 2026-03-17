import fs from 'fs';
import { PNG } from 'pngjs';

const buffer = fs.readFileSync('public/assets/IllustrasiLogin.png');
const png = PNG.sync.read(buffer);

const r = png.data[0];
const g = png.data[1];
const b = png.data[2];
const a = png.data[3];

const hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
console.log('Top left pixel:', r, g, b, a);
console.log('Hex:', '#' + hex);
