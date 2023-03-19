
<script>
import zyRegion from '@/components/zyRegion/zyRegion.vue'
export default {
  name: 'DynamicForm',
  components: {
    zyRegion
  },
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
  data() {
    return {
      form: { },
      rules: { },
      subCompTypes: {
        'el-select': 'el-option',
        'el-checkbox-group': 'el-checkbox',
        'el-radio-group': 'el-radio'
      },
      modelPack: {
        // 'el-input': { modelField: 'value', modelEvtName: 'input' },
        // 'el-select': { modelField: 'value', modelEvtName: 'input' },
        // 'self-define-cmp': { modelField: 'cmpValue', modelEvtName: 'updateValue' }
      },
      test: 'test'
    }
  },
  watch: {
    defaultData(v) {
      this.initForm()
    },
    defaultRules(v) {
      this.initRule()
    }
  },
  mounted() {

  },
  created() {
    this.initForm()
    this.initRule()
  },
  methods: {
    validate(func) {
      this.$refs.form.validate(func)
    },
    getFormData() {
      return JSON.parse(JSON.stringify(this.form))
    },
    clearValidate() {
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    initForm() {
      if (this.defaultData) {
        this.form = Object.assign({}, this.form, this.defaultData)
      }
    },
    handleForm(fn) {
      fn.call(this, this.form, this)
    },
    sallowCopyRule(rule) {
      if (!rule) return {}
      const copyObj = {}
      for (const key in rule) {
        if (Object.hasOwnProperty.call(rule, key)) {
          const p = rule[key]
          if (typeof (p) !== 'function') {
            copyObj[key] = p
          }
        }
      }
      return copyObj
    },
    initRule() {
      if (!this.defaultRules) return
      const self = this
      const newRules = {}
      for (const key in this.defaultRules) {
        if (Object.hasOwnProperty.call(this.defaultRules, key)) {
          const fieldRules = this.defaultRules[key]
          newRules[key] = []
          fieldRules.forEach(rule => {
            const copyRule = this.sallowCopyRule(rule)
            if (rule.validator) {
              copyRule.validator = (...args) => {
                rule.validator.apply(self, args)
              }
            }
            newRules[key].push(copyRule)
          })
        }
      }
      this.rules = newRules
    },
    rebindEvents(eventsObj) {
      const evts = {}
      for (const evtName in eventsObj) {
        if (Object.hasOwnProperty.call(eventsObj, evtName)) {
          const evtFn = eventsObj[evtName]
          evts[evtName] = (...args) => {
            evtFn.apply(this, args)
          }
        }
      }
      return evts
    },
    getContentAround(h, config) {
      let ctt
      if (config) {
        if (config.slotName) {
          ctt = this.$scopedSlots[config.slotName]?.({ ctx: self })
        } else if (config.content) {
          if (typeof (config.content) === 'string') {
            ctt = h('div', {
              domProps: {
                innerHTML: config.content
              }
            })
          } else if (typeof (config.content) === 'object' && config.content.constructor.name === 'VNode') {
            ctt = config.content
          }
        }
      }
      return ctt
    },
    checkFormItemVis(visField) {
      let res = true
      switch (typeof (visField)) {
        case 'boolean':
          if (visField === false) {
            res = false
          }
          break
        case 'function':
          {
            const r = visField.call(this, this.form, this)
            if (r === false) {
              res = false
            }
          }
          break

        default:
          break
      }
      return res
    },
    getFormItem(h, data, i) {
      const self = this
      let content
      const cmpValue = self.form[`${data.prop}`]
      const ifRes = this.checkFormItemVis(data.vIf)
      const showRes = this.checkFormItemVis(data.vShow)
      if (ifRes === false) return
      if (data.cmp) {
        const compType = data.cmp.type
        if (compType === 'slot') {
          content = this.$scopedSlots[data.cmp.slotName]?.({ data, index: i, ctx: self })
        } else {
          let subComps = []
          if (data.cmp.subComps) {
            subComps = data.cmp.subComps.map(subC => {
              const content = subC.content
              return h(self.subCompTypes[compType], { props: subC }, [content])
            })
          }
          const pack = self.modelPack[compType] || { modelField: 'value', modelEvtName: 'input' }
          pack.modelValue = cmpValue
          const props = { ...data.cmp.attrs }
          props[pack.modelField] = cmpValue
          const evts = {}
          evts[pack.modelEvtName] = (v) => {
            self.$set(self.form, `${data.prop}`, v)
          }
          const style = data.cmp.style
          if (showRes === false) {
            style.display = false
          }
          const cls = data.cmp.cls
          Object.assign(evts, this.rebindEvents(data.cmp.events))
          content = h(compType, { props: props, on: evts, style, class: cls }, subComps)
        }
      } else {
        content = data.formatter ? data.formatter(self.form[`${data.prop}`], self.form, i) : self.form[`${data.prop}`]
      }
      const formItem = <el-form-item key={data.key || data.prop} label={data.label} prop={data.prop}>
        {content}
      </el-form-item>
      return formItem
    },
    initFormItems(h) {
      const self = this
      const formItems = []
      let activeGroupKey = null
      let skipGroupKey = null
      let activeGroupContent = []
      const flush = (item) => {
        if (activeGroupContent.length === 0) return
        const cols = activeGroupContent.map(group => {
          const ctts = []
          const beforeInfo = item.before
          if (beforeInfo) {
            const ctt = self.getContentAround(h, beforeInfo)
            ctt && ctts.push(ctt)
          }
          ctts.push(group.formItem)
          const afterInfo = item.after
          if (afterInfo) {
            const ctt = self.getContentAround(h, afterInfo)
            ctt && ctts.push(ctt)
          }
          return <el-col props={group.props}>{ctts}</el-col>
        })
        if (cols.length) {
          let show = true
          const vShow = item.layout?.group?.vShow
          if (vShow) {
            show = vShow.call(self, self.form, self)
          }
          const layoutCmp = <el-row v-show={show}>{cols}</el-row>
          formItems.push(layoutCmp)
          activeGroupContent = []
          activeGroupKey = null
        }
      }
      this.items?.forEach((item, i) => {
        const fItem = self.getFormItem(h, item, i)
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
          if (i === this.items.length - 1 || (!this.items[i + 1].layout) || this.items[i + 1]?.layout.group.key !== activeGroupKey) {
            flush(item)
          }
        } else {
          const beforeInfo = item.before
          if (beforeInfo) {
            const ctt = self.getContentAround(h, beforeInfo)
            ctt && (formItems.push(ctt))
          }
          fItem && formItems.push(fItem)
          const afterInfo = item.after
          if (afterInfo) {
            const ctt = self.getContentAround(h, afterInfo)
            ctt && (formItems.push(ctt))
          }
        }
      })
      return formItems
    }
  },

  render(h) {
    const self = this
    const formItems = this.initFormItems(h)
    const formProps = { model: self.form, rules: self.rules, ...self.$attrs }
    const dynamicForm = <div>
      <el-form ref={'form'} props={formProps} {...{ on: self.$listeners }}>
        {self.$scopedSlots.start_form?.({ ctx: self })}
        {formItems}
        {self.$scopedSlots.end_form?.({ ctx: self })}
      </el-form>
    </div>
    return dynamicForm
  }
}
</script>
<style lang="scss" scoped>

</style>

