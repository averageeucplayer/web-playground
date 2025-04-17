import type { BuffTemplate } from "./types"

export const VITALITY_TRAINING: BuffTemplate = {
    id: 20004,
    name: "[Pet Effect] Vitality Training",
    description: "Max HP +<FONT COLOR='#00ffa8'>5%</FONT>.",
    iconSrc: "./images/Buff_7.png"
}

export const IMPROVED_SWIFTNESS: BuffTemplate = {
    id: 21300,
    name: "[Pet Effect] Improved Swiftness",
    description: "Swiftness +<FONT COLOR='#00ffa8'>40</FONT>",
    iconSrc: "./images/Ability_58.png"
}

export const STANDING_STRIKE: BuffTemplate = {
    id: 2000442,
    name: "Standing Strike II",
    description: "Evolution-Type Damage +<FONT COLOR='#99ff99'>1.5%</font>, Brand Power +<FONT COLOR='#99ff99'>2%</font> per stack.",
    iconSrc: "./images/Ark_Passive_Evolution_18.png"
}

export const LUMINARY: BuffTemplate = {
    id: 606010107,
    name: "Luminary",
    description: "Ally Atk. Power Enhancement Effect +<FONT color=\"#D4FF88\">6%</FONT>. Skill cooldown -<FONT color=\"#D4FF88\">5%</FONT>. (Excluding Movement, Stand Up, and Awakening Skills)",
    iconSrc: "./images/buff_260.png"
}

export const INSIGHT: BuffTemplate = {
    id: 606010007,
    name: "Insight II",
    description: "Ally Atk. Power Enhancement Effect +<FONT color=\"#D4FF88\">1.6%</FONT>.",
    duration: 5,
    iconSrc: "./images/buff_116.png"
}

export const COMBAT_BLESSING: BuffTemplate = {
    id: 2000262,
    name: "Combat Blessing II",
    description: "Evolution-Type Damage +<FONT COLOR='#99ff99'>1.5%</font>, Brand Power +<FONT COLOR='#99ff99'>2%</font> per stack.",
    duration: 20,
    iconSrc: "./images/Ark_Passive_Evolution_19.png"
}

export const DANCE_OF_PASSION: BuffTemplate = {
    id: 2000362,
    name: "Dance of Passion II",
    description: "Evolution-Type Damage +<FONT COLOR='#99ff99'>1.5%</font>, Brand Power +<FONT COLOR='#99ff99'>2%</font> per stack.",
    duration: 20,
    iconSrc: "./images/Ark_Passive_Evolution_33.png"
}

export const MAGICK_STREAM: BuffTemplate = {
    id: 500230,
    name: "Magick Stream III",
    description: "MP Recovery +<FONT COLOR='#99ff99'>2.4%</FONT>. Skill Cooldown -<FONT COLOR='#99ff99'>0.8%</FONT>. Stacks up to <FONT COLOR='#ffff99'>10</FONT> times.",
    duration: 10,
    iconSrc: "./images/Ability_86.png"
}

export const CONCENTRATE: BuffTemplate = {
    id: 522807,
    name: "Concentrate",
    description: "Skill Cooldown -<FONT COLOR='#99ff99'><$CALC_COMMA %2 <$MACRO buffstat0 @1:522807/>/100/>%</FONT>.",
    iconSrc: "./images/Ability_52.png"
}

export const ARIA_OUTGOING_DAMAGE: BuffTemplate = {
    id: 212305,
    name: "Aria",
    description: "Outgoing Damage +<FONT COLOR='#99ff99'><$CALC %1 <$TABLE_SKILLBUFF PassiveOptionValue0 212305/>/100/>%</FONT>.",
    duration: 15,
    iconSrc: "./images/BD_Skill_01_29.png"
}

export const ARIA_HYPER_AWAKENING_DAMAGE: BuffTemplate = {
    id: 212306,
    name: "Aria",
    description: "Hyper Awakening Skill Damage +<FONT COLOR='#99ff99'><$CALC %1 <$TABLE_SKILLBUFF PassiveOptionValue0 212306 />/100 />%</FONT>.",
    duration: 20,
    iconSrc: "./images/BD_Skill_01_29.png"
}

export const INTENSE_TUNE: BuffTemplate = {
    id: 211606,
    name: "Intense Tune",
    description: "Atk. Power +<FONT COLOR='#99ff99'><$CALC %1 <$TABLE_SKILLBUFF ValueA 211606/>/100 />%</FONT> of the caster's Basic Atk. Power, raising overall Atk. Power by <FONT COLOR='#99ff99'><$CALC %1 <$MACRO buffstat0_100 @1:211606/>/>%</FONT>.",
    duration: 8,
    iconSrc: "./images/Buff_15.png"
}

export const HEAVENLY_TUNE: BuffTemplate = {
    id: 211601,
    name: "Heavenly Tune",
    description: "Atk. Speed +<FONT COLOR='#99ff99'><$CALC %1 <$TABLE_SKILLBUFF PassiveOptionValue0 211601 1/>/100/>%</FONT>. Resting MP Recovery +<FONT COLOR='#99ff99'><$CALC %1 (<$TABLE_SKILLBUFF PassiveOptionValue1 211601 1/>/100)/>%</FONT>. Combat MP Recovery +<FONT COLOR='#99ff99'><$CALC %1 (<$TABLE_SKILLBUFF PassiveOptionValue2 211601 1/>/100)/>%</FONT>.",
    duration: 8,
    iconSrc: "./images/BD_Skill_01_12.png"
}

export const SERENADE_OF_COURAGE: BuffTemplate = {
    id: 211401,
    name: "Serenade of Courage",
    description: "Damage to foes +<FONT COLOR='#99ff99'>15%</FONT>.",
    duration: 16,
    iconSrc: "./images/BD_Skill_01_19.png"
}

export const MELODY_INCREASE: BuffTemplate = {
    id: 211806,
    name: "Melody Increase",
    description: "Fills the Serenade Meter by <FONT COLOR='#99ff99'>1%</FONT> every <FONT COLOR='#ffff99'>1s</FONT>.",
    iconSrc: "./images/BD_Skill_01_18.png"
}