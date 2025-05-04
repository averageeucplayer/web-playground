import initSqlJs from "sql.js";
import type { Comparison, LoaLogsEncounter, LoaLogsEntity, Player, SkillComparison } from "./models";

export function randomAZString(length: number): string {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const first = letters[Math.floor(Math.random() * letters.length)].toUpperCase();
    let rest = '';
    for (let i = 0; i < length; i++) {
        rest += letters[Math.floor(Math.random() * letters.length)];
    }
    return first + rest;
}

function randomU32(): number {
    return Math.floor(Math.random() * 0x100000000);
}

export function randomU64(): bigint {
    const hi = BigInt(Math.floor(Math.random() * 0x100000000));
    const lo = BigInt(Math.floor(Math.random() * 0x100000000));
    return (hi << 32n) | lo;
}

export function formatCompactNumber(num: number): string {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "b";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "m";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "k";
    return num.toString();
}

export function formatDecimal(value: number): string {
    return value.toFixed(1);
}

export function formatPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
}

export function randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export async function exportToEncountersDb(comparison: Comparison) {
    const SQL = await initSqlJs();
    const db = new SQL.Database();

    db.run(`
        CREATE TABLE encounter (
            id INTEGER PRIMARY KEY,
            last_combat_packet INTEGER,
            total_damage_dealt INTEGER,
            top_damage_dealt INTEGER,
            total_damage_taken INTEGER,
            top_damage_taken INTEGER,
            dps INTEGER,
            buffs TEXT,
            debuffs TEXT,
            total_shielding INTEGER DEFAULT 0,
            total_effective_shielding INTEGER DEFAULT 0,
            applied_shield_buffs TEXT,
            misc TEXT,
            version INTEGER NOT NULL DEFAULT 5,
            boss_hp_log BLOB,
            stagger_log TEXT
        );
    `);

    db.run(`
        CREATE TABLE entity (
            name TEXT,
            character_id INTEGER,
            encounter_id INTEGER NOT NULL,
            npc_id INTEGER,
            entity_type TEXT,
            class_id INTEGER,
            class TEXT,
            gear_score REAL,
            current_hp INTEGER,
            max_hp INTEGER,
            is_dead INTEGER,
            skills TEXT,
            damage_stats TEXT,
            dps INTEGER,
            skill_stats TEXT,
            last_update INTEGER,
            engravings TEXT,
            gear_hash TEXT,
            spec TEXT,
            ark_passive_active BOOLEAN,
            ark_passive_data TEXT,
            PRIMARY KEY (name, encounter_id),
            FOREIGN KEY (encounter_id) REFERENCES encounter (id) ON DELETE CASCADE
        );
    `);

    let encounterId1 = randomU32();

    db.run(
        `INSERT INTO encounter VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            encounterId1,
            new Date(comparison.createdOn).getTime(),
            comparison.player1.stats.totalDamage.raw,
            comparison.player1.stats.topDamageSkill.raw,
            0,
            0,
            comparison.player1.stats.dps.raw,
            "[]",
            "[]",
            0,
            0,
            "[]", 
            "{}",
            5, 
            new Uint8Array(),
            "",
        ]
    );

    let encounterId2 = randomU32();

    db.run(
        `INSERT INTO encounter VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            encounterId2,
            new Date(comparison.createdOn).getTime(),
            comparison.player2.stats.totalDamage.raw,
            comparison.player2.stats.topDamageSkill.raw,
            0,
            0,
            comparison.player2.stats.dps.raw,
            "[]",
            "[]",
            0,
            0,
            "[]", 
            "{}",
            5, 
            new Uint8Array(),
            "",
        ]
    );

    db.run(
        `INSERT INTO entity VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            comparison.player1.name,
            randomU32(),
            encounterId1,
            0,
            "Player",
            comparison.player1.classId,
            comparison.player1.className,
            0,
            1,
            1,
            0,
            JSON.stringify(comparison.player1.skills),
            JSON.stringify(comparison.player1.stats),
            Math.floor(comparison.player1.stats.dps.raw),
            JSON.stringify(comparison.player1.skills.map(s => s.stats)),
            Date.now(),
            "[]",
            "0x00",
            comparison.player1.specialisation,
            0,
            "{}",
        ]
    );

    db.run(
        `INSERT INTO entity VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            comparison.player1.name,
            randomU32(),
            encounterId2,
            0,
            "Player",
            comparison.player1.classId,
            comparison.player1.className,
            0,
            1,
            1,
            0,
            JSON.stringify(comparison.player1.skills),
            JSON.stringify(comparison.player1.stats),
            Math.floor(comparison.player1.stats.dps.raw),
            JSON.stringify(comparison.player1.skills.map(s => s.stats)),
            Date.now(),
            "[]",
            "0x00",
            comparison.player1.specialisation,
            0,
            "{}",
        ]
    );

    const timestamp = Date.now();  
    const binaryArray = db.export();
    const blob = new Blob([binaryArray], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `encounter-${timestamp}.db`;
    a.click();
    URL.revokeObjectURL(url);
}

