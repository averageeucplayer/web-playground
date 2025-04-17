import { COMBAT_BLESSING, DANCE_OF_PASSION, IMPROVED_SWIFTNESS, MELODY_INCREASE, STANDING_STRIKE, VITALITY_TRAINING } from "./buffs";
import type { Buff, BuffTemplate } from "./types";

export function parseGameMarkup(raw: string): string {
    return raw
        .replace(/<FONT COLOR='(#[^']+)'>/gi, "<span style='color:$1'>")
        .replace(/<\/FONT>/gi, "</span>");
}

export function getOrder(template: BuffTemplate): number {
    switch(template.id) {
        case IMPROVED_SWIFTNESS.id: return 999;
        case VITALITY_TRAINING.id: return 998;
        case STANDING_STRIKE.id: return 997;
        case MELODY_INCREASE.id: return 996;
        default: return 0;
    }
}

const instanceIds = new Set<number>();

export function toBuff(template: BuffTemplate): Buff {
    let instanceId = Math.random();

    while(instanceIds.has(instanceId)) {
        instanceId = Math.random();
    }

    instanceIds.add(instanceId);

    const appliedOn = new Date().toISOString();

    if(!template.duration) {
        return {
            instanceId,
            appliedOn,
            kind: "permament",
            ...template,
            order: getOrder(template)
        };
    }

    return {
        instanceId,
        appliedOn,
        kind: "expiring",
        remainingTime: template.duration,
        duration: template.duration || 0,
        ...template,
        order: getOrder(template)
    };
}

export function updateDynamicOrders(buffs: Buff[]) {
    const zeroOrderBuffs = buffs
        .filter(b => b.order === 0)
        .sort((a, b) => new Date(a.appliedOn).getTime() - new Date(b.appliedOn).getTime());
  
    zeroOrderBuffs.forEach((buff, index) => {
        buff.order = index;
    });
}