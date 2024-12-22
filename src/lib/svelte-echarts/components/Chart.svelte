<script lang="ts">
  import type {
    init as baseInit,
    EChartsType as BaseEchartsType,
    EChartsOption,
    SetOptionOpts,
  } from 'echarts'
  import { init as coreInit, type EChartsType as CoreEchartsType } from 'echarts/core'
  import type { EChartsInitOpts } from 'echarts'
  import { createEventDispatcher, onMount } from 'svelte'
  import { EVENT_NAMES, type EventHandlers } from '$lib/svelte-echarts/constants/events'
	import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    init?: typeof baseInit | typeof coreInit;
    theme?: string | object | null;
    initOptions?: EChartsInitOpts;

    options: EChartsOption;
    notMerge?: SetOptionOpts['notMerge'];
    lazyUpdate?: SetOptionOpts['lazyUpdate'];
    silent?: SetOptionOpts['silent'];
    replaceMerge?: SetOptionOpts['replaceMerge'];
    transition?: SetOptionOpts['transition'];

    chart?: (BaseEchartsType | CoreEchartsType);
  }

  let element: HTMLDivElement

  let {
    init = coreInit,
    theme = 'dark',
    initOptions = {},
    options,
    notMerge = true,
    lazyUpdate = false,
    silent = false,
    replaceMerge = undefined,
    transition = undefined,
    chart = undefined,
    ...restProps
  }: Props = $props();

  $effect(() => {
    if (chart) chart.setOption(options, { notMerge, lazyUpdate, silent, replaceMerge, transition });
  })

  const dispatch = createEventDispatcher<EventHandlers>()

  const initChart = () => {
    if (chart) chart.dispose()

    chart = init(element, theme, initOptions)

    EVENT_NAMES.forEach((eventName) => {
      // @ts-expect-error
      chart!.on(eventName, (event) => dispatch(eventName, event))
    })
  }

  onMount(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (!chart) initChart()
      else chart.resize()
    })
    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
      chart?.dispose()
    }
  })
</script>

<div bind:this={element} {...restProps}></div>
