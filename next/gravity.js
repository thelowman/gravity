import canvas from './canvas.js';
import renderer from './renderer.js';
const { ctx, minMaxX, minMaxY } = canvas();

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
