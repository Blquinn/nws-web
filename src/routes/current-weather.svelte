<script lang="ts">
	import type { QuantitativeValue, WeatherData } from '@/api/models';
	import { convertToUnit, displayUnit, formatFloat, type DisplayableUnit, type UnitSystem } from '@/convert';
	import { unitSystemStore } from '@/state';
	import { camelCaseToTitle } from '@/utils';

	const {
		data
	}: {
		data: WeatherData;
	} = $props();

	const quantitativeValues = [
		'temperature',
		'maxTemperatureLast24Hours',
		'minTemperatureLast24Hours',
		'windChill',
		'heatIndex',
		'relativeHumidity',

		'dewpoint',
		'barometricPressure',
		'seaLevelPressure',
		'precipitationLastHour',
		'precipitationLast3Hours',
		'precipitationLast6Hours',

		'windDirection',
		'windSpeed',
		'windGust',

		'visibility',
		'elevation'
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

  function formatDisplayableUnit(u: DisplayableUnit | null): string {
    if (!u){
      return "--";
    }

    return `${formatFloat(u.value, 2)} ${u.notation}`;
  }

	let vals: [string, DisplayableUnit | null][] = $derived(
		quantitativeValues.map((v) => [
			camelCaseToTitle(v),
			displayQuantitativeValue(
				(data.observation.properties as any)[v] as QuantitativeValue,
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
	{#each vals as val}
		<div><b>{val[0]}: </b> {formatDisplayableUnit(val[1])}</div>
	{/each}
	<div>
		<b>Weather: </b>
    {data.observation.properties.presentWeather.map((w) => w.weather).join(', ')}
	</div>
</div>
