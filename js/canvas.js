/*
  Prepares a canvas element for rendering.
*/

import './types.js';

/**
 * Initializes the canvas element.
 * @param {HTMLCanvasElement} canvas 
 * @returns {CanvasSetup}
 */
const init = canvas => {
  const ctx = canvas.getContext('2d', { alpha: false });

  const { width, height } = canvas.getClientRects()[0];
  let minMaxX = Math.floor(width * .5);
  let minMaxY = Math.floor(height * .5);

  ctx.resetTransform();
  ctx.translate(Math.floor(minMaxX), Math.floor(minMaxY));
  ctx.scale(1, -1);
  return { ctx, minMaxX, minMaxY };
}

/**
 * Looks for a canvas element with an ID of "gravity".  If it exists,
 * the output will be rendered there.  If it doesn't exist then create
 * one and make it full screen.
 * @returns {CanvasSetup}
 */
export default () => {
  const existing = document.getElementById('gravity');
  if (existing && existing instanceof(HTMLCanvasElement)) return init(existing);

  const canvas = document.body.appendChild(document.createElement('canvas'));
  // Try to prevent scroll bars.
  // This should work but for best results the container should have:
  // background-color: #000
  // overflow: hidden
  canvas.width =  window.innerWidth - 2;
  canvas.height = window.innerHeight - 4;
  return init(canvas);
}