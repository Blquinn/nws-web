<script lang="ts">
	import { onMount } from 'svelte';
	import maplibregl, { type StyleSpecification } from 'maplibre-gl';
	import { PMTiles, Protocol } from 'pmtiles';

	import 'maplibre-gl/dist/maplibre-gl.css';
	import style from './pmtiles-style.json';

	import nyc from './nyc.json';

	let chartEl: HTMLDivElement;
	let map: maplibregl.Map;

	onMount(() => {
		const pmTilesUrl = 'http://localhost:8080/20241230-z6.pmtiles';

		const protocol = new Protocol();
		const pmtiles = new PMTiles(pmTilesUrl);
		protocol.add(pmtiles);
		maplibregl.addProtocol('pmtiles', protocol.tilev4);

		map = new maplibregl.Map({
			container: chartEl,
			center: [-73.9953226, 40.6959883],
			zoom: 6,
			style: style as StyleSpecification
		});

		map.on('load', () => {
			map.addSource('nyc', {
				type: 'geojson',
				data: nyc as any
			});
			map.addLayer({
				id: 'nyc',
				type: 'fill',
				source: 'nyc',
				layout: {},
				paint: {
					'fill-color': '#088',
					'fill-opacity': 0.8
				}
			});
		});

		// return map.remove;
	});
</script>

<div bind:this={chartEl} class="h-full bg-white"></div>
