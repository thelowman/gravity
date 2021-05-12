/** Vector to point. (copy) */
const vToP = (ang, mag) => ({
  x: mag * Math.cos(ang),
  y: mag * Math.sin(ang)
});
/** degrees to radians. (copy) */
const dtor = d => d * Math.PI / 180;


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

const rock = (context, thing) => 
  renderSphere(context, { r: 102, g: 102, b: 102 }, thing.x, thing.y, thing.mass / 12)

const planetoid = (context, thing) => 
  renderSphere(context, { r: 170, g: 170, b: 170 }, thing.x, thing.y, thing.mass / 15)

const smPlanet = (context, thing) => 
  renderSphere(context, { r: 187, g: 187, b: 187 }, thing.x, thing.y, thing.mass / 18)

const earthy = (context, thing) => 
  renderSphere(context, { r: 0, g: 0, b: 255 }, thing.x, thing.y, thing.mass / 20)

const jovian = (context, thing) => 
  renderSphere(context, { r: 0, g: 255, b: 0 }, thing.x, thing.y, thing.mass / 25)

const sun = (context, thing) => 
  renderSphere(context, { r: 255, g: 255, b: 0 }, thing.x, thing.y, thing.mass / 30)

const redGiant = (context, thing) => 
  renderSphere(context, { r: 255, g: 0, b: 0 }, thing.x, thing.y, thing.mass / 40)

const neutronStar = (context, thing) => 
  renderSphere(context, { r: 255, g: 255, b: 255 }, thing.x, thing.y, thing.mass / 50)

const blackHole = (context, thing) => 
  renderSphere(context, { r: 0, g: 0, b: 0 }, thing.x, thing.y, thing.mass / 100)

const regEntry = () => {
  const colliding = [];
  return {
    colliding,
    render: (context, thing) => {
      if (colliding.length === 0) {
        const renderObject = 
        thing.mass < 150 ? rock :
        thing.mass < 700 ? planetoid :
        thing.mass < 800 ? smPlanet :
        thing.mass < 900 ? earthy :
        thing.mass < 1200 ? jovian :
        thing.mass < 1500 ? sun :
        thing.mass < 2000 ? redGiant :
        thing.mass < 2500 ? neutronStar :
        blackHole;
        renderObject(context, thing);
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