const renderSphere = (context, s, x, y, r) => {
  context.fillStyle = s;
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2, true);
  context.fill();
}

const rock = thing => ({
  render: context => renderSphere(context, '#666', thing.x, thing.y, thing.mass / 12)
});

const planetoid = thing => ({
  render: context => renderSphere(context, '#aaa', thing.x, thing.y, thing.mass / 15)
});

const smPlanet = thing => ({
  render: context => renderSphere(context, '#bbb', thing.x, thing.y, thing.mass / 18)
});

const earthy = thing => ({
  render: context => renderSphere(context, '#00f', thing.x, thing.y, thing.mass / 20)
});

const jovian = thing => ({
  render: context => renderSphere(context, '#0f0', thing.x, thing.y, thing.mass / 25)
});

const sun = thing => ({
  render: context => renderSphere(context, '#ff0', thing.x, thing.y, thing.mass / 30)
});

const redGiant = thing => ({
  render: context => renderSphere(context, '#f00', thing.x, thing.y, thing.mass / 40)
});

const neutronStar = thing => ({
  render: context => renderSphere(context, '#fff', thing.x, thing.y, thing.mass / 50)
});

const blackHole = thing => ({
  render: context => renderSphere(context, '#000', thing.x, thing.y, thing.mass / 100)
});


let registry = {};
const register = thing => {
  if (!registry[thing.id]) registry[thing.id] = 
    thing.mass < 150 ? rock(thing) :
    thing.mass < 700 ? planetoid(thing) :
    thing.mass < 800 ? smPlanet(thing) :
    thing.mass < 900 ? earthy(thing) :
    thing.mass < 1200 ? jovian(thing) :
    thing.mass < 1500 ? sun(thing) :
    thing.mass < 2000 ? redGiant(thing) :
    thing.mass < 2500 ? neutronStar(thing) :
    blackHole(thing);
}
const render = (context, things) => {
  let obsolete = Object.keys(registry);
  for(let i = 0; i < things.length; i++) {
    registry[things[i].id].render(context);
    let tIndex = obsolete.indexOf(things[i].id);
    if (tIndex > -1) obsolete.splice(tIndex, 1);
  }
}

export default {
  register,
  render
}