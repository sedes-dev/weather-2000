import axios from 'axios';
import { MapLocationData, OpenMeteoApiResponseData, OpenMeteoHourlyData, WatherSymbol } from './types';
import locations from './locations';

function mapHourlyDataToWeatherSymbol(hourlyData: OpenMeteoHourlyData, index: number): WatherSymbol {
  return (hourlyData.snowfall[index] > 5
    ? 'snow'
    : hourlyData.rain[index] > 5 || hourlyData.showers[index] > 5
      ? 'rain'
      : hourlyData.cloudcover[index] > 90
        ? 'cloudy'
        : hourlyData.cloudcover[index] > 50
          ? 'partlyCloudy'
          : 'sunny');
}

async function getWatherData(): Promise<MapLocationData[]> {
  const openMeteoRequestResponses = await Promise.all(
    locations.map(location => {
      return axios.get<OpenMeteoApiResponseData>(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.coordinates.latitude}&longitude=${location.coordinates.longitude}&hourly=temperature_2m&hourly=cloudcover&hourly=snowfall&hourly=rain&hourly=showers`
      )
    })
  );

  return locations.reduce((locationsWeatherData: MapLocationData[], currentLocation, index) => {
    if (openMeteoRequestResponses[index]) {
      const openMeteoApiResponseData = openMeteoRequestResponses[index].data;

      const now = new Date();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const hour = now.getHours();
      const hourlyDate = `${now.getFullYear()}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}T${hour < 10 ? '0' : ''}${hour}:00`;
      const hourIndex = openMeteoApiResponseData.hourly.time.findIndex(timeString => timeString === hourlyDate);

      locationsWeatherData.push({
        position: currentLocation.mapPosition,
        temp: Math.round(openMeteoApiResponseData.hourly.temperature_2m[hourIndex]),
        weather: mapHourlyDataToWeatherSymbol(openMeteoApiResponseData.hourly, hourIndex),
        appliesToSize: currentLocation.mapSizes
      });
    }

    return locationsWeatherData;
  }, [])
}

export default getWatherData;