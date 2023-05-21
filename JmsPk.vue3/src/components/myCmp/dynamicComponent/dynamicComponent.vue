
<!-- <script>
export default {
    name: 'DynamicComponent'
}
</script> -->

<script lang="tsx">
import { h, ref, resolveComponent } from 'vue';
import type { CmpData } from './dynamicComponentPageTypes';
import dynamicComponent from "./dynamicComponent.vue";

export default {
    props: {
        modelValue: null,

        is: {
            required: true,
            type: [String, Object],
            default: () => null
        },
        tagType: {
            required: true,
            type: String,
            default: null
        },
        attrs: {
            type: Object,
            default: () => null
        },
        slots: {
            type: Object,
            default: () => null
        },
    },

    setup(props: any, { slots, emit }) {
        // emit(['update:modelValue'])

        const { is, tagType, attrs, slots: passedSlots, modelValue } = props
        const cmpValue = ref<any>(modelValue)


        function initOutTag(is: string | Record<string, any>, tagType: string) {
            let outTag: string | any
            if (tagType === 'component') {
                outTag = typeof is === 'string' ? resolveComponent(is) : is
            } else {
                outTag = is
            }
            return outTag
        }

        function createSelfCmp(slotInfo: CmpData) {
            // const model = typeof slotInfo.modelValue === 'function' ? slotInfo.modelValue() : slotInfo.modelValue

            let model: any
            let modelRef: any
            let prop: string
            if (typeof slotInfo.modelValue === 'function') {
                const arr = slotInfo.modelValue()
                modelRef = arr[0]
                prop = arr[1]
                model = modelRef[prop]
            } else {
                model = slotInfo.modelValue
            }
            const modelObj = {
                modelValue: model,
                // modelValue: slotInfo.modelValue,
                // 'onUpdate:modelValue': (value: any) => emit('update:modelValue', value)
                'onUpdate:modelValue': (value: any) => {
                    if (typeof slotInfo.modelValue === 'function') {
                        modelRef[prop] = value
                        // modelRef.value = value
                    } else {
                        slotInfo.modelValue = value
                    }

                }
            }
            const propObj = Object.assign({}, slotInfo, modelObj)
            return h(dynamicComponent, propObj)
            // return h(dynamicComponent, slotInfo)
        }

        function getSlots(passedSlots: any) {
            const slotsObj: any = {}
            if (passedSlots) {
                for (const key in passedSlots) {
                    if (Object.prototype.hasOwnProperty.call(passedSlots, key)) {
                        const slotDataArr = passedSlots[key];
                        const arr: any[] = []
                        slotDataArr.forEach((slotInfo: CmpData) => {
                            arr.push(createSelfCmp(slotInfo))
                        });
                        slotsObj[key] = () => arr
                    }
                }
            }
            return slotsObj
        }



        function render() {
            let outTag: string | any = initOutTag(is, tagType)
            const model = typeof props.modelValue === 'function' ? props.modelValue() : props.modelValue
            const modelObj = {
                modelValue: model,
                'onUpdate:modelValue': (value: any) => emit('update:modelValue', value)
            }
            // const modelObj = {
            //     modelValue: cmpValue.value,
            //     'onUpdate:modelValue': (value: any) => {
            //         cmpValue.value = value
            //         emit('update:modelValue', value)
            //     }
            // }
            return h(outTag, Object.assign({}, attrs, modelObj), getSlots(passedSlots))
        }

        return () => render()
    }
}
</script>


    