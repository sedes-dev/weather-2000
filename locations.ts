import { LocationData } from "./types";

const locations: LocationData[] = [
  {
    name: 'Warsaw',
    coordinates: {
      latitude:	52.237049,
      longitude:	21.017532
    },
    mapPosition: {
      x: 334,
      y: 220
    },
    mapSizes: ['small', 'regular']
  },
  {
    name: 'Carcow',
    coordinates: {
      latitude:	50.049683,
      longitude:	19.944544
    },
    mapPosition: {
      x: 286,
      y: 386
    },
    mapSizes: ['small', 'regular']
  },
  {
    name: 'Wroclaw',
    coordinates: {
      latitude:	51.107883,
      longitude:	17.038538
    },
    mapPosition: {
      x: 152,
      y: 320
    },
    mapSizes: ['small', 'regular']
  },
  {
    name: 'Gdansk',
    coordinates: {
      latitude:	51.107883,
      longitude:	17.038538
    },
    mapPosition: {
      x: 230,
      y: 66
    },
    mapSizes: ['small', 'regular']
  },
  {
    name: 'Szczecin',
    coordinates: {
      latitude:	53.428543,
      longitude:	14.552812
    },
    mapPosition: {
      x: 40,
      y: 140
    },
    mapSizes: ['small', 'regular']
  },
  {
    name: 'Bialystok',
    coordinates: {
      latitude:	53.117653,
      longitude:	23.125734
    },
    mapPosition: {
      x: 400,
      y: 170
    },
    mapSizes: ['regular']
  },
  {
    name: 'Rzeszow',
    coordinates: {
      latitude:	50.041187,
      longitude:	21.999121
    },
    mapPosition: {
      x: 380,
      y: 390
    },
    mapSizes: ['regular']
  },
  {
    name: 'Poznan',
    coordinates: {
      latitude:	52.409538,
      longitude:	16.931992
    },
    mapPosition: {
      x: 130,
      y: 226
    },
    mapSizes: ['regular']
  },
];

export default locations;