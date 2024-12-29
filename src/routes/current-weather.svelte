<script lang="ts">
	import type { QuantitativeValue, WeatherData } from '@/api/models';
	import {
		convertToUnit,
		displayUnit,
		formatFloat,
		type DisplayableUnit,
		type UnitSystem
	} from '@/convert';
	import { unitSystemStore } from '@/state';

	const {
		data
	}: {
		data: WeatherData;
	} = $props();

	const quantitativeValues = [
		['temperature', 'Temperature'],
		['maxTemperatureLast24Hours', 'Max Temperature (Last 24 Hours)'],
		['minTemperatureLast24Hours', 'Min Temperature (Last 24 Hours)'],
		['windChill', 'Wind Chill'],
		['heatIndex', 'Head Index'],
		['relativeHumidity', 'Relative Humidity'],

		['dewpoint', 'Dewpoint'],
		['barometricPressure', 'Barometric Pressure'],
		['seaLevelPressure', 'Sea Level Pressure'],
		['precipitationLastHour', 'Precipitation (Last Hour)'],
		['precipitationLast3Hours', 'Precipitation (Last 3 Hours)'],
		['precipitationLast6Hours', 'Precipitation (Last 6 Hours)'],

		['windDirection', 'Wind Direction'],
		['windSpeed', 'Wind Speed'],
		['windGust', 'Wind Gust'],

		['visibility', 'Visibility'],
		['elevation', 'Elevation'],
	];

	function displayQuantitativeValue(
		val: QuantitativeValue,
		system: UnitSystem
	): DisplayableUnit | null {
		if (!val.value || !val.unitCode) {
			return null;
		}

		return displayUnit(convertToUnit(val.value!, val.unitCode!), system);
	}

	let weatherText = $state(data.observation.properties.textDescription);
	const presWeather = data.observation.properties.presentWeather.map((w) => w.weather).join(', ');
	if (presWeather) {
		weatherText += ' -- ' + presWeather;
	}

	function formatDisplayableUnit(u: DisplayableUnit | null): string {
		if (!u) {
			return '--';
		}

		return `${formatFloat(u.value, 2)} ${u.notation}`;
	}

	let vals: [string, DisplayableUnit | null][] = $derived(
		quantitativeValues.map((v) => [
      v[1],
			displayQuantitativeValue(
				(data.observation.properties as any)[v[0]] as QuantitativeValue,
				$unitSystemStore
			)
		])
	);
</script>

<div class="p-4">
	<h2 class="text-3xl">Current Weather</h2>
	<div>
		<b>Station: </b>
		{data.observationStation.stationIdentifier} -- {data.observationStation.name}
	</div>
	<div>
		<b>Last Updated: </b>
		{data.observation.properties.timestamp.local().format("M/D h:m a")}
	</div>
	<div>
		<b>Weather: </b>
		{weatherText}
	</div>
	{#each vals as val}
		<div><b>{val[0]}: </b> {formatDisplayableUnit(val[1])}</div>
	{/each}
</div>
