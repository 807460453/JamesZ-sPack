
<template>
    <div class="table-wrapper">
        <div class="btns">
            <el-input v-model="filterValue" placeholder="input locationName to filter" size="default" clearable
                @input="filterChange">

            </el-input>

            <el-button type="primary" size="default" @click="multiDelete">delete selection</el-button>
        </div>
        <el-table :data="tableData_filter" row-key="id" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="40" />
            <el-table-column prop="locationName" label="locationName"> </el-table-column>
            <el-table-column prop="coordinates" label="coordinates"> </el-table-column>
            <el-table-column label="oprt" width="80">
                <template #default="{ row }">
                    <el-button link type="primary" size="small" @click="handleDelete([row])">delete</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script setup lang="ts">
import { ref, toRef, watch } from 'vue';
import type { Mark } from "@/utils/types.util";
import type { LatLngExpression } from "leaflet";
interface TableRow {
    id: string,
    markerId: string,
    coordinates: LatLngExpression,
    locationName?: string
}

const props = defineProps<{
    markerData: any[]
}>()
const emit = defineEmits<{
    (e: 'delete', idArr: any[]): void
}>()




const tableData = ref<TableRow[]>([])
const tableData_filter = ref<TableRow[]>([])
const selection = ref<TableRow[]>([])
const mData = toRef(props, 'markerData')
const filterValue = ref<string>()



watch(mData, function (v) {
    formatTableData(v)
}, { immediate: true })


function formatTableData(markers: Mark[]) {
    tableData.value = markers.map(m => {
        return {
            id: `tableId_${m.id}`,
            markerId: m.id,
            locationName: m.locationName,
            coordinates: m.markerLatLng
        }
    })
    filterChange()
}


function delTableRow(id: string) {
    const tbIdx = tableData.value.findIndex(r => r.id === id)
    tbIdx !== -1 && tableData.value.splice(tbIdx, 1)
}


function handleDelete(rows: any[]) {
    const markerIdArr: any[] = []
    rows.forEach(row => {
        const id = row.id
        const markerId = row.markerId
        // const [id,markerId] = row
        if (id) delTableRow(id)
        markerIdArr.push(markerId)
    });
    if (markerIdArr?.length) emit('delete', markerIdArr)
}
function filterChange(v?: string) {
    tableData_filter.value = v ? tableData.value.filter(r => r.locationName?.includes(v)) : tableData.value
}
function multiDelete() {
    handleDelete(selection.value)
}
function handleSelectionChange(sel: TableRow[]) {
    selection.value = sel
}



</script>
<style scoped>
.table-wrapper {
    background-color: white;
}

.btns {
    display: flex;
}
</style>

