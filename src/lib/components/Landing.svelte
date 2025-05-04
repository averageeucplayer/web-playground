<script lang="ts">
  import { IconDeviceGamepad2, IconUpload } from '@tabler/icons-svelte';
</script>

<section class="flex justify-center items-center min-h-screen space-y-4">
    <div class="flex">
        <a class="flex flex-col justify-center items-center size-48" href="/#/simulate">
            <div class="flex flex-col justify-center items-center" >
                <IconDeviceGamepad2 class="w-24 h-24 text-gray-600" />
                <p class="mt-2 text-lg text-gray-500">Simulate Stats</p>
            </div>
        </a>
    
        <a class="flex flex-col justify-center items-center size-48" href="/#/upload">
            <div class="flex flex-col justify-center items-center" >
                <IconUpload class="w-24 h-24 text-gray-600" />
                <p class="mt-2 text-lg text-gray-500">Upload Logs</p>
            </div>
        </a>
    </div>
</section>