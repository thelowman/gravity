const useExisting = () => {
  const canvas = document.getElementById('gravity');
  const ctx = canvas.getContext('2d', { alpha: false });

  const { width, height } = canvas.getClientRects()[0];
  let minMaxX = canvas.width * 1.2;
  let minMaxY = canvas.height * 1.2;

  ctx.resetTransform();
  ctx.translate(Math.floor(width / 2), Math.floor(height / 2));
  ctx.scale(1, -1);
  return { ctx, minMaxX, minMaxY };
}

export default () => {
  if (document.getElementById('gravity')) return useExisting();

  let canvasWidth,
  canvasHeight,
  minMaxX,
  minMaxY;

  const canvas = document.getElementById('gravity') ? 
    document.getElementById('gravity') : 
    document.body.appendChild(document.createElement('canvas'));

  const ctx = canvas.getContext('2d', { alpha: false });
  const resize = () => {
    // decrease the size to prevent scroll bars
    canvasWidth = window.innerWidth - 2;
    canvasHeight = window.innerHeight - 4;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    minMaxX = canvasWidth * .75;
    minMaxY = canvasHeight * .75;
    const scale = 1;

    ctx.resetTransform();
    ctx.translate(Math.floor(canvasWidth / 2), Math.floor(canvasHeight / 2));
    ctx.scale(scale, scale * -1);
  }
  resize();

  return { ctx, minMaxX, minMaxY };
}