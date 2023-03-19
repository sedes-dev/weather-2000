import Jimp from "jimp";

export type MapSize = 'small' | 'regular';

export type WatherSymbol = 'sunny' | 'partlyCloudy' | 'cloudy' | 'rain' | 'snow'

export type Character = 'empty' | 'minus' | 'degree' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' 

export type Point = {x: number, y: number}

export type Coordinates = {latitude: number, longitude: number}

export type LocationData = {
  name: string,
  coordinates: Coordinates,
  mapPosition: Point,
  mapSizes: MapSize[]
}

export type MapLocationData = {
  position: Point
  temp: number
  weather: WatherSymbol
  appliesToSize: MapSize[]
}

export type CachedMapsData = {
  [mapSize in MapSize]: {
    timestamp: number,
    buffer: Buffer
  } | null;
};

export type AssetsData = {
  map: Jimp,
  madeByText: Jimp,
  symbols: {
    [watherSymbol in WatherSymbol]: Jimp
  },
  chars: {
    [character in Character]: Jimp
  }
}

export type OpenMeteoApiResponseData = {
  latitude: number,
  longitude: number,
  generationtime_ms: number,
  utc_offset_seconds: number,
  timezone: string,
  timezone_abbreviation: string,
  elevation: number,
  hourly_units:{
    time: string,
    temperature_2m: string,
    cloudcover: string,
    snowfall: string,
    rain: string
  },
  hourly: OpenMeteoHourlyData
}

export type OpenMeteoHourlyData = {
  time: string[],
  temperature_2m: number[],
  cloudcover: number[],
  snowfall: number[],
  rain: number[],
  showers: number[],
}
