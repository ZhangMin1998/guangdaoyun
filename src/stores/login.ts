// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const userStore = defineStore({
  id: 'login',
  state: () => ({
    // isAdmin: false, // 是否是超管
    userInfo: {},
    passwordErrorTimes: 0 // 输错密码次数
  }),
  getters: {
    isAdmin() {
      return this.userInfo.realName === 'admin' && this.userInfo.id === 1
    } 
  },
  actions: {
    // changeAge(val) {
    //   this.age += val
    // },
    setUserInfo(val) {
      this.userInfo = val
    },
    setPasswordErrorTimes(val) {
      this.passwordErrorTimes = val
    }
  },
  // 开启数据缓存
  persist: {
    enabled: true
  }
})
