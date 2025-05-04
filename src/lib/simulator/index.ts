import { type Player, type SimulationConfig } from "$lib/models";

import { generateSummary } from "./generateSummary";
import { initializeContext } from "./misc";
import { processSkillCast } from "./processSkillCast";
import type { SimulationContext } from "./context";
import { DeathBladeSkills } from "$lib/skills";

export function simulateRaid(config: SimulationConfig): Player {
    const context = initializeContext(config);

    simulateCombatLoop(context);

    const summary = generateSummary(config, context);

    return summary;
}

function simulateCombatLoop(context: SimulationContext) {

    while (context.totalDamage < context.totalDamageTarget) {
        context.elapsed = context.simulationTime - context.startedOn;

        const availableSkills = context.skillStates
            .filter(skillState => skillState.canUse(context))
            .sort((a, b) => context.getPriority(a.id, context.lastSkillId) - context.getPriority(b.id, context.lastSkillId));

        if (availableSkills.length === 0) {
            waitForNextCooldown(context);
            continue;
        }

        const skillState = availableSkills[0];

        //  if(skillState.id === DeathBladeSkills.VoidStrike) debugger;
        // console.log(`casting ${skillState.name}`);
        context.simulationTime += skillState.skill.castTime * 1000;
        context.lastSkillId = skillState.id;
        processSkillCast(context, skillState.skill);
        skillState.use(context);
    }
}

function waitForNextCooldown(context: SimulationContext) {
    const remainingCooldowns = context.skillStates
        .filter(skillState => skillState.isOnCooldown(context.simulationTime))
        .map(skillState => skillState.getRemaining(context.simulationTime));

    const shortestCooldown = Math.min(...remainingCooldowns);
    console.log(`waiting ${shortestCooldown}`);
    context.simulationTime += shortestCooldown;
}