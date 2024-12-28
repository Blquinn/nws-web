<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { unitSystemStore } from '@/state';

	// let mode: unitSystems = 'imperial';
  
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}>
		<div>
			{#if $unitSystemStore == 'imperial'}IU{:else}SI{/if}
		</div>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item
			onclick={() => {
				$unitSystemStore = 'imperial';
			}}>Imperial Units (Farenheit, mi/h)</DropdownMenu.Item
		>
		<DropdownMenu.Item
			onclick={() => {
				$unitSystemStore = 'metric';
			}}>Metric System (Celcius, km/h)</DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>
