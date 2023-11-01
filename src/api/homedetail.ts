import request from '@/utils/request'
// 获取公开填写的分页查询list
export function getWriteList(params) {
  return request({
    url: '/form/auth/qrCode/write/page',
    method: 'get',
    params
  })
}
// 获取公开发布的分页查询list
export function getPublishList(params) {
  return request({
    url: '/form/auth/qrCode/read/page',
    method: 'get',
    params
  })
}

// 获取字段的list
export function getFieldList(formId) {
  return request({
    url: `/form/field/list?formId=${ formId }`,
    method: 'post'
  })
}

// 设置字段的list
export function setFieldList(params) {
  return request({
    url: '/form/field/setting',
    method: 'post',
    data: params
  })
}

// 根据formId获取用户填写的表单信息
export function getFormList(params) {
  return request({
    url: '/form/data/read/data',
    method: 'post',
    data: params
  })
}
// 详情页的单条数据分享按钮
export function singleDataSharing(params) {
  return request({
    url: '/form/auth/qrCode/read/single/sharing',
    method: 'post',
    data: params
  })
}
// 获取字段的list
export function deleteSingleData(formId,dataId) {
  return request({
    url: `/form/data/delete?formId=${ formId }&dataId=${ dataId }`,
    method: 'post'
  })
}

// /auth/member/menu
// 获取用户对该表单的权限问题
export function getMemberMenu(params) {
  return request({
    url: '/form/auth/member/auth',
    method: 'get',
    params
  })
}


