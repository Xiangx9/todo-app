<template>
  <div class="content">
    <context-holder />
    <a-date-picker v-model:value="filter.dueDate" picker="month" @change="getTaskList" valueFormat="YYYY-MM" />
    <div style="margin:10px;">
      <a-radio-group v-model:value="filter.priority" name="radioGroup" @change="getTaskList">
        <a-radio value="low">{{ $t('index.low') }}</a-radio>
        <a-radio value="medium">{{ $t('index.medium') }}</a-radio>
        <a-radio value="high">{{ $t('index.high') }}</a-radio>
        <a-radio value="1">{{ $t('index.all') }}</a-radio>
      </a-radio-group>
      <br>
    </div>
    <a-card style="width: 80%;height: 500px;overflow:auto;box-shadow: 0 0 10px 5px rgba(0,0,0,0.1);" ref="containerRef"
      @scroll="handleScroll">
      <a-space direction="vertical" style="width: 100%">
        <a-button type="primary" ghost @click="router.push('/Projects/')">{{ $t('index.Projects') }}</a-button>
        <a-alert v-for="item in taskList" :message="`优先级：${item.priority} ${item.dueDate}`" :description="item.title"
          :type="item.completed ? 'success' : 'error'" show-icon closable @close="close(item)">
          <template #icon><smile-outlined /></template>
          <template #action>
            <a-space direction="vertical" v-show="!item.completed">
              <a-button size="small" type="primary" @click="Edit(item)">
                <FormOutlined />
              </a-button>
              <a-button size="small" type="primary" @click="End(item)">
                <CheckCircleOutlined />
              </a-button>
            </a-space>
          </template>
        </a-alert>

      </a-space>
    </a-card>


    <div v-if="border" style="width: 100vw;height: 100vh;position: absolute;" @click="border = false"></div>

    <!-- 添加 -->
    <div>
      <div class="AddBox">
        <div class="border" v-if="border">
          <a-button size="large" shape="circle" @click="ProjectOpen = true;">
            <MedicineBoxTwoTone />
          </a-button>
          <a-button size="large" shape="circle" @click="open = true;">
            <PlusCircleTwoTone />
          </a-button>
        </div>
        <a-button v-else size="large" shape="circle" @click="border = true;" class="flexBtn">
          <PlusOutlined />
        </a-button>
      </div>
      <!-- 添加项目 -->
      <a-modal v-model:open="ProjectOpen" title="" @ok="AddProject">
        <a-space direction="vertical" :size="18" style="width: 90%">
          <a-input v-model:value="Addfrom.name" placeholder="请添加项目" />
        </a-space>
      </a-modal>
      <!-- 添加任务 -->
      <a-modal v-model:open="open" title="" @ok="Add">
        <a-space direction="vertical" :size="18" style="width: 90%">
          选择项目： <a-select ref="select" v-model:value="Addfrom.projectId" style="width: 120px" placeholder="请选择项目"
            @change="handleChange">
            <a-select-option v-for="item in projectList" :value="item._id">{{ item.name }}</a-select-option>
          </a-select>
          <a-textarea v-model:value="Addfrom.title" placeholder="请编写任务" :rows="4" />
          优先级： <a-radio-group v-model:value="Addfrom.priority" :options="plainOptions" />
          截止日期：<a-date-picker v-model:value="Addfrom.dueDate" />
        </a-space>
      </a-modal>
    </div>

    <!-- 编辑 -->
    <div>
      <a-modal v-model:open="EditOpen" title="修改" @ok="EditTask">
        <a-space direction="vertical" :size="18" style="width: 90%">
          <a-textarea v-model:value="Editfrom.title" placeholder="请编写任务" :rows="4" />
          优先级： <a-radio-group v-model:value="Editfrom.priority" :options="plainOptions" />
          截止日期：<a-date-picker v-model:value="Editfrom.dueDate" />
        </a-space>
      </a-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import './index.scss'
import { message } from 'ant-design-vue';
const [messageApi, contextHolder] = message.useMessage()
import dayjs, { Dayjs } from 'dayjs';
import { SmileOutlined, CheckCircleOutlined, FormOutlined, PlusOutlined, MedicineBoxTwoTone, PlusCircleTwoTone } from '@ant-design/icons-vue';
import { ref, reactive, onMounted, computed, watch, } from "vue";
import { getTasks, postTasks, putTasks, deleteTasks, completedTasks, getProjects, postProjects, putProjects, deleteProjects } from "./api";
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()


