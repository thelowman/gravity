export default () => {
  let canvasWidth,
  canvasHeight,
  minMaxX,
  minMaxY;
  // const minMaxX = 1000;
  // const minMaxY = 1000;

  const canvas = document.body.appendChild(document.createElement('canvas'));
  const ctx = canvas.getContext('2d');
  const resize = () => {
    // decrease the size to prevent scroll bars
    canvasWidth = window.innerWidth - 2;
    canvasHeight = window.innerHeight - 4;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    minMaxX = canvasWidth * .75;
    minMaxY = canvasHeight * .75;
    const scale = 1;
    // const scale = canvasWidth > canvasHeight ?
    //   canvasWidth / minMaxX * 1.5 :
    //   canvasHeight / minMaxY * 1.5;

    ctx.resetTransform();
    ctx.translate(Math.floor(canvasWidth / 2), Math.floor(canvasHeight / 2));
    ctx.scale(scale, scale * -1);
  }
  resize();

  return { ctx, minMaxX, minMaxY };
}