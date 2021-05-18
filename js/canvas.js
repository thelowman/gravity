/*
  Prepares a canvas element for rendering.
*/

/**
 * @typedef CanvasSetup
 * @property {CanvasRenderingContext2D} ctx
 * @property {number} minMaxX Maximum x value (positive or negative)
 * @property {number} minMaxY Maximum y value (positive or negative)
 */

/**
 * Initializes the canvas element.
 * @param {HTMLCanvasElement} canvas 
 * @returns {CanvasSetup}
 */
const init = canvas => {
  const ctx = canvas.getContext('2d', { alpha: false });

  const { width, height } = canvas.getClientRects()[0];
  let minMaxX = canvas.width * 1.2;
  let minMaxY = canvas.height * 1.2;

  ctx.resetTransform();
  ctx.translate(Math.floor(width / 2), Math.floor(height / 2));
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