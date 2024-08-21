<template>
  <div class="login">
    <a-form class="content login-box" layout="inline" :model="userForm" @finish="handleFinish"
      @finishFailed="handleFinishFailed">
      <a-form-item>
        <a-input v-model:value="userForm.username" placeholder="Username">
          <template #prefix>
            <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
          </template>
        </a-input>
      </a-form-item>
      <br>
      <a-form-item>
        <a-input v-model:value="userForm.password" type="password" placeholder="Password">
          <template #prefix>
            <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
          </template>
        </a-input>
      </a-form-item>
      <br>
      <a-form-item>
        <a-button type="primary" html-type="submit" :disabled="userForm.username === '' || userForm.password === ''">
          {{ $t('btn.login') }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import './index.scss'
import { register, login } from "./api";
import { ref, reactive } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import type { UnwrapRef, } from 'vue';
import type { FormProps } from 'ant-design-vue';
import { userState } from "@/store/user";;
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()


interface FormState {
  username: string;
  password: string;
}
const userForm: UnwrapRef<FormState> = reactive({
  username: '',
  password: '',
});
const handleFinish: FormProps['onFinish'] = async (values) => {
  Login(userForm)
};
const handleFinishFailed: FormProps['onFinishFailed'] = errors => {
  console.log(errors);
};

// 注册 
const Register = async (from: any) => {
  await register(from)
  await Login(from)
}
// 登录
const Login = async (from: any) => {
  const { data: loginRes } = await login(from)
  if (loginRes.code == 101) {
    Register(from)
    return
  }
  let userInfo = userState()
  userInfo.increment(loginRes.userInfo)
  router.replace({ path: '/' })
}
</script>
