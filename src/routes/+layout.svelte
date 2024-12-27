<script lang="ts">
	export const prerender = false;

	import '../app.css';
	import { ModeWatcher } from "mode-watcher";

	let { children } = $props();
</script>

<ModeWatcher />

{@render children()}
