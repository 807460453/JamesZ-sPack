# What is JzDynamicElForm
JzDynamicElForm is a vue2 component that accept obj-data and translate it into a form

you don't neet to use this to create a form

    <el-form-item label="field1">
        <el-input v-model="form.f1" placeholder="placeholder"></el-input>
    </el-form-item>



instead pass this as a prop

    { 
        key: 'f1', prop: 'f1', label: 'field1',
        cmp: { type: 'el-input', attrs: { placeholder: 'placeholder' }}
    }

![](https://github.com/807460453/JamesZ-sPack/blob/main/elementCmps/JzDynamicElForm/c.png?raw=true)



this can be useful when `el-form-item` is uncertain

for eg: 

* the order of `el-form-item` is based on some variable
* the item of the form is uncertain until a http request is send

the demo file shows more details to use it


notice that in some events `this` has been rebinded to the form component

if you want to use the "real" `this`, define a `self` instead like the demo did

the layout prop creates a structure like this:

    <el-row>
        <el-col>
            <el-form-item label="field8">
                <el-input v-model="form.f8"></el-input>
            </el-form-item>
        </el-col>
        <el-col>
            <el-form-item label="field9">
                <el-input v-model="form.f9"></el-input>
            </el-form-item>
        </el-col>
    </el-row>

`group` defines the `el-row` part and `vIf` should be used only once per group

`vShow` is also suported in `group`

`self-define-cmp` is suported but it need to be registed globlely


