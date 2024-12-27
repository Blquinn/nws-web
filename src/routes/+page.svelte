<script lang="ts">
	import LightSwitch from '@/components/ui/light-switch.svelte';

	import { use } from 'echarts/core';
	import {
		TitleComponent,
		TooltipComponent,
		GridComponent,
		VisualMapComponent
	} from 'echarts/components';
	import type { EChartsOption, LineSeriesOption } from 'echarts';

	import { LineChart } from 'echarts/charts';
	import { UniversalTransition } from 'echarts/features';
	import { SVGRenderer } from 'echarts/renderers';
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
		SVGRenderer,
		UniversalTransition
	]);

	// prettier-ignore
	// const data: [string, number][] = [["2000-06-05", 116], ["2000-06-06", 129], ["2000-06-07", 135], ["2000-06-08", 86], ["2000-06-09", 73], ["2000-06-10", 85], ["2000-06-11", 73], ["2000-06-12", 68], ["2000-06-13", 92], ["2000-06-14", 130], ["2000-06-15", 245], ["2000-06-16", 139], ["2000-06-17", 115], ["2000-06-18", 111], ["2000-06-19", 309], ["2000-06-20", 206], ["2000-06-21", 137], ["2000-06-22", 128], ["2000-06-23", 85], ["2000-06-24", 94], ["2000-06-25", 71], ["2000-06-26", 106], ["2000-06-27", 84], ["2000-06-28", 93], ["2000-06-29", 85], ["2000-06-30", 73], ["2000-07-01", 83], ["2000-07-02", 125], ["2000-07-03", 107], ["2000-07-04", 82], ["2000-07-05", 44], ["2000-07-06", 72], ["2000-07-07", 106], ["2000-07-08", 107], ["2000-07-09", 66], ["2000-07-10", 91], ["2000-07-11", 92], ["2000-07-12", 113], ["2000-07-13", 107], ["2000-07-14", 131], ["2000-07-15", 111], ["2000-07-16", 64], ["2000-07-17", 69], ["2000-07-18", 88], ["2000-07-19", 77], ["2000-07-20", 83], ["2000-07-21", 111], ["2000-07-22", 57], ["2000-07-23", 55], ["2000-07-24", 60]];
	// const dateList = data.map((item) => item[0]);
	// const valueList = data.map((item) => item[1] % 100);

	type resType = WeatherData | string | undefined;
	let weatherResponse: resType = $state(undefined);

	let theme = $derived($mode == 'dark' ? darkTheme : lightTheme);

	// let option: EChartsOption = $derived(
	// 	applyTheme(
	// 		{
	// 			visualMap: [
	// 				{
	// 					show: false,
	// 					type: 'continuous',
	// 					seriesIndex: 0,
	// 					min: 0,
	// 					max: 100,
	// 					inRange: {
	// 						color: ['#7289ff', '#29d0e5', '#eedd78', '#dd6b66']
	// 					}
	// 				}
	// 			],
	// 			title: [
	// 				{
	// 					left: 'center',
	// 					text: 'Temperature'
	// 				}
	// 			],
	// 			grid: {
	// 				left: 35,
	// 				right: 15,
	// 				top: 40,
	// 				bottom: 25
	// 			},
	// 			tooltip: {
	// 				trigger: 'axis'
	// 			},
	// 			xAxis: [{ data: dateList }],
	// 			yAxis: [{}],
	// 			series: [
	// 				{
	// 					type: 'line',
	// 					showSymbol: true,
	// 					data: valueList,
	// 					smooth: true,
	// 					symbolSize: 8,
	// 					symbol: 'circle',
	// 					lineStyle: {
	// 						width: 3
	// 					}
	// 				}
	// 			]
	// 		},
	// 		theme
	// 	)
	// );

	const weatherDataToOpt = (
		data: resType,
		theme: ThemeData
	): EChartsOption | string | undefined => {
		if (!data || typeof data == 'string') {
			return data;
		}

		const weather = data as WeatherData;

		const temp = weather.gridpointResponse.properties.properties.temperature!;
		const dateSeries = temp.values.map((v) => v.validTime.startTime.format('ddd hA'));
		const valSeries = temp.values.map((v) => v.value);

		const opts: EChartsOption = {
			visualMap: [
				{
					show: false,
					type: 'continuous',
					seriesIndex: 0,
					min: 0,
					max: 100,
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
				bottom: 25
			},
			tooltip: {
				trigger: 'axis',
				valueFormatter: (value, _idx) => `${(value as number).toFixed(2)} Deg C`
			},
			xAxis: [{ data: dateSeries }],
			yAxis: [{}],
			series: [
				{
					type: 'line',
					showSymbol: true,
					data: valSeries,
					smooth: true,
					symbolSize: 8,
					symbol: 'circle',
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

<div class="m-4 h-[200px] rounded-lg border bg-card p-4">
	{#if typeof option == 'string'}
		<p>{option}</p>
	{:else if option}
		<Chart options={option} class="h-full w-full" />
	{:else}
		<p>Loading</p>
	{/if}
</div>
