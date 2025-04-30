import { ARIA_HYPER_AWAKENING_DAMAGE, ARIA_OUTGOING_DAMAGE, COMBAT_BLESSING, CONCENTRATE, DANCE_OF_PASSION, HEAVENLY_TUNE, IMPROVED_SWIFTNESS, INSIGHT, INTENSE_TUNE, LUMINARY, MAGICK_STREAM, MELODY_INCREASE, SERENADE_OF_COURAGE, STANDING_STRIKE, VITALITY_TRAINING } from "./buffs";
import type { Buff, BuffTemplate, BuffWithDuration } from "./types";
import { toBuff, updateDynamicOrders } from "./utils";

export function simulate(buffs: Buff[], handler: (buffs: Buff[]) => void) {

    let needsSort = false;

    if(!buffs.length) {
        buffs.push(toBuff(VITALITY_TRAINING), toBuff(IMPROVED_SWIFTNESS));
        needsSort = true;
    }

    for(const buff of buffs) {
        if (buff.kind === "expiring" && buff.remainingTime > 0) {
            buff.remainingTime = buff.remainingTime - 1;
        }
    }

    needsSort = needsSort || refreshHarpOfRhytm(buffs);
    needsSort = needsSort || toggleStandingStrike(buffs);
    needsSort = needsSort || applyAria(buffs);
    needsSort = needsSort || applySerenadeOfCourage(buffs);
    needsSort = needsSort || refreshGearBuffs(buffs);
    needsSort = needsSort || applyHeavenlyTune(buffs);
    needsSort = needsSort || applyMagickStream(buffs);
    needsSort = needsSort || applyLuminary(buffs);

    if(needsSort) {
        updateDynamicOrders(buffs);
        buffs.sort((a, b) => a.order - b.order);
    }

    handler(buffs);

    setTimeout(simulate.bind(null, buffs, handler), 1000);
}

const refreshHarpOfRhytm = setup(MELODY_INCREASE, 5);
const applySerenadeOfCourage = setup(SERENADE_OF_COURAGE, 20);
const toggleStandingStrike = setup(STANDING_STRIKE, 5);

function setup(buffTemplate: BuffTemplate, cooldown: number) {
    const context = {
        cooldown: 0
    };

    return (buffs: Buff[]) => {
        let needsSort = false;
        let buff = buffs.find(pr => pr.id === buffTemplate.id) as BuffWithDuration | undefined;
        
        if(buff) {
            if(!context.cooldown) {
                const index = buffs.findIndex(pr => pr.id === buffTemplate.id);
                buffs.splice(index, 1);
            }
        }
        else {
            buffs.push(toBuff(buffTemplate));
            context.cooldown = buffTemplate.duration || cooldown;
            needsSort = true;
            return needsSort;
        }
        
        context.cooldown--;
        return needsSort;
    }
}

const luminaryContext = {
    cooldown: 0,
    secondBuffAfter: 5
};

export function applyLuminary(buffs: Buff[]): boolean {
    let context = luminaryContext;
    let firstBuff = buffs.find(pr => pr.id === INSIGHT.id) as BuffWithDuration | undefined;
    let secondBuff = buffs.find(pr => pr.id === LUMINARY.id) as BuffWithDuration | undefined;
    let needsSort = false;

    if(firstBuff && secondBuff && firstBuff.remainingTime < 2) {
        firstBuff.remainingTime = firstBuff.duration;
        return needsSort;
    }

    if(firstBuff && !secondBuff && !context.secondBuffAfter) {
        buffs.push(toBuff(LUMINARY));
        needsSort = true;
        return needsSort;
    }

    if(!firstBuff) {
        buffs.push(toBuff(INSIGHT));
        needsSort = true;
        return needsSort;
    }

    context.secondBuffAfter--;
    return needsSort;
}

const magickStreamContext = {
    cooldown: 0,
    secondBuffAfter: 5
};

