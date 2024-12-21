<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import LightSwitch from '@/components/ui/light-switch.svelte';
	import { LinearGradient, LineChart, Spline, Tooltip, Highlight } from 'layerchart';
	import { extent, ticks } from 'd3-array';
	import { scaleSequential } from 'd3-scale';
	import { interpolateTurbo } from 'd3-scale-chromatic';

	let data = [
		{
			date: new Date('2024-11-21T05:00:00.000Z'),
			value: 50
		},
		{
			date: new Date('2024-11-22T05:00:00.000Z'),
			value: 93
		},
		{
			date: new Date('2024-11-23T05:00:00.000Z'),
			value: 52
		},
		{
			date: new Date('2024-11-24T05:00:00.000Z'),
			value: 66
		},
		{
			date: new Date('2024-11-25T05:00:00.000Z'),
			value: 65
		},
		{
			date: new Date('2024-11-26T05:00:00.000Z'),
			value: 64
		},
		{
			date: new Date('2024-11-27T05:00:00.000Z'),
			value: 69
		},
		{
			date: new Date('2024-11-28T05:00:00.000Z'),
			value: 68
		},
		{
			date: new Date('2024-11-29T05:00:00.000Z'),
			value: 55
		},
		{
			date: new Date('2024-11-30T05:00:00.000Z'),
			value: 67
		},
		{
			date: new Date('2024-12-01T05:00:00.000Z'),
			value: 73
		},
		{
			date: new Date('2024-12-02T05:00:00.000Z'),
			value: 83
		},
		{
			date: new Date('2024-12-03T05:00:00.000Z'),
			value: 79
		},
		{
			date: new Date('2024-12-04T05:00:00.000Z'),
			value: 51
		},
		{
			date: new Date('2024-12-05T05:00:00.000Z'),
			value: 96
		},
		{
			date: new Date('2024-12-06T05:00:00.000Z'),
			value: 91
		},
		{
			date: new Date('2024-12-07T05:00:00.000Z'),
			value: 80
		},
		{
			date: new Date('2024-12-08T05:00:00.000Z'),
			value: 64
		},
		{
			date: new Date('2024-12-09T05:00:00.000Z'),
			value: 86
		},
		{
			date: new Date('2024-12-10T05:00:00.000Z'),
			value: 79
		},
		{
			date: new Date('2024-12-11T05:00:00.000Z'),
			value: 100
		},
		{
			date: new Date('2024-12-12T05:00:00.000Z'),
			value: 85
		},
		{
			date: new Date('2024-12-13T05:00:00.000Z'),
			value: 72
		},
		{
			date: new Date('2024-12-14T05:00:00.000Z'),
			value: 53
		},
		{
			date: new Date('2024-12-15T05:00:00.000Z'),
			value: 51
		},
		{
			date: new Date('2024-12-16T05:00:00.000Z'),
			value: 81
		},
		{
			date: new Date('2024-12-17T05:00:00.000Z'),
			value: 97
		},
		{
			date: new Date('2024-12-18T05:00:00.000Z'),
			value: 73
		},
		{
			date: new Date('2024-12-19T05:00:00.000Z'),
			value: 96
		},
		{
			date: new Date('2024-12-20T05:00:00.000Z'),
			value: 85
		}
	];

	const format = (d: Date) => `${d.getMonth()}/${d.getDay()}`

	const temperatureColor = scaleSequential(
    extent(data, (d) => d.value) as [number, number],
    interpolateTurbo
  );

	let count = $state(0);
</script>

<svelte:head>
	<title>National Weather Service -- Home</title>
	<meta name="description" content="Alternative frontend to the national weather service API.">
	<meta name="keywords" content="Weather, NWS, US">
</svelte:head>

<div class="flex flex-row justify-between border-b p-2">
	<div></div>
	<LightSwitch />
</div>

<h1 class="text-4xl">Welcome to SvelteKit</h1>

<div>
	<p>You've pressed the button {count} times</p>
	<Button onclick={() => (count += 1)}>Click</Button>
</div>

<div class="h-[300px] p-4 border rounded">
  <LineChart data={data} x="date" y="value" yDomain={null}>
    <svelte:fragment slot="marks">
      <LinearGradient
        stops={ticks(1, 0, 10).map(temperatureColor.interpolator())}
        vertical
        let:url
      >
        <Spline class="stroke-2" stroke={url} />
      </LinearGradient>
    </svelte:fragment>

    <svelte:fragment slot="highlight" let:tooltip let:y>
      {#if tooltip.data}
        <Highlight lines points={{ fill: temperatureColor(y(tooltip.data)) }} />
      {/if}
    </svelte:fragment>

    <svelte:fragment slot="tooltip" let:x let:y>
      <Tooltip.Root let:data>
        {@const value = y(data)}
        <Tooltip.Header>{format(x(data))}</Tooltip.Header>
        <Tooltip.List>
          <Tooltip.Item label="temp" {value} color={temperatureColor(value)} />
        </Tooltip.List>
      </Tooltip.Root>
    </svelte:fragment>
  </LineChart>
</div>
