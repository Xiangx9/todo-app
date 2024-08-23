<template>
    <div class="content">
        <a-select style="width:200px" v-model:value="filter.projectId" placeholder="请选择项目" allowClear
            @change="getTaskList()">
            <a-select-option v-for="item in projectList" :key="item._id" :value="item._id">
                {{ item.name }}
            </a-select-option>
        </a-select>

        <a-card
            style="width: 80%;height: 500px;margin-top:30px ;overflow:auto;box-shadow: 0 0 10px 5px rgba(0,0,0,0.1);"
            ref="containerRef">
            <a-space direction="vertical" style="width: 100%;">
                <a-alert v-for="item in taskList" :key="item._id" :message="`项目名：${item.projectId.name} `"
                    :type="item.completed ? 'success' : 'error'" show-icon>
                    <template #description>
                        <p>
                            优先级：{{ item.priority }} {{ item.dueDate }}
                        </p>
                        <div>
                            {{ item.title }}
                        </div>
                    </template>
                </a-alert>
            </a-space>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllTasks, getProjects, putProjects, deleteProjects } from "./api";

// 获取项目
const filter = ref<any>({
    projectId: ''
})
const projectList = ref<any>([])
const getProjectList = async () => {
    let res: any = await getProjects()
    projectList.value = res.data
}

// 获取任务
const taskList = ref<any>([])
const getTaskList = async () => {
    let params = {
        projectId: filter.value.projectId
    }
    let res: any = await getAllTasks(params)
    console.log(res);

    res.data.tasks.map((item: any) => {
        const setMap: any = {
            "low": "低",
            "medium": "中",
            "high": "高"
        }
        item.priority = setMap[item.priority]
        item.dueDate = item.dueDate ? item.dueDate.split('T')[0] : ''
    })
    taskList.value = res.data.tasks
}

// 监听项目选择

onMounted(() => {
    getProjectList()
    getTaskList()
})
</script>

<style scoped></style>