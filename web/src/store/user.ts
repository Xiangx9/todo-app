import { computed, ref } from 'vue'
import { createGlobalState, useStorage, } from '@vueuse/core'

export const userState = createGlobalState(
  () => {
    // state
    const user = ref({})
    useStorage('user', user) //本地存储

    function increment(userInfo: any) {
      user.value = userInfo
    }

    return { user,increment }
  }
)