<script lang="ts">
    import { useBuffs } from "$lib/store";
    import type { Buff } from "$lib/types";
   
	const buffs = useBuffs();

	function getFadeClass(buff: Buff): string {

		if(buff.kind == "permament") {
			return "";
		}

		switch(buff.remainingTime) {
			case 3: return "grayscale opacity-80";
			case 2: return "grayscale opacity-60";
			case 1: return "grayscale opacity-30";
			default: return "";
		}
  }
</script>

<div class="h-screen flex justify-center items-center">
	<div class="grid grid-rows-5 grid-cols-6 gap-4 items-start h-[600px] w-[800px] bg-black/80 p-8 rounded-2xl shadow-2xl overflow-auto">
		{#each $buffs.filter(buff => buff.kind === "permament" || buff.remainingTime > 0) as buff (buff.instanceId)}
		<div class={buff.kind === "expiring" ? "relative w-24 h-24" : "relative w-24 h-24"}>
			<img
			src={buff.iconSrc}
			alt={buff.name}
			class={`w-full h-full rounded-lg brightness-80 transition-all duration-700 ${getFadeClass(buff)}`}
			/>

			{#if buff.kind === "expiring"}
			<div class="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold drop-shadow-md">
				{`${buff.remainingTime}s`}
			</div>
			{/if}
		</div>
		{/each}
	</div>
</div>
