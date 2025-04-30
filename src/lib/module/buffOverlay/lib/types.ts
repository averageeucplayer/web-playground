export interface BuffTemplate {
    id: number;
    name: string;
    description?: string;
    duration?: number;
    iconSrc: string;
}

export type Buff = PermamentBuff | BuffWithDuration;

export interface PermamentBuff {
    kind: "permament";
    appliedOn: string;
    instanceId: number;
    id: number;
    name: string;
    iconSrc: string;
    order: number;
}

export interface BuffWithDuration {
    kind: "expiring";
    appliedOn: string;
    instanceId: number;
    id: number;
    name: string;
    duration: number;
    remainingTime: number;
    iconSrc: string;
    order: number;
}
