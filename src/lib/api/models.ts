import type { Dayjs } from 'dayjs';
import type { Duration } from 'dayjs/plugin/duration';
import moment from 'dayjs';
import { z } from 'zod';
import { transformPropertyList } from './utils';
import { Coordinate } from './geography';
import type { WmoUnitType } from './units';

//////////////////////////////////////
// Point

export const NwsPointResponse = z.object({
	properties: z.object({
		gridId: z.string(),
		gridX: z.number(),
		gridY: z.number()
	})
});

export type NwsPointResponse = z.infer<typeof NwsPointResponse>;

//////////////////////////////////////
// Gridpoint

interface TimeRange {
	startTime: Dayjs;
	duration: Duration;
}

function parseTimeRange(json: string): TimeRange {
	const chunks = json.split('/');
	if (chunks.length == 0) {
		throw 'TimeRange string cant be empty';
	}

	const time = moment(chunks[0]);
	// No duration
	if (chunks.length == 1) {
		return { startTime: time, duration: moment.duration(0) };
	}

	return { startTime: time, duration: moment.duration(chunks[1]) };
}

export const PropertyValue = z.object({
	validTime: z.string().transform(parseTimeRange),
	value: z.number().nullish()
});

export type PropertyValue = z.infer<typeof PropertyValue>;

export interface UnitOfMeasure {
	namespace: string;
	unitType: WmoUnitType;
}

function parseUom(json?: string | null): UnitOfMeasure | undefined {
  if (!json) return undefined;

	const colIdx = json.indexOf(':');
	if (colIdx == -1) {
		throw 'Unit of measure did not contain colon char.';
	}

	const namespace = json.substring(0, colIdx);
	const unitNotation = json.substring(colIdx + 1);

	if (namespace != 'wmoUnit') {
		throw `Received unexpected unit of measure of namespace ${namespace}.`;
	}

	return {
		namespace: namespace,
		// unitType: unitTypeMap[unitNotation] ?? WmoUnitType.unknown,
		unitType: unitNotation as WmoUnitType
	};
}

export const PropertyList = z
	.object({
		uom: z.string().nullish().transform(parseUom),
		values: z.array(PropertyValue)
	})
	.transform((pl) => transformPropertyList(pl));

export type PropertyList = z.infer<typeof PropertyList>;

export const WeatherValue = z.object({
	coverage: z.string().nullish(),
	weather: z.string().nullish(),
	// intensity: z.any(),
	// visibility: z.any(),
	// attributes: z.array(z.any())
});

export const WeatherValueList = z.object({
	validTime: z.string(),
	value: z.array(WeatherValue)
});

export const WeatherValuesContainer = z.object({
	values: z.array(WeatherValueList)
});

const propertyKeys = [
	'temperature',
	'dewpoint',
	'maxTemperature',
	'minTemperature',
	'relativeHumidity',
	'apparentTemperature',
	'wetBulbGlobeTemperature',
	'heatIndex',
	'windChill',
	'skyCover',
	'windDirection',
	'windSpeed',
	'windGust',
	'probabilityOfPrecipitation',
	'quantitativePrecipitation',
	'iceAccumulation',
	'snowfallAmount',
	'snowLevel',
	'ceilingHeight',
	'visibility',
	'transportWindSpeed',
	'transportWindDirection',
	'mixingHeight',
	'hainesIndex',
	'lightningActivityLevel',
	'twentyFootWindSpeed',
	'twentyFootWindDirection',
	'waveHeight',
	'waveDirection',
	'primarySwellHeight',
	'primarySwellDirection',
	'wavePeriod2',
	'windWaveHeight',
	'dispersionIndex',
	'pressure',
	'probabilityOfTropicalStormWinds',
	'probabilityOfHurricaneWinds',
	'potentialOf25mphWinds',
	'potentialOf35mphWinds',
	'potentialOf45mphWinds',
	'potentialOf20mphWindGusts',
	'potentialOf30mphWindGusts',
	'potentialOf40mphWindGusts',
	'potentialOf50mphWindGusts',
	'potentialOf60mphWindGusts',
	'grasslandFireDangerIndex',
	'probabilityOfThunder',
	'davisStabilityIndex',
	'atmosphericDispersionIndex',
	'lowVisibilityOccurrenceRiskIndex',
	'stability',
	'redFlagThreatIndex'
] as const;

