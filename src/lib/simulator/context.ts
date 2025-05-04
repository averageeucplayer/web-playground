import type { SimulationConfig, Skill, SkillCastLogEntry } from "$lib/models";
import type { SkillState } from "./skillState";

export interface SimulationContext {
    startedOn: number;
    simulationTime: number;
    elapsed: number;
    castCount: number;
    totalDamage: number;
    totalDamageTarget: number;
    config: SimulationConfig;
    skills: Record<number, Skill>;
    playerSkills: Skill[];
    skillCastLog: SkillCastLogEntry[];
    skillStates: SkillState[];
    identityCharge: number;
    lastSkillId: number;
    hyperAwakeningDamage: number;
    topDamageSkill: {
        skillId: number;
        raw: number;
    }
    getPriority(skillId: number, lastSkillId: number): number;
}
