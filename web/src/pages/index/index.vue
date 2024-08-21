<template>
  <div class="content">
    <context-holder />
    <a-date-picker v-model:value="filter.dueDate" picker="month" @change="getTaskList" valueFormat="YYYY-MM" />
    <div style="margin:10px;">
      <a-radio-group v-model:value="filter.priority" name="radioGroup" @change="getTaskList">
        <a-radio value="low">低</a-radio>
        <a-radio value="medium">中</a-radio>
        <a-radio value="high">高</a-radio>
        <a-radio value="1">全部</a-radio>
      </a-radio-group>
      <br>
    </div>
    <a-card style="width: 80%;height: 400px;overflow:auto;box-shadow: 0 0 10px 5px rgba(0,0,0,0.1);" ref="containerRef"
      @scroll="handleScroll">
      <a-space direction="vertical" style="width: 100%">
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

    <!-- 添加 -->
    <div>
      <a-button size="large" shape="circle" @click="open = true;" class="flexBtn">
        <PlusOutlined />
      </a-button>
      <a-modal v-model:open="open" title="" @ok="Add">
        <a-space direction="vertical" :size="18" style="width: 90%">
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
import { SmileOutlined, CheckCircleOutlined, FormOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { ref, reactive, onMounted, computed, watch, } from "vue";
import { getTasks, postTasks, putTasks, deleteTasks, completedTasks } from "./api";
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()


const filter = ref<any>({
  priority: '1'
})
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
  getTaskList()
})

//完成
const End = async (item: any) => {
  let res = await completedTasks(item._id)
  item.completed = true
  msg(res.data.message)
}

//添加
const open = ref<boolean>(false);
const Addfrom = ref<any>({});
const plainOptions = ['low', 'medium', 'high'];
const Add = async (e: MouseEvent) => {
  try {
    if (!Addfrom.value.title) {
      messageApi.info('请填写任务');
      return
    }
    let pram = {
      title: Addfrom.value.title,
      priority: Addfrom.value.priority,
      dueDate: Addfrom.value.dueDate,
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