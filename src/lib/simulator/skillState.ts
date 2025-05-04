import type { Skill } from "$lib/models";
import { DeathBladeSkills } from "$lib/skills";
import type { SimulationContext } from "./context";

export class SkillState {
    id: number;
    name: string;
    skill: Skill;
    lastUsed: number;
    usedOnce: boolean;
    expiresOn: number;

    constructor(skill: Skill) {
        this.id = skill.id;
        this.name = skill.name;
        this.skill = skill;
        this.lastUsed = 0;
        this.usedOnce = false;
        this.expiresOn = 0;
    }

    isOnCooldown(simulationTime: number): boolean {
        return this.expiresOn > simulationTime;
    }

    canUse(context: SimulationContext): boolean {
        // if(this.skill.id === DeathBladeSkills.VoidStrike) debugger;

        if (this.skill.isHyperAwakening && this.usedOnce) return false;
        if (this.skill.id === DeathBladeSkills.DeathTrance && context.identityCharge < 3) return false;
        if (this.isOnCooldown(context.simulationTime)) return false;

        const cooldownRemaining = this.getRemaining(context.simulationTime);
        if (cooldownRemaining > 0) {
            return false;
        }

        if (this.skill.isHyperAwakening && context.elapsed < 180 * 1000) {
            return false;
        }

        return true;
    }

    getRemaining(simulationTime: number): number {
        const remainingDuration = this.expiresOn - simulationTime;
        return Math.max(remainingDuration, 0);
    }

    use(context: SimulationContext): void {

        if (this.skill.id === DeathBladeSkills.DeathTrance) {
            context.identityCharge = 0;

            for (const skillState of context.skillStates.filter(pr => pr.skill.id !== this.skill.id
                && !pr.skill.isHyperAwakeningTechnique
            )) {
                const remainingCooldown = this.getRemaining(context.simulationTime);
                const reducedCooldown = remainingCooldown * 0.5;
                const expiresOn = context.simulationTime + reducedCooldown;
                skillState.expiresOn = expiresOn;
            }
        }
        else {
            const expiresOn = context.simulationTime + this.skill.cooldown * 1000;
            this.expiresOn = expiresOn;
        }

        if (this.skill.isHyperAwakening) {
            this.usedOnce = true;
        }

        context.identityCharge += this.skill.identityGain;

        if(context.identityCharge > 3) {
            context.identityCharge = 3;
        }
    }
}
