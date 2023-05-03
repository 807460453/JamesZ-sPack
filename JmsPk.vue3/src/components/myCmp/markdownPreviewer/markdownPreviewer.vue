<template>
    <div v-html="mdStrRef">

    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
// import mdString from "/README.md?raw";
import { markdown } from 'markdown';

const mdStrRef = ref<string | null>(null)

interface Props {
    mdString?: string | null
}

const props = defineProps<Props>()

watch(() => props.mdString, (v) => {
    if (v) {
        const mdHtmlStr = markdown.toHTML(v)
        mdStrRef.value = mdHtmlStr
    } else {
        mdStrRef.value = null
    }
}, { immediate: true })

// onMounted(() => {

//     const dom = document.getElementById('markdownContent')
//     dom && (dom.innerHTML = mdHtmlStr)
// })

</script>
    