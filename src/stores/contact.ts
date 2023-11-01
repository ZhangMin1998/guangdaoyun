// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const contactStore = defineStore({
  id: 'contact',
  state: () => ({
    organizationalTreeList: '',
    departmentTreeWithRoleList: ''
  }),
  getters: {
    // getAge() {
    //   return this.age + 1
    // } 
  },
  actions: {
    // setUserInfo(val) {
    //   this.userInfo = val
    // },
    // setPasswordErrorTimes(val) {
    //   this.passwordErrorTimes = val
    // },
    set_organizationalTreeList (val) {
      this.organizationalTreeList = val
    },
    set_departmentTreeWithRoleList (val) {
      this.departmentTreeWithRoleList = val
    }
  },
  // 开启数据缓存
  persist: {
    enabled: true
  }
})
