import type { ClassPreset } from "./simulator/classPreset";

export interface AppState {
    id: string;
    createdOn: string;
    updatedOn: string;
    comparisons: Comparison[];
}

// export class CooldownTable {
//     private cooldowns: Record<number, number> = {};
    
//     isReady(skillId: number, simulationTime: number): boolean {
//         return (this.cooldowns[skillId] ?? 0) <= simulationTime;
//     }

//     setCooldown(skillId: number, readyAt: number) {
//         this.cooldowns[skillId] = readyAt;
//     }

//     getRemaining(skillId: number, simulationTime: number): number {
//         return Math.max((this.cooldowns[skillId] ?? 0) - simulationTime, 0);
//     }
// }

export interface Comparison {
    id: string;
    createdOn: string;
    player1: Player;
    player2: Player;
}

export interface SkillComparison {
    name: string;
    icon: string;
    skill1?: Skill;
    skill2?: Skill;
}

export interface SkillCastLogEntry {
    timestamp: number;
    skillId: number;
}

export interface Player {
    id: bigint;
    name: string;
    classId: number;
    className: string;
    specialisation: string;
    classSrc: string;
    skills: Skill[];
    duration: {
        seconds: number;
        formatted: string;
    }
    actualDurationSeconds: number;
    skillCastLog: SkillCastLogEntry[];
    stats: PlayerStats
}

export interface PlayerStats {
    attackPower: number;
    criticalDamage: number;
    critRate: number;
    castsPerMinute: number;
    topDamageSkill: {
        skillId: number;
        raw: number;
        formatted: string;
    }
    buffUptimes: {
        brandDebuff: {
            raw: number;
            formatted: string;
        };
        attackPowerBuff: {
            raw: number;
            formatted: string;
        };
        identityBuff: {
            raw: number;
            formatted: string;
        };
        hatBuff: {
            raw: number;
            formatted: string;
        };
    };
    backAttacks: {
        raw: number;
        formatted: string;
    }
    dps: {
        raw: number;
        formatted: string;
    }
    totalDamage: {
        raw: number;
        formatted: string;
    };
}

export interface SkillCast {
    timestamp: number;
    damage: number;
    isBackattack: boolean;
    isCritical: boolean;
    hadBrandDebuff: boolean;
    hadAttackPowerBuff: boolean;
    hadIdentityBuff: boolean;
    hadHatBuff: boolean;
}

export interface Skill {
    id: number;
    name: string;
    identityGain: number;
    isHyperAwakeningTechnique: boolean;
    isHyperAwakening: boolean;
    cooldown: number;
    castTime: number;
    ratio: number;
    iconSrc: string;
    castLog: SkillCast[];
    stats: SkillStats;
}

export interface SkillStats {
    castCount: number;
    castsPerMinute: {
        raw: number;
        formatted: string;
    };
    totalDamage: {
        raw: number;
        formatted: string;
    };
    dps: {
        raw: number;
        formatted: string;
    };
    critRate: {
        raw: number;
        formatted: string;
    }
    backAttacks: {
        raw: number;
        formatted: string
    }
    damagePercentage: {
        raw: number;
        formatted: string
    };
}

export type SkillDistribution = Record<string, number>;

export interface SimulationConfig {
    name: string;
    classPreset: ClassPreset;
    className: string;
    attackPower: number;
    criticalDamage: number;
    totalDamageDealt: number;
    critRate: number;
    backAttacks: number;
    durationSeconds: number;
    brandDebuffChance: number;
    attackPowerBuffChance: number;
    identityBuffChance: number;
    hatBuffChance: number;
}

export interface LoaLogsEncounter {
    id: number;
    lastCombatPacket: number;
    totalDamageDealt: number;
    topDamageDealt: number,
    totalTamageTaken: number;
    topDamageTaken: number;
    dps: number;
    buffs: string;
    debuffs: string;
    totalShielding: number;
    totalEffectiveShielding: number;
    appliedShieldBuffs: string;
    misc: string;
    version: number;
    bossHpLog: string;
    staggerLog: string;
}

export interface LoaLogsEntity {
    name: string;
    characterId: number,
    encounterId: number;
    npcId: number,
    entityType: string;
    classId: number;
    className: string;
    gearScore: number
    currentHp: number;
    maxHp: number,
    isDead: boolean;
    skills: string;
    damageStats: string;
    dps: number;
    skillStats: string;
    lastUpdate: number;
    engravings: string;
    gearHash: number;
    spec: string;
    isArkPassiveActive: boolean;
    arkPassiveData: string;
}