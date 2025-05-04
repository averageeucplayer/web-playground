import { type SimulationConfig, type Skill } from "$lib/models";
import { templateSkills, type SkillTemplate } from "$lib/skills";
import { formatCompactNumber, formatDecimal, formatPercent } from "$lib/utils";
import type { SimulationContext } from "./context";
import { SkillState } from "./skillState";

function createSkill(template: SkillTemplate): Skill {
    return {
        ...template,
        castLog: [],
        stats: {
            castCount: 0,
            castsPerMinute: { raw: 0, formatted: "" },
            totalDamage: { raw: 0, formatted: "" },
            dps: { raw: 0, formatted: "" },
            critRate: { raw: 0, formatted: "" },
            backAttacks: { raw: 0, formatted: "" },
            damagePercentage: { raw: 0, formatted: "" },
        }
    };
}

function initializeSkills(selectedSkillIds: Set<number>): Skill[] {

    return templateSkills
        .filter(skill => selectedSkillIds.has(skill.id))
        .map(createSkill);
}

export function initializeContext(config: SimulationConfig): SimulationContext {
    const playerSkills = initializeSkills(config.classPreset.skillIds);
    const skillStates: SkillState[] = playerSkills.map(skill => new SkillState(skill));

    const context: SimulationContext = {
        startedOn: Date.now(),
        simulationTime: Date.now(),
        elapsed: 0,
        castCount: 0,
        totalDamage: 0,
        totalDamageTarget: config.totalDamageDealt,
        config,
        skillCastLog: [],
        skills: playerSkills,
        playerSkills,
        skillStates,
        identityCharge: 0,
        lastSkillId: 0,
        hyperAwakeningDamage: 0,
        topDamageSkill: {
            skillId: 0,
            raw: 0
        },
        getPriority: config.classPreset.getPriority,
    };

    return context;
}

export function finalizeSkillStats(skills: Skill[], totalDamage: number, durationSeconds: number) {
    for (const skill of skills) {
        const casts = skill.castLog.length;
        const { crits, backs } = skill.castLog.reduce(
            (acc, cast) => {
                if (cast.isCritical) acc.crits++;
                if (cast.isBackattack) acc.backs++;
                return acc;
            },
            { crits: 0, backs: 0 }
        );

        const stats = skill.stats;
        stats.totalDamage.formatted = formatCompactNumber(stats.totalDamage.raw);
        stats.dps.raw = stats.totalDamage.raw / durationSeconds;
        stats.dps.formatted = formatCompactNumber(stats.dps.raw);
        stats.critRate.raw = casts ? crits / casts : 0;
        stats.critRate.formatted = formatPercent(stats.critRate.raw);
        stats.backAttacks.raw = casts ? backs / casts : 0;
        stats.backAttacks.formatted = formatPercent(stats.backAttacks.raw);
        stats.damagePercentage.raw = totalDamage ? stats.totalDamage.raw / totalDamage : 0;
        stats.damagePercentage.formatted = formatPercent(stats.damagePercentage.raw);
        stats.castsPerMinute = {
            raw: stats.castCount / (durationSeconds / 60),
            formatted: formatDecimal(stats.castCount / (durationSeconds / 60))
        };
    }
}
