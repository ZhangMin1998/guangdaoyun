import router from '@/router/index'

const whiteList = ['login','mobilesrarch','search', 'share', 'editform','mobileshare', 'mobileedit']

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')

  // 如果没有token并且也不在白名单，则跳转到登陆页并且携带要去的页面
  // if (!token && !whiteList.includes(to.name as string)) {
  //   if (to.path==='/') {
  //     next({ name: 'login' })
  //   }else{
  //     to.name === 'login' ? next({ name: 'login' }) : next({ name: 'login', query: { redirect: to.fullPath } })
  //   }
  //   return false
  // }
  if (token) {
    next()
  } else {
    if (whiteList.indexOf(to.name as string) !== -1) {
      // 免登陆白名单 直接进入
      next()
    } else {
      next('/login')
      // next({ name: 'login', query: { redirect: to.fullPath } })
    }
  }
})

router.afterEach(() => {})