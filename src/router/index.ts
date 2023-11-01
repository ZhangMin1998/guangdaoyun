import { createRouter, createWebHistory } from 'vue-router'

const routes: any = [
  {
    path: '/',
    redirect: '/login',
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue')
        // component: () => import('@/components/Table/demo.vue')
      }
    ]
  },
  {
    path: '/pages',
    component: () => import('@/components/Layout/index.vue'),
    children: [
      {
        path: '/pages',
        name: 'pages',
        // component: () => import('@/views/pages/index.vue')
        component: () => import('@/views/fillForm/index.vue')
      }
    ]
  },
  {
    path: '/adddata',
    component: () => import('@/components/Layout/index.vue'),
    children: [
      {
        path: '/adddata',
        name: 'adddata',
        component: () => import('@/views/add-data/index.vue')
      }
    ]
  },
  {
    path: '/search',
    component: () => import('@/components/Layout/index.vue'),
    children: [
      {
        path: '/search',
        name: 'search',
        // component: () => import('@/views/pages/index.vue')
        component: () => import('@/views/search/index.vue')
      }
    ]
  },
  {
    path: '/mobileedit',
    name:'mobileedit',
    component: () => import('@/views/pages/components/editMb.vue')
  },
  {
    path: '/mobileshare',
    name:'mobileshare',
    component: () => import('@/views/pages/components/shareMb.vue')
  },
  {
    path: '/mobilesrarch',
    name:'mobilesrarch',
    component: () => import('@/views/search/components/mobile-page/index.vue')
  },
  {
    path: '/home',
    component: () => import('@/components/Layout/index.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/index.vue')
      }
    ]
  },
  {
    path: '/home/createchoose',
    name: 'createchoose',
    component: () => import('@/views/home/create-choose/index.vue'),
    children: [
      {
        path: '/home/createform',
        name: 'createform',
        component: () => import('@/views/home/create-form/index.vue')
      }
    ]
  },
  {
    path: '/home/detail',
    component: () => import('@/components/Layout/index.vue'),
    children: [
      {
        path: '/home/detail',
        name: 'homedetail',
        component: () => import('@/views/home/home-detail/index.vue')
      }
    ]
  },
  {
    path: '/profile',
    component: () => import('@/components/Layout/index.vue'),
    children: [
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/profile/index.vue')
      }
    ]
  },
  {
    path: '/editform',
    component: () => import('@/components/Layout/index.vue'),
    children: [
      {
        path: '/editform',
        name: 'editform',
        component: () => import('@/views/pages/editform.vue')
      }
    ]
  },
  {
    path: '/share',
    component: () => import('@/components/Layout/index.vue'),
    children: [
      {
        path: '/share',
        name: 'share',
        component: () => import('@/views/pages/shareform.vue')
      }
    ]
  },
  {
    path: '/contact',
    component: () => import('@/components/Layout/index.vue'),
    children: [
      {
        path: '/contact',
        name: 'contact',
        redirect: '/contact/departmentManage',
        component: () => import('@/views/contact/index.vue'),
        children: [
          {
            path: '/contact/passwordManage',
            name: 'passwordManage',
            component: () => import('@/views/contact/passwordManage/index.vue')
          },
          {
            path: '/contact/departmentManage',
            name: 'departmentManage',
            component: () => import('@/views/contact/departmentManage/index.vue')
          },
          {
            path: '/contact/userManage',
            name: 'userManage',
            component: () => import('@/views/contact/userManage/index.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/components/ErrorPage/404.vue')
  }
  // {
  //   path: '/test',
  //   name: 'test',
  //   component: () => import('@/views/test.vue')
  // }
]

// 如果没匹配上路由则自动跳转到 404
routes.push({
  path: '/:catchAll(.*)',
  redirect: '/404'
})

export const router = createRouter({
  history: createWebHistory(), // createWebHistory(import.meta.env.BASE_URL)
  routes
})

export default router
