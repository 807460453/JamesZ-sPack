
<script lang="tsx">
import { nextTick, onMounted, ref, watch, h, useSlots, type Ref, resolveComponent } from 'vue';
import type { ElForm } from 'element-plus';
import type { keysOf } from 'element-plus/es/utils';
import type { CmpItem, Ctx, Events, Rule, SubCompTypes } from './dynamicFormPageTypes';
// import type { validator } from 'async-validator'


interface Props {
    items: Array<CmpItem> | null;
    defaultData: any;
    defaultRules: any;
}

export default {
    props: {
        items: {
            type: Array,
            default() {
                return null
            }
        },
        defaultData: {
            type: Object,
            default() {
                return null
            }
        },
        defaultRules: {
            type: Object,
            default() {
                return null
            }
        }
    },
    setup(props: any, context) {


        // const props = withDefaults(defineProps<Props>(), {
        //     items: null,
        //     defaultData: null,
        //     defaultRules: null
        // })

        // const props_defaultData = ref(props.defaultData)
        // const props_defaultRules = ref(props.defaultRules)

        const form: Ref<any> = ref({})
        const rules: Ref<any> = ref({})
        const subCompTypes: Ref<SubCompTypes> = ref({
            'el-select': 'el-option',
            'el-checkbox-group': 'el-checkbox',
            'el-radio-group': 'el-radio'
        })
        const modelPack: Ref<any> = ref({

        })

        const test = ref('it is a text from dynamicForm for testing scopeSlot')



        // const ctx = context.attrs
        const ctx: Ctx = {
            form,
            test,
            validate,
            getFormData,
            clearValidate,
            handleForm,
        }

        // context.expose({ ctx, getFormData })

        const slots = useSlots()

        const cmp_form = ref<InstanceType<typeof ElForm> | null>(null)

        watch(() => props.defaultData, (v) => {
            initForm()
        })
        watch(() => props.defaultRules, (v) => {
            initRule()
        })
        onMounted(() => {
            initForm()
            initRule()
        })

        context.expose(ctx)

        function validate(func: () => any) {
            cmp_form.value?.validate(func)
        }
        function getFormData() {
            return JSON.parse(JSON.stringify(form.value))
        }
        function clearValidate() {
            nextTick(() => {
                cmp_form.value?.clearValidate()
            })
        }
        function initForm() {
            if (props.defaultData.value) {
                form.value = Object.assign({}, form.value, props.defaultData)
            }
        }
        function handleForm(fn: (formData: any, ctx: any) => any) {
            fn.call(ctx, form, ctx)
        }
        function sallowCopyRule(rule: Rule) {
            if (!rule) return {}
            const copyObj: any = {}
            let key: keyof typeof rule
            for (key in rule) {
                if (Object.hasOwnProperty.call(rule, key)) {
                    const p = rule[key]
                    if (typeof (p) !== 'function') {
                        copyObj[key] = p
                    }
                }
            }
            return copyObj
        }
        function initRule() {
            if (!props.defaultRules) return
            const newRules: any = {}
            for (const key in props.defaultRules) {
                if (Object.hasOwnProperty.call(props.defaultRules, key)) {
                    const fieldRules = props.defaultRules[key]
                    newRules[key] = []
                    fieldRules.forEach((rule: Rule) => {
                        const copyRule = sallowCopyRule(rule)
                        if (rule.validator) {

                            copyRule.validator = (...args: [Rule, any, (e: any) => void]) => {
                                rule.validator?.apply(ctx, args)
                            }
                        }
                        newRules[key].push(copyRule)
                    })
                }
            }
            rules.value = newRules
        }
        function rebindEvents(eventsObj: Events) {
            const evts: Events = {}
            let evtName: keyof typeof eventsObj
            for (evtName in eventsObj) {
                if (Object.hasOwnProperty.call(eventsObj, evtName)) {
                    const evtFn = eventsObj[evtName]
                    evts[evtName] = (...args) => {
                        evtFn.apply(ctx, args)
                    }
                }
            }
            return evts
        }
        function getContentAround(hFn: typeof h, config: any) {

            let ctt
            if (config) {
                if (config.slotName) {
                    ctt = slots[config.slotName]?.({ ctx })
                } else if (config.content) {
                    if (typeof (config.content) === 'string') {
                        ctt = hFn('div', { innerHTML: config.content })
                        // ctt = hFn('div', {
                        //     domProps: {
                        //         innerHTML: config.content
                        //     }
                        // })
                    } else if (typeof (config.content) === 'object' && config.content.constructor.name === 'VNode') {
                        ctt = config.content
                    }
                }
            }
            return ctt
        }
        function checkFormItemVis(visField: boolean | ((form: any, ctx: any) => any)) {
            let res = true
            switch (typeof (visField)) {
                case 'boolean':
                    if (visField === false) {
                        res = false
                    }
                    break
                case 'function':
                    {
                        const r = visField.call(ctx, form, ctx)
                        if (r === false) {
                            res = false
                        }
                    }
                    break

                default:
                    break
            }
            return res
        }
        function getFormItem(hFn: typeof h, data: CmpItem, i: number) {
            const self = ctx
            let content: any
            const cmpValue = self.form.value[`${data.prop}`]
            const ifRes = checkFormItemVis(data.vIf)
            const showRes = checkFormItemVis(data.vShow)
            if (ifRes === false) return
            if (data.cmp) {
                const compType = data.cmp.type
                if (compType === 'slot') {
                    if (data.cmp.slotName) {
                        content = slots[data.cmp.slotName]?.({ data, index: i, ctx: self })
                    }
                } else {
                    let subComps: any[] = []
                    if (data.cmp.subComps) {
                        subComps = data.cmp.subComps.map(subC => {
                            const content = () => [subC.content]
                            return hFn(resolveComponent(subCompTypes.value[compType]), { ...subC }, content)
                        })
                    }
                    const pack = modelPack.value[compType] || { modelField: 'modelValue', modelEvtName: 'onUpdate:modelValue' }

                    pack.modelValue = cmpValue
                    const props = { ...data.cmp.attrs }
                    props[pack.modelField] = cmpValue
                    const evts: any = {}
                    evts[pack.modelEvtName] = (v: any) => {
                        form.value[`${data.prop}`] = v
                        // evts.change && evts.change.apply(ctx, v)
                    }
                    const style = data.cmp.style
                    if (showRes === false) {
                        style.display = false
                    }
                    const cls = data.cmp.cls
                    if (data.cmp.events) {
                        Object.assign(evts, rebindEvents(data.cmp.events))
                    }
                    const subCompsGetter = () => subComps
                    content = hFn(resolveComponent(compType), { ...props, ...evts, style, class: cls }, subCompsGetter)
                }
            } else {
                content = data.formatter ? data.formatter(form.value[`${data.prop}`], form, i) : form.value[`${data.prop}`]
            }
            // const a  = <div>1</div>
            // const formItem = <el-form-item key={data.key || data.prop} label={data.label} >
            //     {content}
            // </el-form-item>
            const contentGetter = () => content
            const formItem = <el-form-item key={data.key || data.prop} label={data.label} prop={data.prop} >
                {contentGetter}
            </el-form-item>
            return formItem
        }
        function initFormItems(hFn: typeof h) {
            const self = ctx
            const formItems: any[] = []
            let activeGroupKey = null
            let skipGroupKey: any = null
            let activeGroupContent: any[] = []
            const flush = (item: any) => {
                if (activeGroupContent.length === 0) return
                const cols = activeGroupContent.map(group => {
                    const ctts = []
                    const beforeInfo = item.before
                    if (beforeInfo) {
                        const ctt = getContentAround(hFn, beforeInfo)
                        ctt && ctts.push(ctt)
                    }
                    ctts.push(group.formItem)
                    const afterInfo = item.after
                    if (afterInfo) {
                        const ctt = getContentAround(hFn, afterInfo)
                        ctt && ctts.push(ctt)
                    }
                    return <el-col props={group.props} > {ctts} </el-col>
                })
                if (cols.length) {
                    let show = true
                    const vShow = item.layout?.group?.vShow
                    if (vShow) {
                        show = vShow.call(self, self.form, self)
                    }
                    const layoutCmp = <el-row v-show={show}> {cols} </el-row>
                    formItems.push(layoutCmp)
                    activeGroupContent = []
                    activeGroupKey = null
                }
            }
            props.items?.forEach((item: any, i: number) => {
                const fItem = getFormItem(hFn, item, i)
                const layout = item.layout
                if (layout) {
                    if (layout.group.vIf) {
                        const vIf = layout.group.vIf.call(self, self.form, self)
                        skipGroupKey = vIf ? null : layout.group.key
                    }
                    activeGroupKey = layout.group.key
                    if (layout.group.key === skipGroupKey) {
                        return
                    }
                    activeGroupContent.push({ props: layout.props, formItem: fItem })
                    const items = props.items
                    if (items && (i === items.length - 1 || (!items[i + 1].layout) || items[i + 1]?.layout.group.key !== activeGroupKey)) {
                        flush(item)
                    }
                } else {
                    const beforeInfo = item.before
                    if (beforeInfo) {
                        const ctt = getContentAround(hFn, beforeInfo)
                        ctt && (formItems.push(ctt))
                    }
                    fItem && formItems.push(fItem)
                    const afterInfo = item.after
                    if (afterInfo) {
                        const ctt = getContentAround(hFn, afterInfo)
                        ctt && (formItems.push(ctt))
                    }
                }
            })
            return formItems
        }

        function render(hFn: typeof h) {
            // const self = this
            const formItems = initFormItems(hFn)
            const formProps = { model: form, rules: rules, ...context.attrs }
            const dynamicForm = <div>
                <el-form ref={'form'} model={form} rules={rules} {...context.attrs} >
                    {slots.start_form?.({ ctx })}
                    {formItems}
                    {slots.end_form?.({ ctx })}
                </el-form>
                {/* <el-form ref={'form'} props={formProps} >
                    {slots.start_form?.({ ctx: self })}
                    {formItems}
                    {slots.end_form?.({ ctx: self })}
                </el-form> */}
            </div>
            return dynamicForm
        }

        return () => render(h)
    }
}






// defineProps<>
</script>
    