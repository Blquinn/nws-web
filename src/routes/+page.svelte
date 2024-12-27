<script lang="ts">
	import LightSwitch from '@/components/ui/light-switch.svelte';

	import { use } from 'echarts/core';
	import {
		TitleComponent,
		TooltipComponent,
		GridComponent,
		VisualMapComponent,
		ToolboxComponent,
		DataZoomComponent
	} from 'echarts/components';
	import type { EChartsOption, LineSeriesOption } from 'echarts';

	import { LineChart } from 'echarts/charts';
	import { UniversalTransition } from 'echarts/features';
	import { CanvasRenderer } from 'echarts/renderers';
	import { Chart } from '@/svelte-echarts';
	import { applyTheme, darkTheme, lightTheme, type ThemeData } from '@/svelte-echarts/theme';
	import { mode } from 'mode-watcher';
	import { getWeatherForLocation } from '@/api/nws-client';
	import type { WeatherData } from '@/api/models';
	import { onMount } from 'svelte';

	use([
		TitleComponent,
		TooltipComponent,
		GridComponent,
		VisualMapComponent,
		LineChart,
		CanvasRenderer,
		UniversalTransition,
		ToolboxComponent,
		DataZoomComponent,
	]);

	type resType = WeatherData | string | undefined;
	let weatherResponse: resType = $state(undefined);

	let theme = $derived($mode == 'dark' ? darkTheme : lightTheme);

	const weatherDataToOpt = (
		data: resType,
		theme: ThemeData
	): EChartsOption | string | undefined => {
		if (!data || typeof data == 'string') {
			return data;
		}

		const weather = data as WeatherData;

		const temp = weather.gridpointResponse.properties.properties.temperature!;

		const series = [];

		let minTemp = null;
		let maxTemp = null;
		for (let val of temp.values) {
			const t = val.value;

			series.push([val.validTime.startTime.toDate(), t]);

			if (!t) {
				continue;
			}

			if (minTemp == null || t < minTemp) {
				minTemp = t;
			}

			if (maxTemp == null || t > maxTemp) {
				maxTemp = t;
			}
		}

		const opts: EChartsOption = {
			clip: true,
			visualMap: [
				{
					show: false,
					type: 'continuous',
					seriesIndex: 0,
					min: minTemp!,
					max: maxTemp!,
					inRange: {
						color: ['#7289ff', '#29d0e5', '#eedd78', '#dd6b66']
					}
				}
			],
			title: [
				{
					left: 'center',
					text: 'Temperature'
				}
			],
			grid: {
				left: 35,
				right: 15,
				top: 40,
				bottom: 75,
			},
			tooltip: {
				trigger: 'axis',
				valueFormatter: (value, _idx) => `${(value as number).toFixed(2)} Deg C`
			},
			xAxis: {
				type: 'time',
			},
			yAxis: {
				type: 'value'
			},
			dataZoom: [
				{
					type: 'inside',
					filterMode: 'none',
					start: 0,
					end: 20
				},
				{
					start: 0,
					end: 20
				}
			],
			toolbox: {
				feature: {
					dataZoom: {
						yAxisIndex: 'none'
					},
					restore: {},
					saveAsImage: {},
				}
			},
			series: [
				{
					type: 'line',
					showSymbol: false,
					data: series,
					symbolSize: 8,
					// symbol: 'circle',
					lineStyle: {
						width: 3
					}
				} as LineSeriesOption
			]
		};

		return applyTheme(opts, theme);
	};

	let option: EChartsOption | string | undefined = $derived(
		weatherDataToOpt(weatherResponse, theme)
	);

	onMount(async () => {
		weatherResponse = 'Loading';
		try {
			weatherResponse = await getWeatherForLocation(40.6959883, -73.9953226);
		} catch (e) {
			weatherResponse = `Error: ${e}`;
		}
	});
</script>

<div class="flex flex-row justify-between border-b p-2">
	<div></div>
	<LightSwitch />
</div>

<div class="m-4 h-[300px] rounded-lg border bg-card p-4">
	{#if typeof option == 'string'}
		<p>{option}</p>
	{:else if option}
		<Chart options={option} class="h-full w-full" />
	{:else}
		<p>Loading</p>
	{/if}
</div>
