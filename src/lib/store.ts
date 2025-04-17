import { setContext, getContext } from 'svelte';
import type { Writable } from 'svelte/store';
import type { Buff } from "$lib/types";

export const setBuffs = (context: Writable<Buff[]>) => {
    setContext("buffs", context);
}

export const useBuffs = (): Writable<Buff[]> => {
    return getContext("buffs");
}