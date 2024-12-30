<script lang="ts">
	import { initCharts } from '@/chart';
	import Chart from '@/svelte-echarts/components/Chart.svelte';
	import type { EChartsOption } from 'echarts';
	import { GeoComponent } from 'echarts/components';
	import { use, registerMap } from 'echarts/core';

	import { applyTheme, themeData } from '@/svelte-echarts/theme';

	import '@/svelte-echarts/leaflet/leaflet';
	import 'leaflet/dist/leaflet.css';
	import { MapChart } from 'echarts/charts';
	import nyc from './nyc.json';

	initCharts();

	use([GeoComponent, MapChart]);

	registerMap('nyc', JSON.stringify(nyc));
	// registerMap('world', JSON.stringify(world));

	let opts: EChartsOption = $derived(
		applyTheme(
			{
				progressive: 20000,
				backgroundColor: 'transparent',
				// geo: {
				// 	center: [-74.04327099998152, 40.86737600240287],
				// 	zoom: 30,
				// 	map: 'world',
				// 	roam: true,
				// 	silent: true,
				// 	itemStyle: {
				//     color: $themeData.background,
				//     borderColor: $themeData.foreground,
				// 		borderWidth: 1,
				// 	}
				// },
				leaflet: {
					center: [-73.9893358, 40.7395302],
					zoom: 10,
					roam: true,
					tiles: [
						{
							label: 'OpenStreetMap',
							urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
							options: {
								attribution:
									'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
							}
						}
					]
				},
				series: [
					// {
					// 	type: 'scatter',
					// 	coordinateSystem: 'leaflet'
					// },
					{
						type: 'map',
						map: 'nyc',
						silent: true,
						// roam: true,
						coordinateSystem: 'leaflet',
						// z: -10,
						color: 'transparent',
						itemStyle: {
							color: 'transparent',
							borderColor: 'purple',
							borderWidth: 2
						}
					}
				]
				// geo: {
				// 	center: [-74.04327099998152, 40.86737600240287],
				// 	zoom: 30,
				// 	map: 'world',
				// 	roam: true,
				// 	silent: true,
				// 	itemStyle: {
				//     color: $themeData.background,
				//     borderColor: $themeData.foreground,
				// 		borderWidth: 1,
				// 	}
				// },
				// {
				//   type: 'lines',
				//   coordinateSystem: 'geo',
				//   blendMode: 'lighter',
				//   dimensions: ['value'],
				//   data: new Float64Array(),
				//   polyline: true,
				//   large: true,
				//   lineStyle: {
				//     color: 'orange',
				//     width: 0.5,
				//     opacity: 0.3
				//   }
				// }
				// ]
			},
			$themeData
		)
	);
</script>

<div class="h-[600px] w-3/4">
	<Chart class="h-full w-full" options={opts} />
</div>
