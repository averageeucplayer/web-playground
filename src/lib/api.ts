import type { AppState, Comparison, Player, SimulationConfig } from "./models";
import { simulateRaid } from "$lib/simulator";
import { allPresets } from "./simulator/classPreset";
import { randomAZString, randomInRange } from "./utils";
import { v7 as v7uuid } from 'uuid';

const map: Record<string, Promise<Comparison> | null> = {};
let globalAppState: AppState = getAppState();

export function defaultConfig(): SimulationConfig {
    const config: SimulationConfig = {
        name: randomAZString(10),
        className: allPresets[0].className,
        classPreset: allPresets[0],
        attackPower: randomInRange(7.5e4, 1e5),
        criticalDamage: 1.5,
        totalDamageDealt: randomInRange(9e10, 2e11),
        critRate: randomInRange(0.75, 0.9),
        backAttacks: 0.75,
        durationSeconds: randomInRange(600, 900),
        brandDebuffChance: randomInRange(0.5, 0.9),
        attackPowerBuffChance: randomInRange(0.5, 0.9),
        identityBuffChance: 0.5,
        hatBuffChance: 0.3
    };

    return config;
}

function defaultAppState(): AppState {
    const id = v7uuid();
    const createdOn = new Date().toISOString();

    return {
        id,
        createdOn,
        updatedOn: createdOn,
        comparisons: []
    }
}

function getAppState(): AppState {
    const appStateStr = localStorage.getItem("appState");
    let appState = JSON.parse(appStateStr!) || defaultAppState();
    return appState;
}

function saveAppState(appState: AppState)  {
    appState.updatedOn = new Date().toISOString();
    globalAppState = appState;
    localStorage.setItem("appState", JSON.stringify(appState));
}

export function saveComparison(comparison: Comparison) {
    let appState = getAppState();
    // appState.comparisons.push(comparison);
    saveAppState(appState);
}

export function getLastHashParam(url: URL): string | null {
    const hash = url.hash;
    const segments = hash.split('/').filter(Boolean);
    const last = segments[segments.length - 1];
    return last || null;
}

export async function getComparison(id: string): Promise<Comparison | null> {

    const queueItem = map[id];

    if(queueItem) {
        const comparison = await queueItem;
        return comparison;
    }

    const appState = getAppState();

    const comparison = appState.comparisons.find(pr => pr.id === id) || null;

    return comparison;
}

export function createComparison(configs: SimulationConfig[]): string {
    const id = v7uuid();

    const queueItem = new Promise<Comparison>((resolve) => {
        const createdOn = new Date().toISOString();
        const player1 = simulateRaid(configs[0]);
        const player2 = simulateRaid(configs[1]);
        
        const comparison: Comparison = {
            id,
            createdOn,
            player1,
            player2
        };

        saveComparison(comparison);
        resolve(comparison);
    })

    map[id] = queueItem;
   
    return id;
}

// export function load(): SimulationResult {
     
//     const player1Config: SimulationConfig = {
//         name: "Player1",
//         attackPower: 100000,
//         criticalDamage: 1.5,
//         totalDamageDealt: 3.34e10,
//         critRate: 0.75,
//         backAttacks: 0.75,
//         durationSeconds: Math.floor(Math.random() * (15 * 60 - 10 * 60)) + 10 * 60,
//         brandDebuffChance: 0.1,
//         attackPowerBuffChance: 0.1,
//         identityBuffChance: 0.1,
//         hatBuffChance: 0.1
//     };

//     const player2Config: SimulationConfig = {
//         name: "Player2",
//         attackPower: 100000,
//         criticalDamage: 1.75,
//         totalDamageDealt: 3.34e10,
//         critRate: 0.8,
//         backAttacks: 0.75,
//         durationSeconds: Math.floor(Math.random() * (15 * 60 - 10 * 60)) + 10 * 60,
//         brandDebuffChance: 0.1,
//         attackPowerBuffChance: 0.1,
//         identityBuffChance: 0.1,
//         hatBuffChance: 0.1
//     };

//     const player1Summary = simulateRaid(player1Config);
//     const player2Summary = simulateRaid(player2Config);
    
//     return {
//         players: [player1Summary, player2Summary],
//     };
// }