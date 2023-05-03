<template>
    <el-tabs v-model="activeTab" type="card" tab-position="top" @tab-click="">
        <el-tab-pane label="demonstration" name="demo">
            <div style="width:500px">
                todo:dynamicTable
            </div>
        </el-tab-pane>
        <el-tab-pane label="md" name="md">
            <MarkdownPreviewer />
        </el-tab-pane>
    </el-tabs>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import MarkdownPreviewer from "@/components/myCmp/markdownPreviewer/markdownPreviewer.vue";
// import DynamicForm from "./dynamicForm.vue";
const activeTab = ref('demo')
const cmp_dynamicForm = ref<any>(null)
// const cmp_dynamicForm = ref<InstanceType<typeof DynamicForm> | null>(null)
const items = ref<any[]>([])
const defaultData = ref<any>({})
const defaultRules = ref<any>({})

const ctx = {
    items,
    defaultData
}

function initCmps() {
    items.value = [
        {
            key: "f1",
            prop: "f1",
            label: "field1",
            cmp: { type: "el-input", attrs: { placeholder: "type 1 and see what happens" } },
        },
        // { key: 'f2', prop: 'f2', label: 'field2',
        //   cmp: {
        //     type: 'self-define-cmp',
        //     attrs: { mode: 'ddd' },
        //     events: {
        //       onChange: function(...args) {
        //         console.log(self)
        //         console.log(this)
        //         console.log(...args)
        //       }
        //     }
        //   }
        // },
        {
            key: "f3",
            prop: "f3",
            label: "field3",
            cmp: {
                type: "el-checkbox-group",
                subComps: [{ key: 1, label: "1", content: "check console when changes" }],
                events: {
                    onChange: function (...args: any[]) {
                        console.log('the caller has been rebinded, so that you can get things form child cmp:', this);
                        console.log(...args);
                    },
                },
            },
        },
        {
            key: "f4",
            prop: "f4",
            label: "field4",
            cmp: {
                type: "el-date-picker",
                attrs: { "value-format": "YYYY-MM-DD", placeholder: 'log when change' },
                events: {
                    onChange: function (...args: any[]) {
                        console.log(this);
                        console.log(...args);
                    },
                },
            },
            before: {
                content: `<div><p style="color:red; position:absolute; margin:-20px 0 0 150px;">use 'before prop' to add content before this item</p></div>`,
            },
            after: {
                slotName: "after_f4_slot",
            },
        },
        {
            key: "f5",
            prop: "f5",
            label: "field5",
            cmp: {
                type: "el-input",
                attrs: { placeholder: "when focused,it changes the value of f1" },
                events: {
                    onFocus: function (this: any, ...args: any[]) {
                        if (!this.form.f1) {
                            this.form.value.f1 = "f5_focus_trigger_input";
                        }
                    },
                },
            },
        },
        {
            key: "f6",
            prop: "f6",
            label: "field6",
            cmp: {
                type: "el-input",
                attrs: { placeholder: "when focused, it log the content in this cmp" },
                events: {
                    onFocus: function (...args: any[]) {
                        console.log(ctx);
                    },
                },
            },
        },
        {
            key: "f7",
            prop: "f7",
            label: "field7",
            vIf: function (form: any, ctx: any) {
                return form.value.f1 === "1";
            },
            cmp: {
                type: "slot",
                slotName: "f7_slot",
            },
        },
        {
            key: "f8",
            prop: "f8",
            label: "field8",
            layout: {
                group: {
                    key: 1,
                    vIf: function (form: any, ctx: any) {
                        return form.value.f1;
                    },
                    // vShow: function(form, ctx) {
                    //   return form.projectNumber
                    // }
                },
                props: { xl: 12, md: 12, sm: 24 },
            },
            cmp: {
                type: "el-radio-group",
                subComps: [
                    { key: 1, label: "1", content: "111radio" },
                    { key: 2, label: "2", content: "222radio" },
                ],
            },
        },
    ]
}
function initFormDefaultData() {
    defaultData.value = {
        f1: null,
        f2: null,
        f3: [],
        f4: null,
        f5: null,
        f6: null,
        f7: null,
        f8: null,
    };
}

function initRules() {
    defaultRules.value = {
        f1: [
            {
                required: true,
                message: `input`,
            },
            {
                required: true,
                validator: function (rule: any, value: any, callback: (p?: any) => any) {
                    console.log(this);
                    console.log(ctx);
                    if (value !== "1") {
                        callback("it shows when f1 is not 1, it also means validator works");
                    } else {
                        callback();
                    }
                },
            },
        ],
    };
}

function textBtnClick(context: any) {
    context.handleForm((form: any, ctx: any) => {
        console.log(form, ctx);
        form.value.f1 = "2";
    });
}

function getFormData() {
    const data = cmp_dynamicForm.value?.getFormData()
    console.log(data);

}

initCmps()
initFormDefaultData()
initRules()

</script>
    