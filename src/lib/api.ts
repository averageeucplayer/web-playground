import { simulate } from "./simulator";
import type { Buff } from "./types";

export async function onNewBuffs(handler: (buffs: Buff[]) => void): Promise<() => void> {

    setTimeout(simulate.bind(null, [], handler), 0);

    return () => {

    };
}