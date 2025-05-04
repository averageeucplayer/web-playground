<script lang="ts">
    interface Props { 
        showModal: boolean;
        closeModal(): void;
    }

    let {
        showModal,
        closeModal
    }: Props = $props();

    let file1 = $state<File | null>(null);
    let file2 = $state<File | null>(null);

    let fileInput1: HTMLInputElement;
    let fileInput2: HTMLInputElement;

    function handleFiles(files: FileList | null, index: number) {
        if (files && files.length > 0) {
            if (index === 1) file1 = files[0];
            else file2 = files[0];
        }
    }

    function triggerFileSelect(index: number) {
        if (index === 1) fileInput1.click();
        else fileInput2.click();
    }

    function handleDrop(event: DragEvent, index: number) {
        event.preventDefault();
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            if (index === 1) {
                file1 = files[0];
            } else {
                file2 = files[0];
            }
        }
  }

  function handleDragOver(event: DragEvent) {
      event.preventDefault();
  }

  
  </script>

{#if showModal}
  <div class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
    <div class="bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
      <button onclick={closeModal} class="absolute top-2 right-2 text-gray-400 hover:text-white text-xl">&times;</button>
      <h2 class="text-xl font-semibold mb-4">Upload Encounters</h2>

      <form class="space-y-4">
        <div
            onclick={() => triggerFileSelect(1)}
            ondrop={(e) => handleDrop(e, 1)}
            ondragover={handleDragOver}
            class="border-2 border-dashed border-gray-500 rounded p-6 text-center cursor-pointer bg-gray-700 hover:bg-gray-600 transition"
        >
            <input bind:this={fileInput1} type="file" class="hidden" onchange={(e) => handleFiles(e.target.files, 1)} />
          {#if file1}
            <p class="text-green-400 font-semibold">{file1.name}</p>
          {:else}
            <p>Drag & drop Player 1 log here</p>
          {/if}
        </div>

        <div
            role="button"
            tabindex="0"
            onclick={() => triggerFileSelect(2)}
          ondrop={(e) => handleDrop(e, 2)}
          ondragover={handleDragOver}
          class="border-2 border-dashed border-gray-500 rounded p-6 text-center cursor-pointer bg-gray-700 hover:bg-gray-600 transition"
        >
            <input bind:this={fileInput2} type="file" class="hidden" onchange={(e) => handleFiles((e.target as HTMLInputElement)?.files, 2)} />
          {#if file2}
            <p class="text-green-400 font-semibold">{file2.name}</p>
          {:else}
            <p>Drag & drop Player 2 log here</p>
          {/if}
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <button type="button" onclick={closeModal} class="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded">
            Cancel
          </button>
          <button type="submit" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
            Compare
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
