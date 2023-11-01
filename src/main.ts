import { createApp } from 'vue'
import 'normalize.css'
// import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import store from './stores/index'
// 2. 引入组件样式
import 'vant/lib/index.css'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 覆盖element主题色
import './assets/css/elementTheme.scss'
//引入element-plus相关样式
// import 'element-plus/dist/index.css'

import './assets/css/common.less'
import '@/utils/permission'
import formCreate from '@form-create/element-ui'
import FcDesigner from '@form-create/designer'

import debounce from '@/directives/debounce'
import throttle from './directives/throttle'
import { Field } from 'vant'
import { Icon } from 'vant'
import { List } from 'vant'
import { PullRefresh } from 'vant'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// app.config.globalProperties.$policeComfirm = MessageBox.install
// 全局注册自定义指令
app.use(debounce)
app.use(throttle)
app.use(router)
app.use(store)
app.use(ElementPlus)
app.use(formCreate)
app.use(FcDesigner)
app.use(Field)
app.use(Icon)
app.use(List)
app.use(PullRefresh)
app.mount('#app')
