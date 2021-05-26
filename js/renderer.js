/*
  Renders objects to the canvas.  Worker threads can only post data back
  to the UI, so this script keeps a registry with stateful information
  about individual objects.  Currently that's just the color and a small
  render function but there all kinds of possibilities.
*/

import './types.js';

/** Holds the state of all rendered objects. */
let registry = {};


/**
 * Renders a gradient filled circle at the specified
 * coordinates using the specified color.
 * @param {CanvasRenderingContext2D} context 
 * @param {Color} c The color of the sphere.
 * @param {number} x X coordinate of the sphere's center.
 * @param {number} y Y coordinate of the sphere's center.
 * @param {number} r The radius of the sphere in pixels.
 */
const renderSphere = (context, c, x, y, r) => {
  let gradient = context.createRadialGradient(x, y, r, x-r/3, y+r/3, 0);
  gradient.addColorStop(0, `rgba(${c.r / 10},${c.g / 10},${c.b / 10})`);
  gradient.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b})`);
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2, true);
  context.fill();
}

/**
 * Draws a line indicating the sum G force on an object.
 * @param {CanvasRenderingContext2D} context 
 * @param {Thing} thing 
 */
const renderG = (context, thing) => {
  context.strokeStyle = '#88f';
  context.beginPath();
  context.moveTo(thing.x, thing.y);
  context.lineTo(thing.g.x + thing.x, thing.g.y + thing.y);
  context.stroke(); 
}

/**
 * Draws a line indicating the object's velocity and direction.
 * @param {CanvasRenderingContext2D} context 
 * @param {Thing} thing 
 */
const renderV = (context, thing) => {
  context.strokeStyle = '#ff0';
  context.beginPath();
  context.moveTo(thing.x, thing.y);
  context.lineTo(thing.v.x * -5 + thing.x, thing.v.y * -5 + thing.y);
  context.stroke(); 
}

/**
 * Modifies a color by recursively blending colors of other
 * objects that the provided Thing is colliding with based
 * on their relative mass.
 * @param {Thing} thing 
 * @param {Color} color 
 */
const blendColors = (thing, color) => {
  if (!thing.coll) return color;
  if (!registry[thing.coll.id]) return color;
  let ratio = thing.coll.mass / thing.mass;
  color.r += registry[thing.coll.id].color.r * ratio;
  color.g += registry[thing.coll.id].color.g * ratio;
  color.b += registry[thing.coll.id].color.b * ratio;
  let max = color.r;
  if (color.g > max) max = color.g;
  if (color.b > max) max = color.b;
  if (max > 255) {
    let adj = max - 255;
    color.r = color.r > adj ? color.r - adj : 0;
    color.g = color.g > adj ? color.g - adj : 0;
    color.b = color.b > adj ? color.b - adj : 0;
  }
  delete registry[thing.coll.id];
  return blendColors(thing.coll, color);
}

/**
 * Creates a new entry in the registry.
 * @returns {RegEntry}
 */
const regEntry = () => {
  const color = { r: 0, g: 0, b: 0 };
  let bias = Math.random() * 3;
  if (bias > 2) color.r = (Math.random() * 80) + 175;
  else if (bias > 1) color.g = (Math.random() * 80) + 175;
  else color.b = (Math.random() * 80) + 175;
  return {
    color,
    render: (context, thing) => {
      blendColors(thing, color);
      renderSphere(context, color, thing.x, thing.y, Math.sqrt(thing.mass));
      renderV(context, thing);
      renderG(context, thing);
    }
  }
}

/**
 * Ensures the provided Thing object is in the registry.
 * @param {Thing} thing 
 */
const register = thing => {
  if (!registry[thing.id]) registry[thing.id] = regEntry();
}

/** Indicates that a reset should be performed after the next render cycle. */
let resetting = false;

/**
 * Renders all Things to the canvas and removes unused registry entries.
 * @param {CanvasRenderingContext2D} context 
 * @param {Thing[]} things 
 */
const render = (context, things) => {
  let obsolete = Object.keys(registry);
  for(let i = 0; i < things.length; i++) {
    registry[things[i].id].render(context, things[i]);
    let tIndex = obsolete.indexOf(things[i].id);
    if (tIndex > -1) obsolete.splice(tIndex, 1);
  }
  if (resetting) {
    registry = {};
    resetting = false;
  }
  else {
    for(let i = 0; i < obsolete.length; i++) delete registry[obsolete[i]];
  }
}

export default {
  register,
  render,
  reset: () => resetting = true
}