<template>
    Child
    <div :class="sloces ? 'sloced' : 'sloce'">{{ propsData.count }}</div>
    <br>
    子传父 <el-button @click="add()">+{{ addCount }}</el-button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
//父传子
const propsData = defineProps({
    count: Number,
})
console.log(propsData);

const sloces = ref(false)

//子传子
let addCount = 1
const emit = defineEmits(['child-click'])
const add = () => {
    sloces.value = true
    setTimeout(() => {
        sloces.value = false
    }, 500)
    emit('child-click', addCount)
}
</script>

<style scoped>
.sloce {
    transition: all 0.5s;
    font-size: 20px;
}

.sloced {
    transition: all 0.5s;
    font-size: 20px;
    transform: scale(1.5, 1.5);
}
</style>