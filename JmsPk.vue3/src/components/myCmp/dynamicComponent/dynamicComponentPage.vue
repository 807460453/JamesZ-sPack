<template>
    <el-tabs v-model="activeTab" type="card" tab-position="top" @tab-click="">
        <el-tab-pane label="demonstration" name="demo">
            <div style="width:500px">
                <!-- <DynamicComponent :is="elInput" /> -->
                <div class="cmpBar" v-for="cmp in cmps">
                    <!-- <span>{{ cmp.is }}</span> -->
                    <DynamicComponent :is="cmp.is" :tagType="cmp.tagType" v-model="formData.testField1" :slots="cmp.slots"
                        :attrs="cmp.attrs" style="width: 200px;" />
                </div>
                <!-- <el-button type="primary" size="default" @click="test">test</el-button>
                {{ formData.testField1 }}
                {{ formData.testField2 }} -->
            </div>
        </el-tab-pane>
        <el-tab-pane label="md" name="md">
            <MarkdownPreviewer :mdString="mdString" />
        </el-tab-pane>
    </el-tabs>
</template>
<script setup lang="ts">
import { ref, resolveComponent, reactive } from 'vue';
import MarkdownPreviewer from "@/components/myCmp/markdownPreviewer/markdownPreviewer.vue";
import DynamicComponent from "./dynamicComponent.vue";
import type { Attrs, CmpData } from './dynamicComponentPageTypes';



// import DynamicForm from "./dynamicForm.vue";
const activeTab = ref('demo')
const cmps = ref<CmpData[] | null>(null)
const mdString = ref<string | null>(null)

const formData = reactive<any>({
    testField1: 1,
    testField2: 2,
    testField3: 3,
    testField4: 4,
    // testField1: ref(1)
})


function test() {
    formData.testField1 = 33
}

function initMdString() {
    const proStr = import('./dynamicComponent.md?raw')
    proStr.then(_module => {
        mdString.value = _module.default
    })

}

function createInnerModel(refObj: any, propName: string) {
    return () => [refObj, propName]
}

function initCmps() {
    cmps.value = [
        {
            is: 'el-input', tagType: 'component', modelValue: formData.testField1
        },
        {
            is: 'el-select', tagType: 'component', modelValue: formData.testField2,
            slots: {
                default: [
                    { is: 'el-option', tagType: 'component', attrs: { key: 1, label: '1', value: '1' } },
                    { is: 'el-option', tagType: 'component', attrs: { key: 2, label: '2', value: '2' } },
                ]
            }
        },
        {
            is: 'el-form', tagType: 'component', attrs: { model: formData.value },
            slots: {
                default: [
                    {
                        is: 'el-form-item', tagType: 'component', attrs: { label: 'test' },
                        slots: {
                            default: [
                                {
                                    is: 'el-input', tagType: 'component', modelValue: createInnerModel(formData, 'testField3')
                                }
                            ]
                        }
                    },
                    {
                        is: 'el-form-item', tagType: 'component', attrs: { label: 'test' },
                        slots: {
                            default: [
                                {
                                    is: 'el-select', tagType: 'component', modelValue: createInnerModel(formData, 'testField4'),
                                    slots: {
                                        default: [
                                            { is: 'el-option', tagType: 'component', attrs: { key: 1, label: 'option1 in formitem', value: '1' } },
                                            { is: 'el-option', tagType: 'component', attrs: { key: 2, label: 'option2 in formitem', value: '2' } },
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}
// const elInput = resolveComponent('el-input')
initMdString()
initCmps()

</script>
<style lang="css" scoped>
.cmpBar {
    display: flex;
}
</style>
    