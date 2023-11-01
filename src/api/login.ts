import request from '@/utils/request'

// 用户登录
export function loginsys(param: object) {
  return request({
    url: '/login/oauth/token',
    method: 'post',
    data: param
  })
}

// 用户退出系统
export function logout(params) {
  return request({
    url: '/login/oauth/logout',
    method: 'get',
    params
  })
}

// 获取 验证码图片
export function getVerifyImage () {
  return request({
    url: '/login/oauth/kaptcha',
    method: 'get'
  })
}

// 首次登录修改密码
export function setFirstPassword (param) {
  return request({
    url: '/login/oauth/alter_password',
    method: 'post',
    data: param,
    meta:{
      all: true
    }
  })
}

// 忘记密码申请重置密码
export function resetPassword (param) {
  return request({
    url: '/login/oauth/applicationReset',
    method: 'post',
    data: param,
    meta:{
      all: true
    }
  })
}

// token置换
export function tokenDisplace (data) {
  return request({
    url: '/login/oauth/token/displace',
    method: 'post',
    data
  })
}

export function getpublicKey () {
  return request({
    url: '/login/oauth/publicKey',
    method: 'post'
  })
}

// 个人信息 信息查询
export function authorityById (id) {
  return request({
    url: '/login/auth/user/' + id,
    // url: '/authority/' + id,
    method: 'get'
  })
}

// 修改个人信息
export function upCurrentUser (param) {
  return request({
    url: '/authority/upCurrentUser',
    method: 'post',
    data: param
  })
}

// 修改密码
export function alter_password (param) {
  return request({
    url: '/authority/alter_password',
    method: 'post',
    data: param
  })
}