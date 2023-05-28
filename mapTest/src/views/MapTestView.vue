
<template>
    <div class="map-wrapper">
        <div class="float-topleft">
            <el-input v-model="searchValue" placeholder="search empty to locate my position" size="default" clearable
                @keyup.native.enter="inputSearch" style="width: 400px;">
            </el-input>
            <el-dropdown size="small" type="primary" @command="handleCommand">
                <el-button type="" size="default">
                    recommended
                </el-button>

                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item v-for="item in recommended" :key="item.command" :command="item.command">{{
                            item.value
                        }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <el-button type="primary" size="default" @click="btnSearch">search</el-button>
            <div v-if="timeZoneInfo" class="time-zone">
                {{ timeZoneInfo.timeZoneDisplayName }} {{ timeZoneInfo.localTime }}
            </div>
            <!-- <el-button type="primary" size="default" @click="test">test</el-button> -->

        </div>
        <l-map ref="map" v-model:zoom="zoom" :center="center" :bounds="bounds">
            <!-- my marker -->
            <l-marker v-if="myMarker" :lat-lng="myMarker.markerLatLng">
                <l-icon :icon-url="myIconUrl" :icon-size="myIconSize" />
                <l-popup>
                    <div class="pop-content">
                        <MarkPopupContent :formData="myMarker" />
                    </div>
                </l-popup>
            </l-marker>

            <template v-for="mark in markers" :key="mark.id">
                <l-marker v-if="mark" :lat-lng="mark.markerLatLng">
                    <l-popup>
                        <div class="pop-content">
                            <MarkPopupContent :formData="mark" />
                        </div>
                    </l-popup>
                </l-marker>
            </template>

            <!-- <l-tile-layer url="http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg" layer-type="base"
                    name="OpenStreetMap"></l-tile-layer> -->
            <!-- <l-tile-layer :url="tileLayerUrl" layer-type="base" name="OpenStreetMap"></l-tile-layer> -->
            <l-tile-layer url="https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}&hl=en" layer-type="base"
                name="OpenStreetMap"></l-tile-layer>
            <!-- <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
                name="OpenStreetMap"></l-tile-layer> -->
        </l-map>

        <div class="float-bottomleft">
            <MarkerTable :markerData="markers" @delete="tableDelete" />
            <!-- <el-table :data="tableData" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="40" />
                <el-table-column prop="locationName" label="locationName"> </el-table-column>
                <el-table-column prop="coordinates" label="coordinates"> </el-table-column>
                <el-table-column label="Operations">
                    <template #default="{ row }">
                        <el-button link type="primary" size="small" @click="handleDelete(row)">delete</el-button>
                    </template>
                </el-table-column>
            </el-table> -->

        </div>
    </div>
</template>
<script setup lang="ts">

import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup, LIcon } from "@vue-leaflet/vue-leaflet";
import type { LatLngExpression, PointExpression } from "leaflet";

import { reactive, ref } from "vue";

import { getReq } from "@/utils/axios.util";
import { preUrl } from "@/utils/config.util";

import avatar from '@/assets/icon/avatar.svg';
import type { Mark } from "@/utils/types.util";
import MarkerTable from "@/components/maps/MarkerTable.vue";
import MarkPopupContent from "@/components/maps/MarkPopupContent.vue";


const mapTypeEnum = {
    LEAFLET: Symbol('leaflet')
}
// const markerLatLng = ref<L.LatLngExpression>([47.41322, -1.209482])
const zoom = ref(6)
const tileLayerUrl = ref('')
const searchValue = ref('')
let center = ref<PointExpression | undefined>([51.505, -0.09])
let markers = ref<Mark[]>([])
const myMarker = ref<Mark | null>(null)

const myIconUrl = ref(avatar)
const myIconSize = ref<PointExpression | undefined>([30, 30])
const bounds = ref<any>(null)
const timeZoneInfo = ref<any>(null)
const recommended = ref<any[]>([
    { value: '4100 Paradise Rd, Las Vegas', command: 1 },
    { value: '40 Bay Street, Toronto Ontario M5j 2n8', command: 2 },
    { value: `St Mary's Road, Sydney New South Wales 2000`, command: 3 },
    { value: '4 Choume Shibakouen, Minato Ward, Toukyou 105-0011', command: 4 },
])

function initMap_leaflet() {
    // console.log(ref(LMap));

    // console.log(LMap);
    // console.log(LTileLayer);

    // const map = LMap.map('map').setView([51.505, -0.09], 13);
}

function initMap(type: symbol) {
    let fnName = null
    switch (type) {
        case mapTypeEnum.LEAFLET:
            fnName = initMap_leaflet
            break;

        default:
            break;
    }
    fnName && fnName()
}

function inputSearch() {
    searchLocation(searchValue.value)
}
function btnSearch() {
    searchLocation()
}

function formatMarkers(res_mapSearch: any) {
    const resourceSets = res_mapSearch.resourceSets
    const fstSet = resourceSets[0]
    const resources = fstSet.resources
    const total = fstSet.estimatedTotal
    markers.value = resources.map((rs: any, i: number) => {
        const coordinates = rs.point.coordinates
        return {
            id: coordinates.join() + '_' + i,
            markerLatLng: coordinates,
            locationName: rs.name
        }
    })
    return markers.value
}

