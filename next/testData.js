// Test 1 - Equal, non-moving initially
const test1 = [
  {
    i: 0,
    x: -100,
    y: -100,
    mass: 100,
    v: { x: 0, y: 0 },
    g: { x: 0, y: 0 }
  },
  {
    i: 1,
    x: 100,
    y: 100,
    mass: 100,
    v: { x: 0, y: 0 },
    g: { x: 0, y: 0 }
  }
];

// Test 2 - Equal 90 deg. movement.
const test2 = [
  {
    i: 0,
    x: -100,
    y: 0,
    mass: 100,
    v: { x: 2, y: 2 },
    g: { x: 0, y: 0 }
  },
  {
    i: 1,
    x: 100,
    y: 0,
    mass: 100,
    v: { x: -2, y: 2 },
    g: { x: 0, y: 0 }
  }
];

// Test 3 - Non-equal, non-moving initially
const test3 = [
  {
    i: 0,
    x: -100,
    y: -100,
    mass: 50,
    v: { x: 0, y: 0 },
    g: { x: 0, y: 0 }
  },
  {
    i: 1,
    x: 100,
    y: 100,
    mass: 600,
    v: { x: 0, y: 0 },
    g: { x: 0, y: 0 }
  }
];

// Test 4 - Non-equal 90 deg. movement.
const test4 = [
  {
    i: 0,
    x: 100,
    y: 0,
    mass: 600,
    v: { x: -2, y: 2 },
    g: { x: 0, y: 0 }
  },
  {
    i: 1,
    x: -100,
    y: 0,
    mass: 50,
    v: { x: 2, y: 2 },
    g: { x: 0, y: 0 }
  }
];

// Test 4.5 - Non-equal 90 deg. movement. (opposite of 4)
const test4_5 = [
  {
    i: 0,
    x: -100,
    y: 0,
    mass: 50,
    v: { x: 2, y: 2 },
    g: { x: 0, y: 0 }
  },
  {
    i: 1,
    x: 100,
    y: 0,
    mass: 600,
    v: { x: -2, y: 2 },
    g: { x: 0, y: 0 }
  }
];

// Test 5 - Equal, non-moving initially Explode!
const test5 = [
  {
    i: 0,
    x: -200,
    y: 0,
    mass: 3450,
    v: { x: 0, y: 0 },
    g: { x: 0, y: 0 }
  },
  {
    i: 1,
    x: 200,
    y: 0,
    mass: 100,
    v: { x: 0, y: 0 },
    g: { x: 0, y: 0 }
  }
];