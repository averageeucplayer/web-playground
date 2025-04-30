export interface Player {
    name: string;
    skills: Skill[];
    duration: {
        seconds: number;
        formatted: string;
    }
    totalDamage: {
        raw: number;
        formatted: string;
    };
}

export interface Skill {
    id: number;
    name: string;
    iconSrc: string;
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

export interface FakeSummaryConfig {
    name: string;
    distribution: SkillDistribution;
    topDamageFrom: number;
    topDamageTo: number;
    critRateFrom: number;
    critRateTo: number;
    backAttacksFrom: number;
    backAttacksTo: number;
    durationSeconds: number;
}

export const templateSkills: Pick<Skill, "id" | "name" | "iconSrc">[] = [
    {
        id: 25030,
        name: "Death Trance",
        iconSrc: "/images/skills/BL_Skill_01_20.webp",
    },
    {
        id: 25440,
        name: "Deathly Slash",
        iconSrc: "/images/skills/BL_Skill_01_27.webp",
    },
    {
        id: 25110,
        name: "Soul Absorber",
        iconSrc: "/images/skills/BL_Skill_01_7.webp",
    },
    {
        id: 25080,
        name: "Death Sentence",
        iconSrc: "/images/skills/BL_Skill_01_4.webp",
    },
    {
        id: 25180,
        name: "Void Strike",
        iconSrc: "/images/skills/BL_Skill_01_14.webp",
    },
    {
        id: 25090,
        name: "Twin Shadows",
        iconSrc: "/images/skills/BL_Skill_01_14.webp",
    },
    {
        id: 25130,
        name: "Turning Slash",
        iconSrc: "/images/skills/BL_Skill_01_9.webp",
    },
    {
        id: 25070,
        name: "Earth Cleaver",
        iconSrc: "/images/skills/BL_Skill_01_3.webp",
    },
    {
        id: 25350,
        name: "Blade Assault",
        iconSrc: "/images/skills/BL_Skill_01_19.webp",
    },
    {
        id: 25160,
        name: "Maelstrom",
        iconSrc: "/images/skills/BL_Skill_01_12.webp",
    },
    {
        id: 25120,
        name: "Spincutter",
        iconSrc: "/images/skills/BL_Skill_01_8.webp",
    }
];

export function fakeSummary(config: FakeSummaryConfig): Player {
    const {
        name,
        distribution,
        topDamageFrom,
        topDamageTo,
        critRateFrom,
        critRateTo,
        backAttacksFrom,
        backAttacksTo,
        durationSeconds
    } = config;
    const totalDamage = randomInRange(topDamageFrom, topDamageTo);

    const rawDamages = templateSkills.map((template) => {
        const percent = distribution[template.name] || 0;
        return {
            template,
            rawDamage: percent * totalDamage
        };
    });

    const totalCalculated = rawDamages.reduce((sum, s) => sum + s.rawDamage, 0);

    const skills: Skill[] = rawDamages.map(({ template, rawDamage }) => {
        const correctedPercentage = rawDamage / totalCalculated;
        const finalDamage = Math.round(rawDamage);
        const dps = durationSeconds > 0 ? rawDamage / durationSeconds : 0;
        const crit = randomInRange(critRateFrom, critRateTo);
        const back = randomInRange(backAttacksFrom, backAttacksTo);

        return {
            ...template,
            totalDamage: {
                raw: finalDamage,
                formatted: formatNumber(finalDamage)
            },
            dps: {
                raw: dps,
                formatted: formatNumber(dps)
            },
            critRate: {
                raw: crit,
                formatted: formatPercent(crit)
            },
            backAttacks: {
                raw: back,
                formatted: formatPercent(back)
            },
            damagePercentage: {
                raw: correctedPercentage,
                formatted: formatPercent(correctedPercentage)
            }
        };
    });

    return {
        name,
        skills,
        duration: {
            seconds: durationSeconds,
            formatted: formatDuration(durationSeconds)
        },
        totalDamage: {
            raw: totalCalculated,
            formatted: formatNumber(totalCalculated)
        }
    };
}

export function load(): any {
    const dist: SkillDistribution = {
        "Death Trance": 0.193,
        "Deathly Slash": 0.18,
        "Soul Absorber": 0.131,
        "Death Sentence": 0.137,
        "Void Strike": 0.099,
        "Twin Shadows": 0.085,
        "Turning Slash": 0.072,
        "Earth Cleaver": 0.06,
        "Blade Assault": 0.034,
        "Maelstrom": 0.022,
        "Spincutter": 0.002,
    };

    const summary1 = fakeSummary({
        name: "Player1",
        distribution: dist,
        topDamageFrom: 7.34e10,
        topDamageTo: 7.65e10,
        critRateFrom: 0.75,
        critRateTo: 0.90,
        backAttacksFrom: 0.75,
        backAttacksTo: 0.9,
        durationSeconds: 600
    });

    dist["Death Trance"] -= 0.03;
    dist["Deathly Slash"] += 0.01;
    dist["Soul Absorber"] += 0.01;
    dist["Death Sentence"] += 0.01;

    const summary2 = fakeSummary({
        name: "Player2",
        distribution: dist,
        topDamageFrom: 3.34e10,
        topDamageTo: 3.65e10,
        critRateFrom: 0.4,
        critRateTo: 0.8,
        backAttacksFrom: 0.75,
        backAttacksTo: 0.9,
        durationSeconds: 600
    });

    return {
        summary1,
        summary2,
    };
}

function formatNumber(num: number): string {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "b";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "m";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "k";
    return num.toString();
}

function formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
}

function randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}