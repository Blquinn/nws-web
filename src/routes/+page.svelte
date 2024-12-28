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
	import UnitSwitch from '@/components/ui/unit-switch.svelte';
	import { convertToUnit, displayUnit, type UnitSystem } from '@/convert';
	import { unitSystemStore } from '@/state';

	use([
		TitleComponent,
		TooltipComponent,
		GridComponent,
		VisualMapComponent,
		LineChart,
		CanvasRenderer,
		UniversalTransition,
		ToolboxComponent,
		DataZoomComponent
	]);

	type resType = WeatherData | string | undefined;
	let weatherResponse: resType = $state(undefined);

	let theme = $derived($mode == 'dark' ? darkTheme : lightTheme);
	
	const weatherDataToOpt = (
		data: resType,
		theme: ThemeData,
		unitSystem: UnitSystem,
	): EChartsOption | string | undefined => {
		if (!data || typeof data == 'string') {
			return data;
		}

		const weather = data as WeatherData;

		const temp = weather.gridpointResponse.properties.properties.temperature!;

		const series: [Date, number][] = [];

		let minVal = null;
		let maxVal = null;
		for (let val of temp.values) {
			const t = val.value!;

			series.push([val.validTime.startTime.toDate(), t]);

			if (!t) {
				continue;
			}

			if (minVal == null || t < minVal) {
				minVal = t;
			}

			if (maxVal == null || t > maxVal) {
				maxVal = t;
			}
		}
		
		const minUnit = displayUnit(convertToUnit(minVal!, temp.uom!), unitSystem);
		minVal = minUnit.value;
		
		const maxUnit = displayUnit(convertToUnit(maxVal!, temp.uom!), unitSystem);
		maxVal = maxUnit.value;

		const startFactor = 5;
		const seriesMin = Math.floor(minVal / startFactor) * startFactor;
		const seriesMax = Math.ceil(maxVal / startFactor) * startFactor;

		// TODO: Just store the unit?
		for (let i = 0; i < series.length; i++) {
			const val = series[i];
			const u = convertToUnit(val[1], temp.uom!);
			const du = displayUnit(u, unitSystem);
			series[i][1] = du.value;
		}

		const opts: EChartsOption = {
			clip: true,
			visualMap: [
				{
					show: false,
					type: 'continuous',
					seriesIndex: 0,
					min: minVal!,
					max: maxVal!,
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
				bottom: 75
			},
			tooltip: {
				trigger: 'axis',
				valueFormatter: (value, _idx) => `${(value as number).toFixed(2)} ${minUnit.notation}`,
			},
			xAxis: {
				type: 'time'
			},
			yAxis: {
				type: 'value',
				min: seriesMin,
				max: seriesMax,
			},
			dataZoom: [
				{
					type: 'inside',
					filterMode: 'none',
					start: 0,
					end: 30,
				},
				{
					start: 0,
					end: 30, 
				}
			],
			toolbox: {
				feature: {
					dataZoom: {
						yAxisIndex: 'none'
					},
					restore: {}
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
		weatherDataToOpt(weatherResponse, theme, $unitSystemStore)
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

	<!-- Right side -->
	<div class="flex flex-row gap-2">
		<LightSwitch />
		<UnitSwitch />
	</div>
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
