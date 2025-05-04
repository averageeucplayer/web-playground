<script lang="ts">
    import type { SimulationConfig } from "$lib/models";
    import { allPresets, type ClassPreset } from "$lib/simulator/classPreset";
    import { formatCompactNumber } from "$lib/utils";
    import { Slider } from "@skeletonlabs/skeleton-svelte";
    import type { SvelteComponent } from "svelte";
    import PresetDropdown from "./PresetDropdown.svelte";

	interface Props {
		config: SimulationConfig;
		onChange: <T extends keyof SimulationConfig>(
			key: T,
			value: SimulationConfig[T]
		) => void;
	}

	let {
		config,
		onChange
	}: Props = $props();

    function onPresetChange(value: ClassPreset) {
        onChange("classPreset", value);
    }

	function onAttackPowerChange(event: { value: [number] }) {
        onChange("attackPower", event.value[0]);
    }

    function onCriticalDamageChange(event: { value: [number] }) {
        onChange("criticalDamage", event.value[0]);
    }

    function onCritRateChange(event: { value: [number] }) {
        onChange("critRate", event.value[0]);
    }

    function onBackAttacksChange(event: { value: [number] }) {
        onChange("backAttacks", event.value[0]);
    }

	function onDurationSecondsChange(event: { value: [number] }) {
        onChange("durationSeconds", event.value[0]);
    }

    function onBrandDebuffChanceChange(event: { value: [number] }) {
        onChange("brandDebuffChance", event.value[0]);
    }

    function onAttackPowerBuffChanceChange(event: { value: [number] }) {
        onChange("attackPowerBuffChance", event.value[0]);
    }

    function onIdentityBuffChanceChange(event: { value: [number] }) {
        onChange("identityBuffChance", event.value[0]);
    }

    function onHatBuffChanceChange(event: { value: [number] }) {
        onChange("hatBuffChance", event.value[0]);
    }

    function onTotalDamageChange(event: { value: [number] }) {
        onChange("totalDamageDealt", event.value[0]);
    }

</script>
  
<div class="bg-gray-700 rounded-xl p-6 shadow">
    {#snippet compactMarker(number: number)}
        <div>{formatCompactNumber(number)}</div>
    {/snippet}

	<div>
		<label class="label">
			<span class="label-text">Name</span>
			<input value={config.name} class="input" type="text" placeholder="Enter name" />
		</label>
	</div>
	<div class="mt-4">
        <label class="label">
			<span class="label-text">Preset</span>
			<PresetDropdown value={config.classPreset} onSelect={onPresetChange} />
		</label>
	</div>
    <div>
        <div class="mt-6 mb-4">Attack Power</div>
        <Slider
			markOpacity="opacity-100"
            value={[config.attackPower]}
            onValueChange={onAttackPowerChange}
            min={20_000}
            max={120_000}
            step={1000}
            mark={compactMarker}
            markers={[20000, 50000, 80000, 100000, 120000]}
        />
    </div>

    <div>
        <div class="mt-6 mb-4">Critical Damage</div>
        <Slider
			markOpacity="opacity-100"
            value={[config.criticalDamage]}
            onValueChange={onCriticalDamageChange}
            min={1.0}
            max={2.5}
            step={0.05}
            markers={[1.25, 1.75, 2.25]}
        />
    </div>

    <div>
        <div class="mt-6 mb-4">Crit Rate</div>
        <Slider
			markOpacity="opacity-100"
            value={[config.critRate]}
            onValueChange={onCritRateChange}
            min={0}
            max={1}
            step={0.01}
            markers={[0.1, 0.3, 0.5, 0.7, 0.9]}
        />
    </div>

    <div>
        <div class="mt-6 mb-4">Back Attacks</div>
        <Slider
			markOpacity="opacity-100"
            value={[config.backAttacks]}
            onValueChange={onBackAttacksChange}
            min={0}
            max={1}
            step={0.01}
            markers={[0.2, 0.5, 0.8]}
        />
    </div>

    <div>
        <div class="mt-6 mb-4">Brand Debuff Chance</div>
        <Slider
			markOpacity="opacity-100"
            value={[config.brandDebuffChance]}
            onValueChange={onBrandDebuffChanceChange}
            min={0}
            max={1}
            step={0.01}
            markers={[0.2, 0.5, 0.9]}
        />
    </div>

    <div>
        <div class="mt-6 mb-4">Attack Power Buff Chance</div>
        <Slider
			markOpacity="opacity-100"
            value={[config.attackPowerBuffChance]}
            onValueChange={onAttackPowerBuffChanceChange}
            min={0}
            max={1}
            step={0.01}
            markers={[0.2, 0.5, 0.9]}
        />
    </div>

    <div>
        <div class="mt-6 mb-4">Identity Buff Chance</div>
        <Slider
			markOpacity="opacity-100"
            value={[config.identityBuffChance]}
            onValueChange={onIdentityBuffChanceChange}
            min={0}
            max={1}
            step={0.01}
            markers={[0.2, 0.5, 0.9]}
        />
    </div>

    <div class="">
        <div class="mt-6 mb-4">Hat Buff Chance</div>
        <Slider
            markOpacity="opacity-100"
            value={[config.hatBuffChance]}
            onValueChange={onHatBuffChanceChange}
            min={0}
            max={1}
            step={0.01}
            markers={[0.2, 0.5, 0.9]}
        />
    </div>

	<div>
        <div class="mt-6 mb-4">Duration (seconds)</div>
        <Slider
			markOpacity="opacity-100"
            value={[config.durationSeconds]}
            onValueChange={onDurationSecondsChange}
            min={300}
            max={900}
            step={10}
            markers={[300, 600, 900]}
        />
    </div>

    <div class="pb-4">
        <div class="mt-6 mb-4">Stop when it reaches total damage</div>
        <Slider
            markOpacity="opacity-100"
            value={[config.totalDamageDealt]}
            onValueChange={onTotalDamageChange}
            min={5e10}
            max={5e11}
            mark={compactMarker}
            markers={[5e10, 1e11, 1.5e11, 2e11, 3e11, 4e11, 5e11]}
        />
    </div>
</div>