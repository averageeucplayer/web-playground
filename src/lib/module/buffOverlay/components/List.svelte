<script lang="ts">
	import { useBuffs } from "$lib/store";
	import type { Buff } from "$lib/types";

	const buffs = useBuffs();

	function getFadeClass(buff: Buff): string {
		if (buff.kind !== "expiring") return "";

		switch (buff.remainingTime) {
			case 3: return "grayscale opacity-80";
			case 2: return "grayscale opacity-60";
			case 1: return "grayscale opacity-30";
			default: return "";
		}
	}
</script>

<div class="flex flex-col gap-4 p-8 h-[600px] w-[800px] overflow-auto">
	{#each $buffs.filter(buff => buff.kind === "permament" || buff.remainingTime > 0) as buff (buff.id)}
		<div class={`flex items-center justify-between w-full px-2 py-1 rounded ${getFadeClass(buff)}`}>
			<div class="flex items-center gap-3">
				<img
					src={buff.iconSrc}
					alt={buff.name}
					class="w-8 h-8 rounded-lg"
				/>
				<span class="text-white">{buff.name}</span>
			</div>

			{#if buff.kind === "expiring"}
				<span class="text-white font-mono text-sm">{buff.remainingTime}s</span>
			{/if}
		</div>
	{/each}
</div>