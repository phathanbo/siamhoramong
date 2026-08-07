const fs = require('fs');

async function test() {
  const code = await fetch('https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js').then(r => r.text());
  
  // mock browser window
  global.window = {};
  eval(code);
  
  const Astronomy = global.window.Astronomy || global.Astronomy || Astronomy;
  
  const d = new Date(Date.UTC(2023, 0, 1, 12, 0, 0));
  const time = new Astronomy.MakeTime(d);
  
  const vec = Astronomy.GeoVector('Sun', time, true);
  const ecl = Astronomy.Ecliptic(vec);
  
  console.log("Sun Ecliptic:", ecl.elon, ecl.elat);
}
test().catch(console.error);
