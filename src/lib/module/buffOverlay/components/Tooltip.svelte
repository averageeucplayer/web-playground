<script lang="ts">
    export let text: string;
</script>

<div class="absolute bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-lg z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
    {text}
</div>

<style>
    div {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
    }
</style>