export function loadEncounters(encountersResult: initSqlJs.QueryExecResult[]): LoaLogsEncounter[] {
    const encounters = [];

    for(const row of encountersResult[0].values) {
        const encounter: LoaLogsEncounter = {
                id: row[0] as any,
                lastCombatPacket: row[1] as any,
                totalDamageDealt: row[2] as any,
                topDamageDealt: row[3] as any,
                totalTamageTaken: row[4] as any,
                topDamageTaken: row[5] as any,
                dps: row[6] as any,
                buffs: row[7] as any,
                debuffs: row[8] as any,
                totalShielding: row[9] as any,
                totalEffectiveShielding: row[10] as any,
                appliedShieldBuffs: row[11] as any,
                misc: row[12] as any,
                version: row[13] as any,
                bossHpLog: row[14] as any,
                staggerLog: row[15] as any,
            }
    
            encounters.push(encounter);
    }

    return encounters;
}

export function loadEntities(entitiesResult: initSqlJs.QueryExecResult[]): LoaLogsEntity[] {
    const entities = [];

    for(const row of entitiesResult[0].values) {
        const entity: LoaLogsEntity = {
                name: row[0] as any,
                characterId: row[1] as any,
                encounterId: row[2] as any,
                npcId: row[3] as any,
                entityType: row[4] as any,
                classId: row[5] as any,
                className: row[6] as any,
                gearScore: row[7] as any,
                currentHp: row[8] as any,
                maxHp: row[9] as any,
                isDead: row[10] as any,
                skills: row[11] as any,
                damageStats: row[12] as any,
                dps: row[13] as any,
                skillStats: row[13] as any,
                lastUpdate: row[14] as any,
                engravings: row[15] as any,
                gearHash: row[16] as any,
                spec: row[17] as any,
                isArkPassiveActive: row[18] as any,
                arkPassiveData: row[19] as any,
            };
    
        entities.push(entity);
    }
    
    return entities;
}

export const readAsArrayBuffer = (file: File) => new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
        const target = event.target;

        if(!target || !target.result) {
            reject();
            return;
        }

        if (target.result instanceof ArrayBuffer) {
            resolve(target.result);
        } else {
            reject('Result is not an ArrayBuffer');
        }
    };
    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
});

// export function buildComparisonRows(p1: Player, p2: Player): SkillComparison[] {
//     const names = Array.from(new Set([
//         ...p1.skills.map(s => s.name),
//         ...p2.skills.map(s => s.name)
//     ])).sort();

//     const result = names.map(name => {
//         const skill1 = p1.skills.find(s => s.name === name);
//         const skill2 = p2.skills.find(s => s.name === name);
//         const icon = skill1?.iconSrc || skill2?.iconSrc || "";

//         return {
//             name,
//             icon,
//             skill1,
//             skill2
//         };
//     });

//     result.sort((a, b) => {
//         const damageA = Math.max(
//             a.skill1?.totalDamage.raw || 0,
//             a.skill2?.totalDamage.raw || 0
//         );
//         const damageB = Math.max(
//             b.skill1?.totalDamage.raw || 0,
//             b.skill2?.totalDamage.raw || 0
//         );
//         return damageB - damageA; // descending
//     });

//     return result;
// }
