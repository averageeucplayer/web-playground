<script lang="ts">
	import { IconGrid3x3, IconList, IconBrandGithub } from '@tabler/icons-svelte';
    import Grid from "./Grid.svelte";
    import List from "./List.svelte";
  
    let viewMode = $state<'tile' | 'list'>('tile');

	function toggleView() {
		viewMode = viewMode === "list" ? "tile" : "list";
	}
  </script>
  
  <div class="h-screen flex justify-center items-center">
	<div class="absolute top-4 right-4 flex items-center gap-2">
		<a
			href="https://github.com/averageeucplayer/web-playground"
			target="_blank"
			rel="noopener noreferrer"
			class="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
		>
			<IconBrandGithub size={24} />
		</a>

		<button
			class="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
			onclick={toggleView}
		>
			{#if viewMode === 'tile'}
				<IconGrid3x3 size={24} />
			{:else}
				<IconList size={24} />
			{/if}
		</button>
	</div>
	{#if viewMode === 'tile'}
		<Grid />
	{:else}
		<List />
	{/if}
</div>