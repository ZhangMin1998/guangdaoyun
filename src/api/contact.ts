import request from '@/utils/request'

// --------------------------------------------------密码管理
export function listApplyByPage (params) {
  return request({
    url: '/login/oauth/applicationList',
    method: 'get',
    params
  })
}

export function clickApplication (params) {
  return request({
    url: '/login/oauth/clickApplication',
    method: 'get',
    params
  })
}

export function getPassWord (params) {
  return request({
    url: '/login/oauth/getPassWord',
    method: 'get',
    params
  })
}

// ------------------------------------------------部门管理
// 创建部门
export function authOrgCreate (params) {
  return request({
    url: '/login/auth/org/create',
    method: 'post',
    data: params
  })
}

// 重命名部门
export function authOrgUpdate (params) {
  return request({
    url: '/login/auth/org/update',
    method: 'post',
    data: params
  })
}

// 查询部门树型
// export function authOrgListWithTree (params) {
//   return request({
//     url: '/login/auth/org/listWithTree',
//     method: 'get',
//     params,
//     cancelMuchRequest: true
//   })
// }

// 根据树id去查询用户
export function queryUserByOrgId (params) {
  return request({
    url: '/login/auth/user/queryUserByOrgId',
    method: 'get',
    params
  })
}

// 根据部门查询角色列表
export function queryRoleByOrgId (params,loadingObj) {
  return request({
    url: '/login/auth/role/queryRoleByOrgId',
    method: 'get',
    params,
    ...loadingObj
  })
}

// 角色的删除，停用，启用
export function roleUpdateByRoleId (id, params) {
  return request({
    url: '/login/auth/role/updateByRoleId/' + id,
    method: 'put',
    params
  })
}

// 根据角色id查询功能菜单
export function listWithTreeByRoleId (params,loadingObj) {
  return request({
    url: '/login/auth/module/listWithTreeByRoleId',
    method: 'get',
    params,
    ...loadingObj
  })
}

// 查询功能菜单
export function listWithTree (params) {
  return request({
    url: '/login/auth/module/listWithTree',
    method: 'get',
    ...params
  })
}

// 新增角色
export function authRoleCreate (params) {
  return request({
    url: '/login/auth/role/create',
    method: 'post',
    data: params
  })
}

// 删除，修改，停用角色
export function authRoleUpdate (params) {
  return request({
    url: '/login/auth/role/update',
    method: 'post',
    data: params
  })
}

// 删除、启用禁用
export function updateByUserId (id, params) {
  return request({
    url: '/login/auth/user/updateByUserId/' + id,
    method: 'put',
    params,
    meta: {
      all: true
    }
  })
}

// 新增用户
export function authUserCreate (params) {
  return request({
    url: '/login/auth/user/create',
    method: 'post',
    data: params
  })
}
// 修改用户
export function authUserUpdate (params) {
  return request({
    url: '/login/auth/user/update',
    method: 'post',
    data: params
  })
}

// 删除、启用禁用
export function userChangeOrgBatch (params) {
  return request({
    url: '/login/auth/user/changeOrgBatch',
    method: 'put',
    data: params
  })
}

// 根据用户的id去查所有的角色
export function getAllRoleByUserId (params) {
  return request({
    url: '/login/auth/user/getAllRoleByUserId',
    method: 'get',
    params
  })
}