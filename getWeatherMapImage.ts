import Jimp from 'jimp';
import { MapLocationData, MapSize, CachedMapsData, AssetsData, Point, Character } from './types';

const cachedMaps: CachedMapsData = {
  small: null,
  regular: null
};

let assets: AssetsData | null = null

async function openAssets(): Promise<AssetsData> {
  const map = await Jimp.read('./map_assets/empty_map.png');
  const sunny = await Jimp.read('./map_assets/weather_symbol_sunny.png');
  const partlyCloudy = await Jimp.read('./map_assets/weather_symbol_partly_cloudy.png');
  const cloudy = await Jimp.read('./map_assets/weather_symbol_cloudy.png');
  const rain = await Jimp.read('./map_assets/weather_symbol_rain.png');
  const snow = await Jimp.read('./map_assets/weather_symbol_snow.png');
  const empty = await Jimp.read('./map_assets/char_empty.png');
  const minus = await Jimp.read('./map_assets/char_minus.png');
  const degree = await Jimp.read('./map_assets/char_deg.png');
  const madeByText = await Jimp.read('./map_assets/made_by_text.png');
  const _0 = await Jimp.read('./map_assets/char_0.png');
  const _1 = await Jimp.read('./map_assets/char_1.png');
  const _2 = await Jimp.read('./map_assets/char_2.png');
  const _3 = await Jimp.read('./map_assets/char_3.png');
  const _4 = await Jimp.read('./map_assets/char_4.png');
  const _5 = await Jimp.read('./map_assets/char_5.png');
  const _6 = await Jimp.read('./map_assets/char_6.png');
  const _7 = await Jimp.read('./map_assets/char_7.png');
  const _8 = await Jimp.read('./map_assets/char_8.png');
  const _9 = await Jimp.read('./map_assets/char_9.png');

  assets = {
    map,
    madeByText, 
    symbols: {
      sunny,
      partlyCloudy,
      cloudy,
      rain,
      snow
    },
    chars: {
      empty,
      minus,
      degree,
      0: _0,
      1: _1,
      2: _2,
      3: _3,
      4: _4,
      5: _5,
      6: _6,
      7: _7,
      8: _8,
      9: _9
    }
  }

  return assets;
}

async function getWeatherMapImage(type: MapSize, data: MapLocationData[]): Promise<Buffer> {
  const cachedData = cachedMaps[type];

  if (cachedData && new Date().getTime() - cachedData.timestamp < 1000 * 60 * 60) {
    return cachedData.buffer;
  }

  const mapAssets = assets || await openAssets();

  const map = type === 'small' ?  mapAssets.map.clone().resize(200, 200) : mapAssets.map.clone();

  for (const location of data) {
    if (location.appliesToSize.includes(type)) {
      const symbolPosition: Point =  {
        x: type === 'small' ? Math.round(location.position.x * 0.4) - 22 : location.position.x - 25,
        y: type === 'small' ? Math.round(location.position.y * 0.4) - 22 : location.position.y - 25
      }

      const symbol = type === 'small'
        ? mapAssets.symbols[location.weather].clone().resize(44, 44)
        : mapAssets.symbols[location.weather].clone();

      map.composite(symbol, symbolPosition.x, symbolPosition.y)

      const temperatureLabel = await new Promise<Jimp>(resolve => {
        new Jimp(130, 63, 0x00000099, (err, image) => resolve(image))
      });

      const temperatureChars = String(location.temp)
        .split('')
        .reverse()
        .reduce((charsData: Character[], char, index) => {
          const insertIndex = charsData.length - 2 - index;
          charsData[insertIndex] = char === '-'
            ? 'minus'
            : (char as Character)

          return charsData;
        }, ['empty', 'empty', 'empty', 'degree'])
        .map((char, index) => ({
          image: mapAssets.chars[char].clone(),
          positionX: 5 + index * 30
        }));

      for (let temperatureChar of temperatureChars) {
        temperatureLabel.composite(temperatureChar.image, temperatureChar.positionX, 3);
      }

      temperatureLabel.resize(
        type === 'small' ? 30 : 50, 
        type === 'small' ? 14 : 24
      );

      map.composite(
        temperatureLabel,
        type === 'small' ? Math.round(location.position.x * 0.4) - 15 : location.position.x - 25,
        type === 'small' ? Math.round(location.position.y * 0.4) + 22 : location.position.y + 25
      );
    }
  }

  const madeByTextLayer = await new Promise<Jimp>(resolve => {
    new Jimp(
      type === 'small' ? 90 : 155,
      type === 'small' ? 13 : 21,
      0x00000099,
      (err, image) => resolve(image)
    )
  });
  
  madeByTextLayer.composite(
    type === 'small' ? mapAssets.madeByText.clone().resize(78, 7) : mapAssets.madeByText,
    type === 'small' ? 6 : 10,
    type === 'small' ? 3 : 5
  )

  map.composite(
    madeByTextLayer,
    type === 'small' ? 110 : 345,
    type === 'small' ? 187 : 479
  );

  const mapImageBuffer = await map.getBufferAsync(Jimp.MIME_GIF);

  cachedMaps[type] = {
    timestamp: new Date().getTime(),
    buffer: mapImageBuffer
  }
  
  return mapImageBuffer
}

export default getWeatherMapImage;