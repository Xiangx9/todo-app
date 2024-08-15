<template>
    <div style="text-align: center; margin-top: 100px">
        Parent {{ addCount }}
        <br>
        <Child :count="count" @child-click="add"></Child>
        <br>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Child from '@/pages/Child/index.vue'

//父传子
const count = ref(1)

//子传子
const addCount = ref()
const add = (value) => {
    addCount.value = value
    count.value += value
}
onMounted(() => {

})
</script>

<style scoped></style>