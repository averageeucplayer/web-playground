import type { Skill, SkillCast } from "$lib/models";
import { randomInRange } from "$lib/utils";
import type { SimulationContext } from "./context";

export function processSkillCast(context: SimulationContext, skill: Skill) {
    const {
        critRate,
        backAttacks,
        brandDebuffChance,
        attackPowerBuffChance,
        identityBuffChance,
        hatBuffChance,
        attackPower,
        criticalDamage,
    } = context.config;

    const isCritical = Math.random() < critRate;
    const isBackattack = Math.random() < backAttacks;

    const hadBrandDebuff = Math.random() < brandDebuffChance;
    const hadAttackPowerBuff = Math.random() < attackPowerBuffChance;
    const hadIdentityBuff = Math.random() < identityBuffChance;
    const hadHatBuff = Math.random() < hatBuffChance;

    let damage = attackPower * skill.ratio;
    damage = randomInRange(damage * 0.9, damage * 1.1)

    if (isCritical) damage *= criticalDamage;

    const cast: SkillCast = {
        timestamp: context.simulationTime,
        damage,
        isBackattack,
        isCritical,
        hadBrandDebuff,
        hadAttackPowerBuff,
        hadIdentityBuff,
        hadHatBuff,
    };

    skill.stats.castCount++;
    skill.castLog.push(cast);
    context.castCount++;
    context.skillCastLog.push({
        timestamp: context.simulationTime,
        skillId: skill.id,
    });

    context.hyperAwakeningDamage += damage;
    skill.stats.totalDamage.raw += damage;

    if(!skill.isHyperAwakening && damage > context.topDamageSkill.raw) {
        context.topDamageSkill.skillId = skill.id;
        context.topDamageSkill.raw = damage;
    }

    if(!skill.isHyperAwakening) {
        context.totalDamage += damage;
    }
}
