// 列表搜索页面
import request from '@/utils/request'

// 根据uuid获取信息
// export function getQrCodeReadInfo(params) {
//   return request({
//     url: '/form/public/qrCode/read/info',
//     method: 'get',
//     params
//   })
// }

// 验证访问密码
export function checkReadPassword(params) {
  return request({
    url: '/form/public/qrCode/read/check/password',
    method: 'get',
    params
  })
}
// 查询列表接口
export function searchList(params) {
  return request({
    url: '/form/public/qrCode/read/data',
    method: 'post',
    data:params
  })
}

