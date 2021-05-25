/*
  This is the main script.  It controls a worker thread which
  repeatedly recalculates the effect of gravity and calls the
  main render function on every update.
*/

import canvas from './canvas.js';
import renderer from './renderer.js';
const { ctx, minMaxX, minMaxY } = canvas();

/** Sets a reasonable maximum number of rendered objects based on the canvas size. */
const maxObjects = Math.floor(Math.sqrt(minMaxX * minMaxY) / 2);
/** Automatically reset when the number of objects gets below this number. */
const minObjects = Math.floor(Math.sqrt(maxObjects));


/** The render loop. */
const render = things => {
  ctx.fillStyle = '#000';
  ctx.fillRect(minMaxX * -1, minMaxY * -1, minMaxX * 2, minMaxY * 2);
  renderer.render(ctx, things);

  // // Draw a small white circle in the center.
  // ctx.fillStyle = '#fff';
  // ctx.beginPath();
  // ctx.arc(0, 0, 2, 0, Math.PI * 2, true);
  // ctx.fill();
}

/** Spawn a worker thread. */
const worker = new Worker('js/worker/worker.js', { type: 'module' });
/** The worker supplies an array of objects that need to be rendered. */
worker.onmessage = e => {
  e.data.sort((a, b) => a.mass > b.mass ? -1 : a.mass < b.mass ? 1 : 0);
  for(let i = 0; i < e.data.length; i++) renderer.register(e.data[i]);
  requestAnimationFrame(() => render(e.data));
  if (e.data.length < minObjects) {
    renderer.reset();
    worker.postMessage({ cmd: 'restart' });
  }
}
/** Fire up the worker. */
worker.postMessage({ params: { minMaxX, minMaxY, numObjects: maxObjects } });


// The worker thread should be paused when the window isn't visible.
// MDN - https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
// Set the name of the hidden property and the change event for visibility
let hidden, visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  hidden = "hidden";
  visibilityChange = "visibilitychange";
// @ts-ignore
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
// @ts-ignore
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}
function handleVisibilityChange() {
  if (document[hidden]) worker.postMessage({ cmd: 'stop' });
  else worker.postMessage({ cmd: 'resume'});
}
document.addEventListener(visibilityChange, handleVisibilityChange, false);