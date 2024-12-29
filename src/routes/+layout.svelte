<script lang="ts">
	import LightSwitch from '@/components/ui/light-switch.svelte';


	import '../app.css';
	import { ModeWatcher } from "mode-watcher";
	import UnitSwitch from '@/components/ui/unit-switch.svelte';

	let { children } = $props();
</script>

<ModeWatcher />

<!-- Header -->
<div class="flex flex-row justify-between border-b p-2">
	<div class="flex flex-row px-2 gap-4 items-center">
		<a href="/">Home</a>
		<a href="/radar">Radar</a>
	</div>

	<!-- Right side -->
	<div class="flex flex-row gap-2">
		<LightSwitch />
		<UnitSwitch />
	</div>
</div>

{@render children()}
