<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	type unitSystems = 'metric' | 'imperial';
	let mode: unitSystems = 'imperial';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}>
		<div>
			{#if mode == 'imperial'}IU{:else}SI{/if}
		</div>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item
			onclick={() => {
				mode = 'imperial';
			}}>Imperial Units (Farenheit, mi/h)</DropdownMenu.Item
		>
		<DropdownMenu.Item
			onclick={() => {
				mode = 'metric';
			}}>Metric System (Celcius, km/h)</DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>
