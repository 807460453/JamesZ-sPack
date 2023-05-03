<template>
  <div>
    <el-menu :default-active="defaultActive" @select="selected">
      <el-sub-menu v-for="(submenus, index) in menus" :index="(index + 1) + ''" :key="submenus.key">
        <template #title>{{ submenus.title }}</template>
        <el-menu-item v-for="(item, subIndex) in submenus.menus" :index="item.index" :key="item.key">
          {{ item.title }}
        </el-menu-item>
      </el-sub-menu>
    </el-menu>

    <!-- <el-menu default-active="1" @select="selected">
      <el-sub-menu
        v-for="(submenus, index) in menus"
        :index="index + 1"
        :key="submenus.key"
      >
        <template slot="title">{{ submenus.title }}</template>
        <el-menu-item
          v-for="(item, subIndex) in submenus.menus"
          :index="index + 1 + '-' + (subIndex + 1)"
          :key="item.key"
        >
          {{ item.title }}
        </el-menu-item>
      </el-sub-menu>
    </el-menu> -->
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

interface menuNode {
  key: number;
  title: string;
  menus?: Array<menuNode>;
  index?: string
}

const menus = ref<menuNode[]>([
  {
    key: 1, title: "components",
    menus: [
      { key: 11, title: "dynamicForm", index: '/dynamicFormPage' },
      { key: 12, title: "dynamicTable", index: '/dynamicFormTable' },

    ]
  },
  { key: 2, title: "todo:combo", menus: [{ key: 21, title: "21", index: '' }] },
  // { key: 3, title: "3", menus: [{ key: 31, title: "31", index: '' }] },
  // { key: 4, title: "4", menus: [{ key: 41, title: "41", index: '' }] },
]);

const defaultActive = ref('/dynamicFormPage')

const router = useRouter()

function selected(index: string, indexPath?: any, item?: any) {
  console.log(index, indexPath, item);
  router.push(index)
}

function init() {
  const fstSubmenu = menus.value[0]
  const fstItem = fstSubmenu?.menus?.[0]
  fstItem?.index && selected(fstItem.index)
}

init()
</script>
<style lang="postcss" scoped></style>
