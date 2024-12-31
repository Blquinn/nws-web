import { Coordinate } from './geography';
import {
	GridpointStationFeature,
	NwsGridpointResponse,
	NwsPointResponse,
	ObservationCollectionGeoJson,
	ObservationGeoJson,
	ObservationStationCollectionResponse,
	QuantitativeValue,
	quantitativeValues,
	type WeatherData
} from './models';
import moment from 'dayjs';

const nwsBaseUrl = 'https://api.weather.gov';
const requestTimeout = moment.duration({ minutes: 1 });

async function getNwsPoint(coord: Coordinate): Promise<NwsPointResponse> {
	const res = await fetch(`${nwsBaseUrl}/points/${coord.lat},${coord.lon}`, {
		signal: AbortSignal.timeout(requestTimeout.asMilliseconds())
	});
	if (!res.ok) {
		throw `Got bad response from NWS ${res.status}`;
	}

	const body = await res.json();
	return NwsPointResponse.parse(body);
}

async function getGridpointStations(
	officeCode: string,
	gridX: number,
	gridY: number
): Promise<ObservationStationCollectionResponse> {
	const limit = 100;

	const res = await fetch(
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
	const res = await fetch(`${nwsBaseUrl}/gridpoints/${officeCode}/${gridX},${gridY}`, {
		signal: AbortSignal.timeout(requestTimeout.asMilliseconds())
	});

	if (!res.ok) {
		throw `Got bad response from NWS ${res.status}`;
	}

	return NwsGridpointResponse.parse(await res.json());
}

async function getStationObservationLatest(stationId: string): Promise<ObservationGeoJson> {
	const res = await fetch(`${nwsBaseUrl}/stations/${stationId}/observations/latest`, {
		signal: AbortSignal.timeout(requestTimeout.asMilliseconds())
	});

	if (!res.ok) {
		throw `Got bad response from NWS ${res.status}`;
	}

	return ObservationGeoJson.parse(await res.json());
}

async function getStationObservations(
	stationId: string,
	{ start, end, limit }: { start?: string; end?: string; limit?: number }
): Promise<ObservationCollectionGeoJson> {
	const params = new URLSearchParams();
	if (start) {
		params.append('start', start);
	}

	if (end) {
		params.append('end', end);
	}

	if (limit) {
		params.append('limit', limit.toString());
	}

	const res = await fetch(`${nwsBaseUrl}/stations/${stationId}/observations?${params}`, {
		signal: AbortSignal.timeout(requestTimeout.asMilliseconds())
	});

	if (!res.ok) {
		throw `Got bad response from NWS ${res.status}`;
	}

	return ObservationCollectionGeoJson.parse(await res.json());
}

export async function getWeatherForLocation(coord: Coordinate): Promise<WeatherData> {
	const res = (await getNwsPoint(coord)).properties;

	const gridpointResponse = await getGridpoint(res.gridId, res.gridX, res.gridY);

	const gridpointStations = await getGridpointStations(res.gridId, res.gridX, res.gridY);

	const featuresByDistance: [number, GridpointStationFeature][] = gridpointStations.features.map(
		(f) => {
			const coord = f.geometry.coordinates;
			const dist = coord.haversineDistanceTo(coord);
			return [dist, f];
		}
	);

	featuresByDistance.sort((a, b) => b[0] - a[0]);

	const closestFeature = featuresByDistance[0][1];
	const stationId = closestFeature.properties.stationIdentifier;

	const end = moment().endOf('hour')
	const start = end.subtract(4, 'hours');

	const observations = await getStationObservations(stationId, {
		start: start.utc().format(),
		end: end.utc().format(),
		limit: 10,
	});

	// TODO: Note in the UI if value is old.
	const observation = observations.features[0];
	for (let i = 1; i < observations.features.length; i++) {
		for (let [v, _] of quantitativeValues) {
			const prop = (observation.properties as any)[v] as QuantitativeValue;
			const obsProp = (observations.features[i].properties as any)[v] as QuantitativeValue;

			if (!prop.value && obsProp) {
				((observation.properties as any)[v] as QuantitativeValue) = obsProp;
			}
		}
	}

	return {
		observation: observation,
		observationStation: closestFeature.properties,
		gridpointResponse: gridpointResponse
	};
}
