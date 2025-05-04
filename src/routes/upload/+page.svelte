<script lang="ts">
    import type { LoaLogsEncounter, LoaLogsEntity } from "$lib/models";
    import { loadEncounters, loadEntities, readAsArrayBuffer } from "$lib/utils";
    import initSqlJs from "sql.js";

    let fileInput: HTMLInputElement | null = null;
    let file: File | null = null;

    interface State {
        encounters: LoaLogsEncounter[];
        entities: LoaLogsEntity[];
        totalEncounters: number;
        totalEntities: number;
        isEmpty: boolean;
        error: any;
    }

    const state = $state<State>({
        encounters: [],
        entities: [],
        totalEncounters: 0,
        totalEntities: 0,
        isEmpty: false,
        error: undefined
    });

    function onDrop(event: DragEvent) {
        event.preventDefault();
        if (event.dataTransfer?.files?.length) {
            file = event.dataTransfer.files[0];
            processFile(file);
        }
    }

    function onDragOver(event: DragEvent) {
        event.preventDefault();
    }

    function onFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files?.length) {
            file = target.files[0];
            processFile(file);
        }
    }

    function onClickUpload() {
        if (fileInput) {
            fileInput.click();
        }
    }

    async function processFile(selectedFile: File) {

        const arrayBuffer = await readAsArrayBuffer(selectedFile);
        const SQL = await initSqlJs();
        
        const dabatase = new SQL.Database(new Uint8Array(arrayBuffer));

        try {
            const encountersResult = dabatase.exec("SELECT * FROM encounter;");
            const entitiesResult = dabatase.exec("SELECT * FROM entity;");

            if(!encountersResult.length) {
                state.isEmpty = true;
                return;
            }

            state.encounters = loadEncounters(encountersResult);
            state.entities = loadEntities(entitiesResult);
            state.totalEncounters = state.encounters.length;
            state.totalEntities = state.entities.length;
        } catch (error) {
            state.error = error;
        }
        
    }
</script>

<div class="flex flex-col h-full justify-center items-center p-6">
    <button
        type="button"
        tabindex="0"
        aria-label="Upload a file"
        class="w-100 border-2 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer bg-gray-900 text-white hover:border-blue-500"
        onclick={onClickUpload}
        ondrop={onDrop}
        ondragover={onDragOver}
    >
        <p class="mb-2">Drag & Drop your file here</p>
        <p class="text-xs text-gray-400">or click to browse</p>

        <input
            bind:this={fileInput}
            type="file"
            class="hidden"
            onchange={onFileSelect}
        />
    </button>

    {#if state.error}
        <div class="mt-6 p-4 text-red-500 rounded-lg w-full md:w-96">
            <p class="text-lg font-bold">Error</p>
            <p>{state.error}</p>
        </div>
    {/if}

    {#if state.totalEncounters || state.totalEntities}
    <div class="mt-6 text-white">
        <h2 class="text-xl font-bold mb-2">Summary</h2>
        <p>Total Encounters: {state.totalEncounters}</p>
        <p>Total Entities: {state.totalEntities}</p>

        <h3 class="mt-4 text-lg font-semibold">First Encounter</h3>
        {#if state.encounters.length}
            <pre class="bg-gray-800 p-4 rounded">{JSON.stringify(state.encounters[0], null, 2)}</pre>
        {/if}

        <h3 class="mt-4 text-lg font-semibold">First Entity</h3>
        {#if state.entities.length}
            <pre class="bg-gray-800 p-4 rounded">{JSON.stringify(state.entities[0], null, 2)}</pre>
        {/if}
    </div>
{/if}
</div>