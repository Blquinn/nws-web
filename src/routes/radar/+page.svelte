<script lang="ts">
	import * as L from 'leaflet';
	import { onMount } from 'svelte';

	import 'leaflet/dist/leaflet.css';

	import nyc from './nyc.json';

	let chartEl: HTMLDivElement;
	let map: L.Map;

	onMount(() => {
		map = L.map(chartEl, {
			center: [40.6959883, -73.9953226],
			zoom: 13
		});

		const labelsPane = map.createPane('labels');
		labelsPane.style.zIndex = '650';
		labelsPane.style.pointerEvents = 'none';

		L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
			attribution: '©OpenStreetMap, ©CartoDB'
		}).addTo(map);

		L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
			attribution: '©OpenStreetMap, ©CartoDB',
			pane: 'labels'
		}).addTo(map);

		L.control.scale().addTo(map);

		L.geoJson(nyc as any, {}).addTo(map);

		return () => {
			map.remove();
		};
	});
</script>

<div bind:this={chartEl} class="h-[800px] w-full"></div>
