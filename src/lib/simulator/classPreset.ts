import { DeathBladeSkills } from "$lib/skills";

const getPriorityForDeathblade = (skillId: number, lastSkillId: number) => {
    switch (skillId) {
        case DeathBladeSkills.Spincutter:
            return lastSkillId === skillId ? 6 : 1;

        case DeathBladeSkills.DeathSentence:
            return lastSkillId === DeathBladeSkills.Spincutter ? 1 : 5;

        case DeathBladeSkills.Maelstrom:
            return lastSkillId === DeathBladeSkills.DeathSentence ? 1 : 4;

        case DeathBladeSkills.DeathlySlash:
        case DeathBladeSkills.BreakingMoon:
            return lastSkillId === DeathBladeSkills.Maelstrom ? 1 : 3;

        case DeathBladeSkills.TwinShadows:
            return (
                lastSkillId === DeathBladeSkills.Maelstrom ||
                lastSkillId === DeathBladeSkills.DeathlySlash ||
                lastSkillId === DeathBladeSkills.BreakingMoon
            ) ? 1 : 10;

        case DeathBladeSkills.TurningSlash:
            return lastSkillId === DeathBladeSkills.TwinShadows ? 1 : 7;

        case DeathBladeSkills.EarthCleaver:
            return lastSkillId === DeathBladeSkills.TwinShadows || lastSkillId === DeathBladeSkills.TurningSlash
                ? 1 : 8;

        case DeathBladeSkills.SoulAbsorber:
            return lastSkillId === DeathBladeSkills.EarthCleaver || lastSkillId === DeathBladeSkills.TurningSlash
                ? 1 : 9;

        case DeathBladeSkills.VoidStrike:
            return lastSkillId === DeathBladeSkills.SoulAbsorber || lastSkillId === DeathBladeSkills.TurningSlash
                ? 1 : 2;

        case DeathBladeSkills.DeathTrance:
            return lastSkillId === DeathBladeSkills.VoidStrike
                ? 1 : 10;

        default:
            return -1;
    }
}

export interface ClassPreset {
    name: string;
    classId: number;
    className: string;
    specialisation: string;
    classSrc: string;
    iconSrc: string;
    skillIds: Set<number>;
    getPriority(skillId: number, lastSkillId: number): number;
}

export const allPresets: ClassPreset[] = [
    {
        name: "RE - ML-SC-EC-SA-VS-DS-TwS-DhS-CB",
        classId: 402,
        className: "Deathblade",
        specialisation: "Remaining Energy",
        classSrc: "./images/classes/402.webp",
        iconSrc: "./images/skills/Ability_209.webp",
        skillIds: new Set([
            DeathBladeSkills.Maelstrom,
            DeathBladeSkills.Spincutter,
            DeathBladeSkills.EarthCleaver,
            DeathBladeSkills.SoulAbsorber,
            DeathBladeSkills.VoidStrike,
            DeathBladeSkills.DeathSentence,
            DeathBladeSkills.TwinShadows,
            DeathBladeSkills.DeathlySlash,
            DeathBladeSkills.ChaoticDeathblade,
            DeathBladeSkills.DeathTrance
        ]),
        getPriority: getPriorityForDeathblade
    },
    {
        name: "RE - ML-SC-EC-SA-VS-DS-TwS-BM-EF",
        classId: 402,
        className: "Deathblade",
        specialisation: "Remaining Energy",
        classSrc: "./images/classes/402.webp",
        iconSrc: "./images/skills/Ability_209.webp",
        skillIds: new Set([
            DeathBladeSkills.Maelstrom,
            DeathBladeSkills.Spincutter,
            DeathBladeSkills.EarthCleaver,
            DeathBladeSkills.SoulAbsorber,
            DeathBladeSkills.VoidStrike,
            DeathBladeSkills.DeathSentence,
            DeathBladeSkills.TwinShadows,
            DeathBladeSkills.BreakingMoon,
            DeathBladeSkills.EternalFlash,
            DeathBladeSkills.DeathTrance
        ]),
        getPriority: getPriorityForDeathblade
    }
]