export const NwsGridpointResponseProperties = z.preprocess(
	(rawProperties: unknown) => {
		// const { weather, ...properties } = rawProperties as any;
    const weather = (rawProperties as any).weather;
    const props: Record<string, any> = {};
    const propObj = rawProperties as Object;
    for (let key of Object.keys(propObj)) {
      if ((propertyKeys as unknown as string[]).includes(key)) {
        props[key] = (propObj as any)[key];
      }
    }

		return { weather, properties: props };
	},
	z.object({
		properties: z.record(z.enum(propertyKeys), PropertyList),
		weather: WeatherValuesContainer
	})
);

export const NwsGridpointResponse = z.object({
	'@context': z.array(z.any()),
	id: z.string(),
	type: z.string(),
	properties: NwsGridpointResponseProperties
});

export type NwsGridpointResponse = z.infer<typeof NwsGridpointResponse>;

//////////////////////////////////////
// Gridpoint Stations

export const ObservationStation = z.object({
	stationIdentifier: z.string(),
	name: z.string()
});

export type ObservationStation = z.infer<typeof ObservationStation>;

export const GeoJsonGeometry = z.object({
	type: z.string(),
	coordinates: z
		.array(z.number())
		.length(2)
		.transform((arr) => new Coordinate(arr[0], arr[1]))
});

export const GridpointStationFeature = z.object({
	geometry: GeoJsonGeometry,
	properties: ObservationStation
});

export type GridpointStationFeature = z.infer<typeof GridpointStationFeature>;

export const ObservationStationCollectionResponse = z.object({
	features: z.array(GridpointStationFeature)
});

export type ObservationStationCollectionResponse = z.infer<
	typeof ObservationStationCollectionResponse
>;

//////////////////////////////////////
// Station Observations

export const QuantitativeValue = z.object({
	value: z.number().nullish(),
	// TODO: Convert units
	unitCode: z.string().nullish().transform(parseUom)
});

export type QuantitativeValue = z.infer<typeof QuantitativeValue>;

export const MetarPhenomenon = z.object({
	intensity: z.string().nullish(),
	modifier: z.string().nullish(),
	weather: z.string(),
	rawString: z.string()
});

export type MetarPhenomenon = z.infer<typeof MetarPhenomenon>;

export const Observation = z.object({
	station: z.string(),
	elevation: QuantitativeValue,
	temperature: QuantitativeValue,
	dewpoint: QuantitativeValue,
	windDirection: QuantitativeValue,
	windSpeed: QuantitativeValue,
	windGust: QuantitativeValue,
	barometricPressure: QuantitativeValue,
	seaLevelPressure: QuantitativeValue,
	visibility: QuantitativeValue,
	maxTemperatureLast24Hours: QuantitativeValue,
	minTemperatureLast24Hours: QuantitativeValue,
	precipitationLastHour: QuantitativeValue,
	precipitationLast3Hours: QuantitativeValue,
	precipitationLast6Hours: QuantitativeValue,
	relativeHumidity: QuantitativeValue,
	windChill: QuantitativeValue,
	heatIndex: QuantitativeValue,
	presentWeather: z.array(MetarPhenomenon)
});

export const ObservationGeoJson = z.object({
	properties: Observation
});

export type ObservationGeoJson = z.infer<typeof ObservationGeoJson>;

export interface WeatherData {
	observation: ObservationGeoJson;
	observationStation: ObservationStation;
	gridpointResponse: NwsGridpointResponse;
}
