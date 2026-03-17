const fs = require('fs');

async function check() {
  const buffer = fs.readFileSync('public/assets/IllustrasiLogin.png');
  // It's a PNG. Header: 8 bytes. IHDR: ...
  // PNG parsing is annoying. We'll just run a python script since python has standard libraries or we can just use python to read the pixel.
}
check();
