import canvas from './canvas.js';
import renderer from './renderer.js';
const { ctx, minMaxX, minMaxY } = canvas();


const objectType = mass => {
  if (mass < 150)  return { d: mass / 12, c: '#666' }; // rock
  if (mass < 700)  return { d: mass / 15, c: '#aaa' }; // planetoid
  if (mass < 800)  return { d: mass / 18, c: '#bbb' }; // small planet
  if (mass < 900)  return { d: mass / 20, c: '#00f' }; // earthy
  if (mass < 1200) return { d: mass / 25, c: '#0f0' }; // jovian
  if (mass < 1500) return { d: mass / 30, c: '#ff0' }; // sun
  if (mass < 2000) return { d: mass / 40, c: '#f00' }; // red giant
  if (mass < 2500) return { d: mass / 50, c: '#fff' }; // neutron star
  return { d: mass / 100, c: '#000' } // black hole
}

const render = things => {
  ctx.fillStyle = '#000';
  ctx.fillRect(minMaxX * -1, minMaxY * -1, minMaxX * 2, minMaxY * 2);
  renderer.render(ctx, things);
}

const worker = new Worker('worker.js');
worker.onmessage = e => {
  e.data.things.sort((a, b) => a.mass > b.mass ? -1 : a.mass < b.mass ? 1 : 0);
  for(let i = 0; i < e.data.things.length; i++) renderer.register(e.data.things[i]);
  requestAnimationFrame(() => render(e.data.things));
  // requestAnimationFrame(() => render(e.data.things, e.data.time));
  if (e.data.things.length < 20) worker.postMessage({ cmd: 'restart' });
}
worker.postMessage({ params: { minMaxX, minMaxY, numObjects: 500 } });


// MDN - https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
// Set the name of the hidden property and the change event for visibility
let hidden, visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}
function handleVisibilityChange() {
  if (document[hidden]) worker.postMessage({ cmd: 'stop' });
  else worker.postMessage({ cmd: 'resume'});
}
document.addEventListener(visibilityChange, handleVisibilityChange, false);











// NOT USED
/** Blow stuff up if it gets too heavy. */
const explode = thing => {
  let mass = thing.mass;
  let part = 0;
  let masses = [];
  while(part < mass) {
    part = Math.random() * .35 * thing.mass;
    masses.push(part);
    mass -= part;
  }
  const angleInc = Math.PI * 2 / masses.length;
  let nextAngle = angleInc;
  for(let i = 0; i < masses.length; i++) {
    const exMove = vToP(nextAngle, 10);
    nextAngle += angleInc;
    things.push({
      i: 0,
      x: thing.x,
      y: thing.y,
      mass: masses[i],
      v: { x: exMove.x + thing.v.x, y: exMove.y + thing.v.y },
      g: { x: 0, y: 0 }
    });
  }
}
