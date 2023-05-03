<script setup lang="ts">
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <HeadBar />
      </el-header>
      <el-container>
        <el-aside width="200px">
          <AsideMenu />
        </el-aside>
        <el-main>
          <MainContent />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import HeadBar from "@/components/layout/headBar.vue";
import AsideMenu from "@/components/layout/asideMenu.vue";
import MainContent from "@/components/layout/mainContent.vue";
</script>


