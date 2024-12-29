<script lang="ts">
	import LightSwitch from '@/components/ui/light-switch.svelte';

	import { getWeatherForLocation } from '@/api/nws-client';
	import { PropertyList, type WeatherData } from '@/api/models';
	import { onMount } from 'svelte';
	import UnitSwitch from '@/components/ui/unit-switch.svelte';
	import { initCharts } from '@/chart';
	import PlistChart from '@/components/plist-chart.svelte';

	initCharts();

	type resType = WeatherData | string | undefined;
	let weatherResponse: resType = $state(undefined);

	onMount(async () => {
		weatherResponse = 'Loading';
		try {
			weatherResponse = await getWeatherForLocation(40.6959883, -73.9953226);
		} catch (e) {
			weatherResponse = `Error: ${e}`;
		}
	});

	function propListHasValues(plist?: PropertyList): boolean {
		return !!plist && !!plist.uom && !!plist.values;
	}
</script>

<div class="flex flex-row justify-between border-b p-2">
	<div></div>

	<!-- Right side -->
	<div class="flex flex-row gap-2">
		<LightSwitch />
		<UnitSwitch />
	</div>
</div>

{#if typeof weatherResponse == 'string'}
	<p>{weatherResponse}</p>
{:else if weatherResponse}
	{#each Object.entries(weatherResponse.gridpointResponse.properties.properties) as prop}
		{#if propListHasValues(prop[1])}
			<PlistChart title={prop[0]} propertyList={prop[1]} />
		{/if}
	{/each}
{:else}
	<p>Loading</p>
{/if}
