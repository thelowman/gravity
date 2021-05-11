const renderSphere = (context, s, x, y, r) => {
  context.fillStyle = s;
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2, true);
  context.fill();
}

const rock = (context, thing) => 
  renderSphere(context, '#666', thing.x, thing.y, thing.mass / 12)

const planetoid = (context, thing) => 
  renderSphere(context, '#aaa', thing.x, thing.y, thing.mass / 15)

const smPlanet = (context, thing) => 
  renderSphere(context, '#bbb', thing.x, thing.y, thing.mass / 18)

const earthy = (context, thing) => 
  renderSphere(context, '#00f', thing.x, thing.y, thing.mass / 20)

const jovian = (context, thing) => 
  renderSphere(context, '#0f0', thing.x, thing.y, thing.mass / 25)

const sun = (context, thing) => 
  renderSphere(context, '#ff0', thing.x, thing.y, thing.mass / 30)

const redGiant = (context, thing) => 
  renderSphere(context, '#f00', thing.x, thing.y, thing.mass / 40)

const neutronStar = (context, thing) => 
  renderSphere(context, '#fff', thing.x, thing.y, thing.mass / 50)

const blackHole = (context, thing) => 
  renderSphere(context, '#000', thing.x, thing.y, thing.mass / 100)

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