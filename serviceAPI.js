import * as Location from 'expo-location';

// npm install babel-plugin-inline-dotenv
// .ENV VARIABLES
const { TRANSPORT_API_KEY } = process.env;
const { TRANSPORT_API_ID } = process.env;
const getStationsListAPI = 'http://transportapi.com/v3/uk/places.json?';
const getTimetableAPI = 'https://transportapi.com/v3/uk/train/station/';
const { PHOTOS_API_KEY } = process.env;
const { PHOTOS_SECRET_KEY } = process.env;
const { OPENTRIPMAP_API_KEY } = process.env;

// GET USER LOCATION API
export const getLocationAPI = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return console.error('Permission to access location was denied');
  }
  const locationResult = await Location.getCurrentPositionAsync({});
  return locationResult;
};

// GET LOCAL TRAIN STATIONS REQUEST
export const findLocalTrainStations = async (userLocationData) => {
  console.log('API CALL - FIND LOCAL STATIONS');

  const searchType = 'train_station';
  const min_lat = (userLocationData.coords.latitude - 0.1).toFixed(3);
  const min_lon = (userLocationData.coords.longitude - 0.1).toFixed(3);
  const max_lat = (userLocationData.coords.latitude + 0.1).toFixed(3);
  const max_lon = (userLocationData.coords.longitude + 0.1).toFixed(3);
  return fetch(
    `${getStationsListAPI}min_lat=${min_lat}&min_lon=${min_lon}&max_lat=${max_lat}&max_lon=${max_lon}&type=${searchType}&app_id=${TRANSPORT_API_ID}&app_key=${TRANSPORT_API_KEY}`,
  )
    .then((result) => (result.status <= 400 ? result : Promise.reject(result)))
    .then((result) => result.json())
    .catch((err) => {
      console.log(`${err.message}`);
    });
};

// GET TRAIN STATION TIMETABLE
export const getStationTimetable = async (code) => {
  console.log('API CALL - GET STATION TIMETABLE');
  const stationCode = `${code}/live.json?`;
  const res = await fetch(
    `${getTimetableAPI}${stationCode}app_id=${TRANSPORT_API_ID}&app_key=${TRANSPORT_API_KEY}&darwin=false&train_status=passenger`,
  )
    .then((result) => (result.status <= 400 ? result : Promise.reject(result)))
    .then((result) => result.json())
    .catch((err) => {
      console.log(`${err.message}`);
    });
  // const withStops = await getStops(res);
  res.departures.calculatedJourneys = [];
  return res;
};

// GET TRAIN STOPS
export const getStops = async (timetable) => {
  console.log('API CALL - GET STATION STOPS FOR TRAIN');

  // removeDuplicateServices(timetable);
  const index = Math.floor(Math.random() * timetable.departures.all.length);
  const journeyRef = timetable.departures.all[index];

  // API CALL TO GET STOPS
  timetable.departures.calculatedJourneys.push({
    from: timetable.station_name,
    to: journeyRef.destination_name,
    id: journeyRef.train_uid,
    departingAt: journeyRef.aimed_departure_time,
    callingAt: await fetch(journeyRef.service_timetable.id)
      .then((result) =>
        result.status <= 400 ? result : Promise.reject(result),
      )
      .then((result) => result.json())
      .then((result) =>
        result.stops.splice(
          result.stops.findIndex(
            (el) => el.station_code === timetable.station_code,
          ),
        ),
      )
      .catch((err) => {
        console.log(`${err.message}`);
      }),
  });
  return timetable;
};

// CHECKS CACHE FOR TIMETABLE
export const getCachedTimetable = (reduxStore, selectedStation) => {
  return reduxStore.filter(
    (timetable) => timetable.station_code === selectedStation,
  );
};
