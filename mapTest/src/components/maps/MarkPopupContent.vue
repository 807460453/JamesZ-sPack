<template>
    <div class="">
        <el-form :model="form" label-width="80px" :inline="false" size="default">
            <el-form-item label="markerLatLng">
                {{ form.markerLatLng }}
                <!-- <el-input v-model="form.markerLatLng"></el-input> -->
            </el-form-item>
            <el-form-item label="locationName">
                {{ form.locationName }}
                <!-- <el-input v-model="form.locationName"></el-input> -->
            </el-form-item>
            <!-- <el-form-item>
                <el-button type="primary" @click="addToList">addToList</el-button>
                <el-button>cancel</el-button>
            </el-form-item> -->
        </el-form>

    </div>
</template>
<script setup lang="ts">
import { reactive, ref, toRef, watch } from 'vue';
// import type { Mark } from "@/utils/types.util";

const props = defineProps<{
    formData?: any
}>()
const fData = toRef(props, 'formData')
const form = reactive<any>({
    id: null,
    markerLatLng: null,
    locationName: null
})

watch(fData, function (v) {
    formatData(v)
}, { immediate: true })

function formatData(data: any) {
    if (data) {
        form.id = data.id
        form.markerLatLng = data.markerLatLng.join()
        form.locationName = data.locationName
    } else {
        form.id = null
        form.markerLatLng = null
        form.locationName = null
    }

}

function addToList() {

}
</script>
<style scoped>
.pop-content {
    padding: 10px;
    width: 200px;
}
</style>
  