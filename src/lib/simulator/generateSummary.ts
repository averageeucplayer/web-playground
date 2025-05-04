import type { Player, SimulationConfig, Skill, SkillCast } from "$lib/models";
import { formatCompactNumber, formatDuration, formatPercent, randomU64 } from "$lib/utils";
import type { SimulationContext } from "./context";
import { finalizeSkillStats } from "./misc";

function* getAllSkillCasts(skills: Record<number, Skill>): Generator<SkillCast> {
    for (const skill of Object.values(skills)) {
        for (const cast of skill.castLog) {
            yield cast;
        }
    }
}

export function generateSummary(config: SimulationConfig, context: SimulationContext): Player {
    const {
        name,
        className,
        attackPower,
        durationSeconds,
        critRate,
        criticalDamage
    } = config;
    const actualDurationSeconds = (context.simulationTime - context.startedOn) / 1000;

    const castLog = getAllSkillCasts(context.skills);

    const acc = {
        backAttacks: 0,
        brandDebuffCasts: 0,
        attackPowerBuffCasts: 0,
        identityBuffCasts: 0,
        hatBuffCasts: 0,
        finalTotalDamage: 0,
        totalCasts: 0
    };

    for (const cast of castLog) {
        if (cast.isBackattack) acc.backAttacks++;
        if (cast.hadBrandDebuff) acc.brandDebuffCasts++;
        if (cast.hadAttackPowerBuff) acc.attackPowerBuffCasts++;
        if (cast.hadIdentityBuff) acc.identityBuffCasts++;
        if (cast.hadHatBuff) acc.hatBuffCasts++;
        acc.finalTotalDamage += cast.damage;
        acc.totalCasts++;
    }

    const {
        attackPowerBuffCasts,
        backAttacks,
        brandDebuffCasts,
        finalTotalDamage,
        hatBuffCasts,
        identityBuffCasts,
        totalCasts
    }= acc;

    finalizeSkillStats(context.playerSkills, finalTotalDamage, durationSeconds);
    const dps = context.totalDamage / (durationSeconds);
    
    const backAttackRate = totalCasts ? backAttacks / totalCasts : 0;
    const brandDebuffRate = totalCasts ? brandDebuffCasts / totalCasts : 0;
    const attackPowerBuffRate = totalCasts ? attackPowerBuffCasts / totalCasts : 0;
    const identityBuffRate = totalCasts ? identityBuffCasts / totalCasts : 0;
    const hatBuffRate = totalCasts ? hatBuffCasts / totalCasts : 0;
    const castsPerMinute = context.castCount / (durationSeconds / 60);

    return {
        id: randomU64(),
        name,
        classId: config.classPreset.classId,
        className: className,
        specialisation: config.classPreset.specialisation,
        classSrc: config.classPreset.classSrc,
        actualDurationSeconds,  
        skills: context.playerSkills,
        skillCastLog: context.skillCastLog,
        duration: {
            seconds: durationSeconds,
            formatted: formatDuration(durationSeconds),
        },
        stats: {
            attackPower,
            critRate: critRate,
            criticalDamage,
            castsPerMinute,
            topDamageSkill: {
                skillId: context.topDamageSkill.skillId,
                raw: context.topDamageSkill.raw,
                formatted: formatCompactNumber(context.topDamageSkill.raw),
            },
            buffUptimes: {
                brandDebuff: {
                    raw: brandDebuffRate,
                    formatted: formatPercent(brandDebuffRate),
                },
                attackPowerBuff: {
                    raw: attackPowerBuffRate,
                    formatted: formatPercent(attackPowerBuffRate),
                },
                identityBuff: {
                    raw: identityBuffRate,
                    formatted: formatPercent(identityBuffRate),
                },
                hatBuff: {
                    raw: hatBuffRate,
                    formatted: formatPercent(hatBuffRate),
                },
            },
            backAttacks: {
                raw: backAttackRate,
                formatted: formatPercent(backAttackRate),
            },
            dps: {
                raw: dps,
                formatted: formatCompactNumber(dps)
            },
            totalDamage: {
                raw: finalTotalDamage,
                formatted: formatCompactNumber(finalTotalDamage),
            },
        }
    };
}