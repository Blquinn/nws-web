<script lang="ts">
	import type { EChartsOption, LineSeriesOption } from 'echarts';

	import { Chart } from '@/svelte-echarts';
	import { applyTheme, darkTheme, lightTheme, type ThemeData } from '@/svelte-echarts/theme';
	import { mode } from 'mode-watcher';
	import type { PropertyList } from '@/api/models';
	import { convertToUnit, displayUnit, type UnitSystem } from '@/convert';
	import { unitSystemStore } from '@/state';
	import { chartGroup } from '@/chart';

	type Props = {
		title: string;
		propertyList: PropertyList;
	};

	const props: Props = $props();

	let theme = $derived($mode == 'dark' ? darkTheme : lightTheme);

	function formatFloat(n: number, decimals: number): string {
		const fact = Math.pow(10, decimals);
		const rounded = Math.round(n * fact) / fact;
		const noDec = Math.round(rounded);
		return (noDec == rounded ? noDec : rounded).toString();
	}

	const weatherDataToOpt = (theme: ThemeData, unitSystem: UnitSystem): EChartsOption => {
		const plist = props.propertyList!;

		const series: [Date, number][] = [];

		let minVal = null;
		let maxVal = null;
		for (let val of plist.values) {
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

		const minUnit = displayUnit(convertToUnit(minVal!, plist.uom!), unitSystem);
		minVal = minUnit.value;

		const maxUnit = displayUnit(convertToUnit(maxVal!, plist.uom!), unitSystem);
		maxVal = maxUnit.value;

		const startFactor = 5;
		const seriesMin = Math.floor(minVal / startFactor) * startFactor;
		const seriesMax = Math.ceil(maxVal / startFactor) * startFactor;

		// TODO: Just store the unit?
		for (let i = 0; i < series.length; i++) {
			const val = series[i];
			const u = convertToUnit(val[1], plist.uom!);
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
					text: `${props.title} (${minUnit.notation})`
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
				valueFormatter: (value, _idx) => `${formatFloat(value as number, 2)} ${minUnit.notation}`
			},
			xAxis: {
				type: 'time'
			},
			yAxis: {
				type: 'value',
				min: seriesMin,
				max: seriesMax
			},
			dataZoom: [
				{
					type: 'inside',
					filterMode: 'none',
					start: 0,
					end: 30
				},
				{
					start: 0,
					end: 30
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

	let option: EChartsOption = $derived(weatherDataToOpt(theme, $unitSystemStore));
</script>

<div class="m-4 h-[300px] rounded-lg border bg-card p-4">
	<Chart options={option} class="h-full w-full" group={chartGroup} />
</div>