const filter = ref<any>({
  priority: '1'
})
// 获取项目
const projectList = ref<any>([])
const getProjectList = async () => {
  let res: any = await getProjects()
  projectList.value = res.data
}


//获取任务
const taskList = ref<any>([])
const pageNumber = ref<number>(1)
const totalCount = ref<number>(0)
const getTaskList = async () => {
  pageNumber.value = 1
  taskList.value = []
  let pram = {
    pageNumber: pageNumber.value,
    pageSize: 10,
    ...filter.value
  }
  let res: any = await getTasks(pram)
  res.data.tasks.map((item: any) => {
    const setMap: any = {
      "low": "低",
      "medium": "中",
      "high": "高"
    }
    item.priority = setMap[item.priority]
    item.dueDate = item.dueDate ? item.dueDate.split('T')[0] : ''
  })
  totalCount.value = res.data.totalCount
  taskList.value = res.data.tasks
  console.log(taskList.value);
}
onMounted(() => {
  getProjectList()
  getTaskList()
})

//完成
const End = async (item: any) => {
  let res = await completedTasks(item._id)
  item.completed = true
  msg(res.data.message)
}

//添加
const border = ref<boolean>(false)
const open = ref<boolean>(false);
const ProjectOpen = ref<boolean>(false)
const Addfrom = ref<any>({
  projectId: '',
  priority: 'medium'
});
const plainOptions = ['low', 'medium', 'high'];
const Add = async (e: MouseEvent) => {
  try {
    if (!Addfrom.value.projectId || !Addfrom.value.title) {
      messageApi.info('请选择项目');
      return
    }
    let pram = {
      title: Addfrom.value.title,
      dueDate: Addfrom.value.dueDate,
      ...Addfrom.value
    }
    let res = await postTasks(pram)
    msg(res.data.message)

    Addfrom.value = {};
    await getTaskList()
    open.value = false;
  } catch (error) {
    console.log('添加', error);

  }
};

const AddProject = async () => {
  try {
    let pram = {
      name: Addfrom.value.name
    }
    let res = await postProjects(pram)
    msg(res.data.message)
    await getTaskList()
    ProjectOpen.value = false
  } catch (error) {
    console.log("添加项目", error);

  }
}

//编辑
const EditOpen = ref<boolean>(false);
let Editfrom = ref<any>({
  title: '',
  priority: '',
  dueDate: ''
});
const Edit = async (item: any) => {
  const setMap: any = {
    "低": "low",
    "中": "medium",
    "高": "high"
  }
  Editfrom.value = Object.assign({}, item)
  Editfrom.value.priority = setMap[Editfrom.value.priority]
  Editfrom.value.dueDate = dayjs(Editfrom.value.dueDate || new Date())
  EditOpen.value = true
}
const EditTask = async () => {
  let pram = {
    id: Editfrom.value._id,
    title: Editfrom.value.title,
    priority: Editfrom.value.priority,
    dueDate: Editfrom.value.dueDate,
  }
  let res = await putTasks(pram)
  msg(res.data.message)
  EditOpen.value = false
  await getTaskList()
}


//删除
const close = async (item: any) => {
  let res = await deleteTasks(item._id)
  msg(res.data.message)
  await getTaskList()
}

// 滚动加载
const containerRef = ref(null)
const handleScroll = async () => {
  const container: any = containerRef.value
  const height = container.$el
  // 通过获取页面的 scrollTop（即滚动条在Y轴上的位置）和 clientHeight（即页面在浏览器窗口中可见部分的高度），
  // 然后与 scrollHeight（即页面总高度）进行比较。当 scrollTop + clientHeight >= scrollHeight
  if (height.scrollTop + height.clientHeight >= height.scrollHeight && pageNumber.value * 10 <= totalCount.value) {
    pageNumber.value++;
    let pram = {
      pageNumber: pageNumber.value,
      pageSize: 10,
      ...filter.value
    }
    let res: any = await getTasks(pram)
    res.data.tasks.map((item: any) => {
      const setMap: any = {
        "low": "低",
        "medium": "中",
        "high": "高"
      }
      item.priority = setMap[item.priority]
      item.dueDate = item.dueDate ? item.dueDate.split('T')[0] : ''
    })
    taskList.value = [...taskList.value, ...res.data.tasks]
  }
}

const msg = (msg: string) => {
  messageApi.success(msg);
}
</script>

<style scope lang="scss"></style>