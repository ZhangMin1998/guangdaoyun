// 根据formId获取用户填写的表单信息
import request from '@/utils/request'
export function setFormData(params) {
  return request({
    url: '/form/data/write/data',
    method: 'post',
    data: params
  })
}

// 修改数据
export function editFormData(params) {
  return request({
    url: '/form/data/update',
    method: 'post',
    data: params
  })
}
