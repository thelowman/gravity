const renderSphere = (context, c, x, y, r) => {
  let gradient = context.createRadialGradient(x, y, r, x-r/3, y+r/3, 0);
  gradient.addColorStop(0, `rgba(${c.r / 10},${c.g / 10},${c.b / 10})`);
  gradient.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b})`);
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2, true);
  context.fill();
}


const blendColors = (thing, color) => {
  if (!thing.coll) return color;
  if (!registry[thing.coll.id]) return color;
  color.r += registry[thing.coll.id].color.r;
  color.g += registry[thing.coll.id].color.g;
  color.b += registry[thing.coll.id].color.b;
  if (color.r > 255) color.r = 255;
  if (color.g > 255) color.g = 255;
  if (color.b > 255) color.b = 255;
  delete registry[thing.coll.id];
  return blendColors(thing.coll, color);
}

const regEntry = () => {
  const color = { r: 0, g: 0, b: 0 };
  let bias = Math.random() * 3;
  if (bias > 2) color.r = Math.random() * 80;
  else if (bias > 1) color.g = Math.random() * 80;
  else color.b = Math.random() * 80;
  return {
    color,
    render: (context, thing) => {
      blendColors(thing, color);
      renderSphere(context, color, thing.x, thing.y, Math.sqrt(thing.mass));
    }
  }
}


let registry = {};
const register = thing => {
  if (!registry[thing.id]) registry[thing.id] = regEntry();
}
const render = (context, things) => {
  let obsolete = Object.keys(registry);
  for(let i = 0; i < things.length; i++) {
    registry[things[i].id].render(context, things[i]);
    let tIndex = obsolete.indexOf(things[i].id);
    if (tIndex > -1) obsolete.splice(tIndex, 1);
  }
}

export default {
  register,
  render
}