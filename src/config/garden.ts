// Placement of the animated insects in the hero garden, taken from
// docs/assets/garden/source/garden-manifest.json. x, y and size are
// percentages of the 2000 x 3000 scene; drift and flap are cycle lengths
// in seconds (flap 0 means the wings do not close).
export type GardenInsect = {
  name: string;
  closed: string | null;
  x: number;
  y: number;
  size: number;
  rotate: number;
  drift: number;
  flap: number;
};

export const gardenInsects: GardenInsect[] = [
  {
    name: 'butterfly-swallowtail',
    closed: 'butterfly-swallowtail-closed',
    x: 31.25,
    y: 42.33,
    size: 6.50,
    rotate: 12.6,
    drift: 11,
    flap: 3.1,
  },
  {
    name: 'butterfly-admiral',
    closed: 'butterfly-admiral-closed',
    x: 65.75,
    y: 58.67,
    size: 5.25,
    rotate: -17.2,
    drift: 13,
    flap: 3.7,
  },
  {
    name: 'butterfly-blue',
    closed: 'butterfly-blue-closed',
    x: 55.50,
    y: 49.33,
    size: 3.25,
    rotate: 9.2,
    drift: 9,
    flap: 2.6,
  },
  {
    name: 'dragonfly',
    closed: null,
    x: 68.00,
    y: 40.17,
    size: 5.30,
    rotate: -22.9,
    drift: 7,
    flap: 0,
  },
  {
    name: 'bee',
    closed: null,
    x: 24.60,
    y: 68.00,
    size: 2.40,
    rotate: 20.1,
    drift: 5,
    flap: 0,
  },
];

/** Back-to-front depth layers and how far each moves with the pointer, in px. */
export const gardenLayers = [
  { name: 'sky', travel: 1.5 },
  { name: 'distance', travel: 3 },
  { name: 'lawn', travel: 6 },
  { name: 'midground', travel: 9 },
] as const;

export const gardenForegroundTravel = 12;
export const gardenInsectTravel = 10;
