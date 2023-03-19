<template>
  <div>
    <DynamicForm
      ref="DynamicForm"
      :default-data="formDefaultData"
      :items="cmpItems"
      :default-rules="testRules"
      label-width="100px"
    >
      <template #start_form="{ctx}">
        start_form:{{ ctx.test }}
      </template>
      <template #after_f4_slot>
        after_f4_slot
      </template>
      <template #f7_slot="{ctx}">
        <span v-if="ctx.form">
          <el-button
            type="primary"
            class="zy-form-item-btn"
            @click="textBtnClick(ctx)"
          >test</el-button>
        </span>
      </template>

    </DynamicForm>
  </div>
</template>
<script>
import DynamicForm from '../dynamicForm.vue'
export default {
  name: 'DynamicFormDemo',
  components: { DynamicForm },
  data() {
    return {
      formDefaultData: null,
      cmpItems: null,
      testRules: null
    }
  },
  mounted() {
    this.initCmps()
    this.initFormDefaultData()
    this.initRules()
  },
  methods: {
    initCmps() {
      const self = this
      this.cmpItems = [
        { key: 'f1', prop: 'f1', label: 'field1',
          cmp: { type: 'el-input', attrs: { placeholder: 'placeholder' }}
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
        { key: 'f3', prop: 'f3', label: 'field3',
          cmp: {
            type: 'el-checkbox-group',
            subComps: [{ key: 1, label: '1', content: '111content' }],
            events: {
              change: function(...args) {
                console.log(this)
                console.log(...args)
              }
            }
          }
        },
        { key: 'f4', prop: 'f4', label: 'field4',
          cmp: {
            type: 'el-date-picker',
            attrs: { 'value-format': 'yyyy-MM-dd' },
            events: {
              onChange: function(...args) {
                console.log(this)
                console.log(...args)
              }
            }
          },
          before: {
            content: `<div><p style="color:red; position:absolute; margin:-20px 0 0 150px;">before content</p></div>`
          },
          after: {
            slotName: 'after_f4_slot'
          }
        },
        { key: 'f5', prop: 'f5', label: 'field5',
          cmp: {
            type: 'el-input', attrs: { placeholder: 'adfasfdsa' },
            events: {
              focus: function(...args) {
                if (!this.form.f1) {
                  this.form.f1 = 'f5_focus_trigger_input'
                }
              }
            }
          }
        },
        { key: 'f6', prop: 'f6', label: 'field6',
          cmp: {
            type: 'el-input', attrs: { placeholder: 'address' },
            events: {
              focus: function(...args) {
                console.log(self)
              }
            }
          }
        },
        { key: 'f7', prop: 'f7', label: 'field7',
          vIf: function(form, ctx) {
            return form.f1 === '1'
          },
          cmp: {
            type: 'slot', slotName: 'f7_slot'
          }
        },
        { key: 'f8', prop: 'f8', label: 'field8',
          layout: {
            group: {
              key: 1,
              vIf: function(form, ctx) {
                return form.f1
              }
              // vShow: function(form, ctx) {
              //   return form.projectNumber
              // }
            },
            props: { xl: 12, md: 12, sm: 24 }
          },
          cmp: {
            type: 'el-radio-group', subComps: [{ key: 1, label: '1', content: '111radio' }]
          }
        }
      ]
    },
    initFormDefaultData() {
      this.formDefaultData = { f1: null, f2: null, f3: [],
        f4: null, f5: null, f6: null, f7: null,
        f8: null }
    },
    initRules() {
      const self = this
      this.testRules = {
        f1: [{
          required: true, message: `input`
        }, {
          required: true,
          validator: function(rule, value, callback) {
            console.log(this)
            console.log(self)
            if (value !== '1') {
              callback('input 1')
            } else {
              callback()
            }
          }
        }]
      }
    },
    textBtnClick(context) {
      context.handleForm((form, ctx) => {
        console.log(form, ctx)
        form.projectNumber = '1'
      })
    }
  }
}
</script>
<style scoped lang="scss">
</style>
