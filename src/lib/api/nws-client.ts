import { Coordinate } from './geography';
import {
	GridpointStationFeature,
	NwsGridpointResponse,
	NwsPointResponse,
	ObservationGeoJson,
	ObservationStationCollectionResponse,
	type WeatherData
} from './models';
import moment from 'moment';

const nwsBaseUrl = 'http://api.weather.gov';
const requestTimeout = moment.duration({ minutes: 1 });

// async function doFetch(uri: string, headers: Record<string, string>) {
//   const res = await fetch(uri, { headers });
//   if (!res.ok) {
//     throw `Failed to make request, response code: ${res.status}`;
//   }

//   // const json = await res.json();
// }

async function getNwsPoint(lat: number, lon: number): Promise<NwsPointResponse> {
	var res = await fetch(`${nwsBaseUrl}/points/${lat},${lon}`, {
		signal: AbortSignal.timeout(requestTimeout.asMilliseconds())
	});
	if (!res.ok) {
		throw `Got bad response from NWS ${res.status}`;
	}

	var body = await res.json();
	return NwsPointResponse.parse(body);
}

async function getGridpointStations(
	officeCode: string,
	gridX: number,
	gridY: number
): Promise<ObservationStationCollectionResponse> {
	const limit = 100;

	var res = await fetch(
		`${nwsBaseUrl}/gridpoints/${officeCode}/${gridX},${gridY}/stations?limit=${limit}`,
		{ signal: AbortSignal.timeout(requestTimeout.asMilliseconds()) }
	);

	if (!res.ok) {
		throw `Got bad response from NWS ${res.status}`;
	}

	return ObservationStationCollectionResponse.parse(await res.json());
}

async function getGridpoint(
	officeCode: string,
	gridX: number,
	gridY: number
): Promise<NwsGridpointResponse> {
	var res = await fetch(`${nwsBaseUrl}/gridpoints/${officeCode}/${gridX},${gridY}`, {
		signal: AbortSignal.timeout(requestTimeout.asMilliseconds())
	});

	if (!res.ok) {
		throw `Got bad response from NWS ${res.status}`;
	}

	return NwsGridpointResponse.parse(await res.json());
}

async function getStationObservationLatest(stationId: string): Promise<ObservationGeoJson> {
	var res = await fetch(`${nwsBaseUrl}/stations/${stationId}/observations/latest`, {
		signal: AbortSignal.timeout(requestTimeout.asMilliseconds())
	});

	if (!res.ok) {
		throw `Got bad response from NWS ${res.status}`;
	}

	return ObservationGeoJson.parse(await res.json());
}

export async function getWeatherForLocation(lat: number, lon: number): Promise<WeatherData> {
	var res = (await getNwsPoint(lat, lon)).properties;

	var gridpointResponse = await getGridpoint(res.gridId, res.gridX, res.gridY);

	var gridpointStations = await getGridpointStations(res.gridId, res.gridX, res.gridY);

	var userCoord = new Coordinate(lat, lon);

	const featuresByDistance: [number, GridpointStationFeature][] = gridpointStations.features.map(
		(f) => {
			const coord = f.geometry.coordinates;
			const dist = userCoord.haversineDistanceTo(coord);
			return [dist, f];
		}
	);

	featuresByDistance.sort((a, b) => a[0] - b[0]);

	const closestFeature = featuresByDistance[0][1];
	const stationId = closestFeature.properties.stationIdentifier;

	var observation = await getStationObservationLatest(stationId);

	return {
		observation: observation,
		observationStation: closestFeature.properties,
		gridpointResponse: gridpointResponse
	};
}
