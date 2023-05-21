![](https://github.com/807460453/JamesZ-sPack/blob/main/JmsPk.vue3/src/components/myCmp/dynamicComponent/dynamicCmp.PNG?raw=true)

The whole content is made of these

    [
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