// function formatTableData(markers: Mark[]) {
//     tableData.value = markers.map(m => {
//         return {
//             id: `tableId_${m.id}`,
//             markerId: m.id,
//             locationName: m.locationName,
//             coordinates: m.markerLatLng
//         }
//     })
// }

function fitBounds(markers: Mark[]) {
    bounds.value = markers.map(m => m.markerLatLng)
}

async function searchLocation(lc?: string) {
    try {
        const sv = lc ?? searchValue.value
        const res_key = await getReq(preUrl + '/getKey', 'get', { auth: 'James_here_give_me_the_key' })
        if (sv) {
            // const res_mapSearch = await getReq(`https://dev.virtualearth.net/REST/v1/Locations/CA?locality=${sv}&key=${res_key}`)
            // const res_mapSearch = await getReq(`http://dev.virtualearth.net/REST/v1/Locations?query={accuenergy}&key=${res_key}`)
            //             const res_mapSearch = await getReq(`http://spatial.virtualearth.net/REST/v1/data/accessId/dataSourceName  
            // /entityTypeName?key=${res_key}`)
            const res_mapSearch = await getReq(`http://dev.virtualearth.net/REST/v1/Locations/${sv}?maxResults=10&key=${res_key}`)
            // const res_mapSearch = await getReq(`https://dev.virtualearth.net/REST/v1/Locations/CA?locality=${sv}&key=${res_key}`)
            tileLayerUrl.value = `http://dev.virtualearth.net/REST/V1/Imagery/Metadata/RoadOnDemand?output=json&include=ImageryProviders&key=${res_key}`
            const markers = formatMarkers(res_mapSearch)
            // formatTableData(markers)
            fitBounds(markers)
            timeZone(sv, res_key)
            // resourceSets[0].resources
            // estimatedTotal
        } else {
            myLocation((position: any) => {
                const [lat, lon] = [position?.coords?.latitude, position?.coords?.longitude]
                if (lat && lon) {
                    const latlon: [number, number] = [lat, lon]
                    center && (center.value = latlon)
                    myMarker.value = {
                        id: 'myMarkId' + latlon.join(),
                        markerLatLng: latlon
                    }
                    timeZone(latlon, res_key)
                }
            })
        }
    } catch (e: any) {
        new Error(e)
    }
    // getReq('1','get')

}

function myLocation(cb: Function) {
    navigator.geolocation.getCurrentPosition(function (position) {
        // position.coords.latitude,
        // position.coords.longitude
        cb && cb(position)
    });
}

async function timeZone(query: string | number[], res_key: any) {
    const baseUrl = `http://dev.virtualearth.net/REST/v1/TimeZone/`
    let url = baseUrl
    if (Array.isArray(query)) {
        url += query.join() + '?'
    } else {
        url += `?query=${query}`
    }
    url += `&key=${res_key}`
    const res_timezone: any = await getReq(url)

    const resources = res_timezone?.resourceSets?.[0]?.resources
    const fstTimeZone = resources[0]
    let convertedTime
    if (fstTimeZone?.timeZone) {
        convertedTime = fstTimeZone?.timeZone?.convertedTime
    } else if (fstTimeZone?.timeZoneAtLocation) {
        convertedTime = fstTimeZone.timeZoneAtLocation[0]?.timeZone?.[0].convertedTime
    }
    convertedTime && (timeZoneInfo.value = convertedTime)

    // https://dev.virtualearth.net/REST/v1/TimeZone/?query={query}&datetime={datetime_utc}&key={BingMapsKey}
    // https://dev.virtualearth.net/REST/v1/TimeZone/{point}?datetime={datetime_utc}&key={BingMapsKey}
}

function test() {
    bounds.value = [[37.25466919, -119.61727905], [-34.60756683, -58.43708801]]
}

function delMarker(id: string) {
    const mkIdx = markers.value.findIndex(m => m.id === id)
    if (mkIdx !== -1) {
        markers.value.splice(mkIdx, 1)
        // markers = markers.value.slice()
    }

    // mkIdx !== -1 && markers.splice(mkIdx, 1)
}

function tableDelete(idArr: any[]) {
    if (idArr?.length) {
        idArr.forEach(id => {
            delMarker(id)
        });
    }
}

function handleCommand(v: number) {
    const it = recommended.value.find(item => item.command === v)
    if (it) {
        searchValue.value = it.value
        inputSearch()
    }
}

initMap(mapTypeEnum.LEAFLET)
// searchLocation('accuenergy')

</script>
<style scoped>
.map-wrapper,
#map {
    width: 100%;
    height: 100%;
}

.float-topleft {
    position: fixed;
    top: 10px;
    left: 60px;
    z-index: 1000;
    display: flex;
}

.float-bottomleft {
    position: fixed;
    bottom: 10px;
    left: 10px;
    z-index: 1000;
    width: 600px;
    box-shadow: 3px 3px 5px #cfe3ed;
    max-height: 300px;
    overflow-y: auto;
}

.time-zone {
    background: white;
    line-height: 2;
    padding: 0 5px;
}
.pop-content {
    padding: 10px;
    width: 300px;
}
</style>

