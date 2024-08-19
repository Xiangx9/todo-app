<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

//i18n
const I18n = useI18n()
const { locale } = useI18n()
// 切换语言更改locale.value的值即可但要跟你index.js中message设置的值一致！
const translate = (lang: string) => {
  locale.value = lang
  localStorage.setItem('lang', lang)
}


//theme
const type = ref(localStorage.getItem('theme') || 'light')
const onChange = (theme: string) => {
  type.value = theme
  localStorage.setItem('theme', theme)
  document.documentElement.setAttribute('theme-mode', theme)
}

onMounted(() => {
  onChange(type.value)
})
</script>

<template>
  <div class="nav">
    <div></div>
    <div style="display: flex;align-items: center;">
      <a-select style="width: 80px;" :default-value="locale" @change="translate">
        <a-select-option label="zh-cn" value="zh-cn" />
        <a-select-option label="en-us" value="en-us" />
      </a-select>
      <a-select style="width: 80px;margin: 10px;" :default-value="type" @change="onChange">
        <a-select-option label="light" value="light" />
        <a-select-option label="dark" value="dark" />
        <a-select-option label="red" value="red" />
      </a-select>
    </div>
  </div>
  <keep-alive>
    <router-view v-slot="{ Component, route }">
      <!-- <transition :name="route.meta.transition"> -->
      <component :is="Component" />
      <!-- </transition> -->
    </router-view>
  </keep-alive>
</template>

<style scoped lang="scss">
.nav {
  width: 100%;
  height: 50px;
  background-color: var(--bg-color);
  position: sticky;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
</style>
