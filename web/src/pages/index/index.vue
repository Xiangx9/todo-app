<template>
  <div style="text-align: center;">
    <br>--------------------------------------------------<br>
    <div class="text">
    </div>
    <br>---------------------------------------------------<br>

    <a-button type="primary" @click="goParent()">{{ $t(`table.Parent`) }}</a-button>
    <a-button type="primary" @click="goTailwindCSS()">{{ $t(`table.TailwindCSS`) }}</a-button>

  </div>
</template>

<script setup>
import './index.scss'

import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
// 跳转
const goParent = () => {
  console.log(route);

  router.push({
    path: '/Parent',
    query: { id: 1 }
  })
}

const goTailwindCSS = () => {
  router.push({
    name: '/login/',
    params: { id: 1 }
  })
}

</script>

<style scope lang="scss"></style>