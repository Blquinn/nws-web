<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import LightSwitch from "@/components/ui/light-switch.svelte";

	let count = $state(0);
</script>

<div class="flex flex-row justify-between p-2 border-b">
	<div></div>
	<LightSwitch />
</div>

<h1 class="text-4xl">Welcome to SvelteKit</h1>

<div>
	<p>You've pressed the button {count} times</p>
	<Button onclick={() => (count += 1)}>Click</Button>
</div>
