<script lang="ts">
	import LightSwitch from '@/components/ui/light-switch.svelte';

	import { getWeatherForLocation } from '@/api/nws-client';
	import { PropertyList, type WeatherData } from '@/api/models';
	import { onMount } from 'svelte';
	import UnitSwitch from '@/components/ui/unit-switch.svelte';
	import { chartGroup, initCharts } from '@/chart';
	import PlistChart from '@/components/plist-chart.svelte';
	import { connect } from 'echarts/core';
	import { camelCaseToTitle } from '@/utils';
	import LoadingSpinner from '@/components/loading-spinner.svelte';
	import CurrentWeather from './current-weather.svelte';
	import { Coordinate } from '@/api/geography';

	initCharts();

	type State =
		| { state: 'loading' }
		| { state: 'loaded'; data: WeatherData }
		| { state: 'error'; error: string };

	let weatherResponse: State = $state({ state: 'loading' });


	function propListHasValues(plist?: PropertyList): boolean {
		return !!plist && !!plist.uom && !!plist.values;
	}

	onMount(async () => {
		weatherResponse = { state: 'loading' };
		try {
			const res = await getWeatherForLocation(new Coordinate(40.6959883, -73.9953226));
			weatherResponse = { state: 'loaded', data: res };
			connect(chartGroup);
		} catch (e) {
			weatherResponse = { state: 'error', error: `Error: ${e}` };
		}
	});
</script>

<div class="flex flex-row justify-between border-b p-2">
	<div></div>

	<!-- Right side -->
	<div class="flex flex-row gap-2">
		<LightSwitch />
		<UnitSwitch />
	</div>
</div>

{#if weatherResponse.state == 'error'}
	<div class="flex h-full w-full flex-col items-center justify-center">
		<p class="color-destructive-foreground">{weatherResponse.error}</p>
	</div>
{:else if weatherResponse.state == 'loaded'}
	<CurrentWeather data={weatherResponse.data} />

	<h2 class="p-4 text-3xl">Hourly Forecast</h2>
	{#each Object.entries(weatherResponse.data.gridpointResponse.properties.properties) as prop}
		{#if propListHasValues(prop[1])}
			<PlistChart title={camelCaseToTitle(prop[0])} propertyList={prop[1]} />
		{/if}
	{/each}
{:else}
	<div class="flex h-full w-full flex-col items-center justify-center">
		<LoadingSpinner class="h-4 w-4" />
	</div>
{/if}
