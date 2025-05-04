<script lang="ts">
    import type { ClassPreset } from "$lib/simulator/classPreset";
    import { allPresets } from "$lib/simulator/classPreset";

	interface Props {
        value: ClassPreset;
        onSelect(value: ClassPreset): void;
    }

    let {
        value,
        onSelect
    }: Props = $props();

    let isOpen = $state(false);

    function onOpen() {
        isOpen = !isOpen;
    }

	function _onSelect(event: MouseEvent) {
        event.preventDefault();
        const selectedPresetName = (event.target as HTMLElement).getAttribute('data-name');
        const selectedPreset = allPresets.find(preset => preset.name === selectedPresetName);
        
        if (selectedPreset) {
            onSelect(selectedPreset);
            isOpen = false;
        }
	}
</script>

<div class="relative w-128">
	<button class="select-box border rounded px-4 py-2 cursor-pointer" onclick={onOpen}>
		<img src={value.iconSrc} alt="" class="inline w-5 h-5 mr-2" />
		<span>{value.name}</span>
	</button>

	{#if isOpen}
		<ul class="absolute z-10 bg-[#000000BB] border rounded mt-1 shadow w-full max-h-64 overflow-auto">
			{#each allPresets as preset}
				<li data-name={preset.name} class="px-4 py-2 hover:bg-gray-500 cursor-pointer flex items-center" onclick={_onSelect}>
					<img src={preset.iconSrc} alt="" class="w-5 h-5 mr-2" />
					{preset.name}
				</li>
			{/each}
		</ul>
	{/if}
</div>