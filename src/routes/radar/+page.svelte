<script lang="ts">
	import { initCharts } from '@/chart';
	import Chart from '@/svelte-echarts/components/Chart.svelte';
	import type { EChartsOption } from 'echarts';
	import { GeoComponent } from 'echarts/components';
	import { use, registerMap } from 'echarts/core';

  import world from './world.json';
	import { applyTheme, themeData } from '@/svelte-echarts/theme';

	initCharts();

  use([
    GeoComponent,
  ])

  registerMap('world', JSON.stringify(world));

	let opts: EChartsOption = $derived(applyTheme({
		progressive: 20000,
		backgroundColor: '#111',
		geo: {
			center: [-74.04327099998152, 40.86737600240287],
			zoom: 30,
			map: 'world',
			roam: true,
			silent: true,
			itemStyle: {
        color: $themeData.background,
        borderColor: $themeData.foreground,
				borderWidth: 1,
			}
		},
		series: [
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
		]
	}, $themeData));
</script>

<div class="h-[800px]">
	<Chart class="h-full w-full" options={opts} />
</div>
