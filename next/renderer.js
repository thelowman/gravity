const renderSphere = (context, c, x, y, r) => {
  context.fillStyle = `rgba(${c.r * .5}, ${c.g * .5}, ${c.b * .5}, 0.5)`;
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2, true);
  context.fill();
  
  context.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, 0.5)`;
  context.beginPath();
  context.arc(x, y, r * .8, 0, Math.PI * 2, true);
  context.fill();

  context.fillStyle = `rgba(${c.r * 1.5}, ${c.g * 1.5}, ${c.b * 1.5}, 0.5)`;
  context.beginPath();
  context.arc(x, y, r * .2, 0, Math.PI * 2, true);
  context.fill();
}


const regEntry = () => {
  const colliding = [];
  const color = {
    r: Math.random() * 255,
    g: Math.random() * 255,
    b: Math.random() * 255
  };
  return {
    colliding,
    render: (context, thing) => {
      if (colliding.length === 0) {
        renderSphere(context, color, thing.x, thing.y, Math.sqrt(thing.mass));
      }
    },
    consume: (context, thing) => {},
    crashInto: (context, thing) => {}
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