export function applyMagickStream(buffs: Buff[]): boolean {
    let context = magickStreamContext;
    let firstBuff = buffs.find(pr => pr.id === MAGICK_STREAM.id) as BuffWithDuration | undefined;
    let secondBuff = buffs.find(pr => pr.id === CONCENTRATE.id) as BuffWithDuration | undefined;
    let needsSort = false;

    if(firstBuff && secondBuff && firstBuff.remainingTime < 5) {
        firstBuff.remainingTime = firstBuff.duration;
        return needsSort;
    }

    if(firstBuff && !secondBuff && !context.secondBuffAfter) {
        buffs.push(toBuff(CONCENTRATE));
        needsSort = true;
        return needsSort;
    }

    if(!firstBuff) {
        buffs.push(toBuff(MAGICK_STREAM));
        needsSort = true;
        return needsSort;
    }

    context.secondBuffAfter--;
    return needsSort;
}

const heavenlyTuneContext = {
    cooldown: 0
};

export function applyHeavenlyTune(buffs: Buff[]): boolean {
    let context = heavenlyTuneContext;
    let firstBuff = buffs.find(pr => pr.id === HEAVENLY_TUNE.id) as BuffWithDuration | undefined;
    let needsSort = false;

    if(firstBuff) {
        if(!firstBuff.remainingTime) {
            let index = buffs.findIndex(pr => pr.id === HEAVENLY_TUNE.id);
            if(index !== -1) {
                buffs.splice(index, 1);
            }
            
            index = buffs.findIndex(pr => pr.id === INTENSE_TUNE.id);
            if(index !== -1) {
                buffs.splice(index, 1);
            }
        }
    }
    else {
        if(!context.cooldown) {
            buffs.push(toBuff(HEAVENLY_TUNE), toBuff(INTENSE_TUNE));
            context.cooldown = 13;
            needsSort = true;
            return needsSort;
        }
    }

    context.cooldown--;
    return needsSort;
}

const ariaBuffContext = {
    cooldown: 0
};

export function applyAria(buffs: Buff[]): boolean {
    let context = ariaBuffContext;
    let ariaOutgoing = buffs.find(pr => pr.id === ARIA_OUTGOING_DAMAGE.id) as BuffWithDuration | undefined;
    let ariaHyper = buffs.find(pr => pr.id === ARIA_HYPER_AWAKENING_DAMAGE.id) as BuffWithDuration | undefined;
    let needsSort = false;

    if(ariaOutgoing) {
        if(!ariaOutgoing.remainingTime) {
            const index = buffs.findIndex(pr => pr.id === ARIA_OUTGOING_DAMAGE.id);
            if(index !== -1) {
                buffs.splice(index, 1);
            }
        }
    }

    if(ariaHyper) {
        if(!ariaHyper.remainingTime) {
            const index = buffs.findIndex(pr => pr.id === ARIA_HYPER_AWAKENING_DAMAGE.id);
            if(index !== -1) {
                buffs.splice(index, 1);
            }
        }
    }
    else {
        if(!context.cooldown) {
            buffs.push(toBuff(ARIA_OUTGOING_DAMAGE), toBuff(ARIA_HYPER_AWAKENING_DAMAGE));
            context.cooldown = 45;
            needsSort = true;
            return needsSort;
        }
    }

    context.cooldown--;
    return needsSort;
}

const refreshGearContext = {
    cooldown: 3
};

export function refreshGearBuffs(buffs: Buff[]): boolean {
    const context = refreshGearContext;
    let combatBlessing = buffs.find(pr => pr.id === COMBAT_BLESSING.id) as BuffWithDuration | undefined;
    let danceOfPassion = buffs.find(pr => pr.id === DANCE_OF_PASSION.id) as BuffWithDuration | undefined;
    let needsSort = false;

    if(combatBlessing) {
        if(!context.cooldown) {
            combatBlessing.remainingTime = combatBlessing.duration;
            danceOfPassion!.remainingTime = danceOfPassion!.duration;
            context.cooldown = Math.floor(Math.random() * 10) + 3;
            return needsSort;
        }
    }
    else {
        buffs.push(toBuff(COMBAT_BLESSING), toBuff(DANCE_OF_PASSION));
        needsSort = true;
    }

    context.cooldown--;
    return needsSort;
}