import request from '@/utils/request'
// ----------------------------------------------------editForm.vue 打开表单填写链接

// 根据codeUuid去查二维码信息
export function getQrCodeWriteInfo(params) {
  return request({
    url: '/form/public/qrCode/write/info',
    method: 'get',
    params
  })
}

// 验证访问密码
export function getCheckPassword(params) {
  return request({
    url: '/form/public/qrCode/write/check/password',
    method: 'get',
    params
  })
}

// 自定义表单-组件查询
export function getQrcodeModule(params) {
  return request({
    url: '/form/public/qrCode/module/query',
    method: 'get',
    params
  })
}
// 自定义表单-填写提交
export function writeFormData(params) {
  return request({
    url: '/form/public/qrCode/write/data',
    method: 'post',
    data: params,
    formUpload: true
  })
}

// ----------------------------------------------------shareForm.vue 打开表单分享链接
// 根据codeUuid去查二维码信息
export function getQrCodeReadInfo(params) {
  return request({
    url: '/form/public/qrCode/read/info',
    method: 'get',
    params
  })
}

// 验证访问密码
export function getCheckReadPassword(params) {
  return request({
    url: '/form/public/qrCode/read/check/password',
    method: 'get',
    params
  })
}

// 读取数据
export function getReadFormData(params) {
  return request({
    url: '/form/public/qrCode/read/data',
    method: 'post',
    data: params,
    formUpload: true
  })
}