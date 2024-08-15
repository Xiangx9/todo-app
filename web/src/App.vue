<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
//i18n
const I18n = useI18n()
const { locale } = useI18n()
// 切换语言更改locale.value的值即可但要跟你index.js中message设置的值一致！
const translate = (lang) => {
  locale.value = lang
  localStorage.setItem('lang', lang)
}

const type = ref('light')
const onChange = (e) => {
  document.documentElement.setAttribute('theme-mode', type.value)
}

</script>

<template>
  <div class="nav">
    <div></div>
    <div style="display: flex;align-items: center;">
      <select style="width: 80px;" v-model="locale" @change="translate">
        <option label="zh-cn" value="zh-cn" />
        <option label="en-us" value="en-us" />
      </select>
      <select style="width: 80px;margin: 10px;" v-model="type" @change="onChange">
        <option label="light" value="light" />
        <option label="dark" value="dark" />
        <option label="red" value="red" />
      </select>

    </div>
  </div>
  <keep-alive>
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition">
        <component :is="Component" />
      </transition>
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
