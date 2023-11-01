import request from '@/utils/request'

// 新增应用
export function appAdd(params) {
  return request({
    url: '/form/app/add',
    method: 'post',
    data: params,
    meta: {
      all: true
    }
  })
}

// 新增表单
export function addForm(params) {
  return request({
    url: '/form/info/add',
    method: 'post',
    data: params,
    meta: {
      all: true
    }
  })
}
export function updateForm(params) {
  return request({
    url: '/form/info/update',
    method: 'post',
    data: params,
    meta: {
      all: true
    }
  })
}

// 查询部门树
export function authOrgListWithTree() {
  return request({
    url: '/login/auth/org/listWithTree',
    method: 'get'
  })
}

// 查询岗位树（角色）
export function listTreeWithRole() {
  return request({
    url: '/login/auth/org/listTreeWithRole',
    method: 'get'
  })
}

// 查询岗位树（角色）
export function listTreeWithAllRole() {
  return request({
    url: '/login/auth/org/listTreeWithAllRole',
    method: 'get'
  })
}

// 对成员发布
export function pushToMember(params) {
  return request({
    url: '/form/auth/member/add',
    method: 'post',
    data: params
  })
}
// 对成员发布
export function searchMemberList(params) {
  return request({
    url: '/form/auth/member/list',
    method: 'get',
    params
  })
}

// 删除对成员发布的权限
export function deleteMemberList(authId, formId) {
  return request({
    url: `/form/auth/member/delete?authId=${ authId }&formId=${ formId }`,
    method: 'post'
    // data: params
  })
}

// 编辑对成员发布的权限
export function editMemberList(params) {
  return request({
    url: '/form/auth/member/update',
    method: 'post',
    data: params
  })
}

// 编辑对成员发布的权限
export function switchStatusMemberList(authId, formId, status) {
  return request({
    url: `/form/auth/member/status/switch?authId=${ authId }&formId=${ formId }&status=${ status }`,
    method: 'post'
  })
}

// 查询应用列表
export function searchAppList() {
  return request({
    url: '/form/app/list',
    method: 'get'
  })
}
// 删除单个应用
export function deleteSingleApp(appId) {
  return request({
    url: '/form/app/delete?appId=' + appId,
    method: 'post'
  })
}
// 更新单个应用图标和名称
export function updateSingleApp(params) {
  return request({
    url: '/form/app/update',
    method: 'post',
    data: params
  })
}
// 查询表单填写链接中查询人的树
export function getUserTreeList() {
  return request({
    url: '/login/auth/user/getUserAllTree',
    method: 'get'
  })
}

// 查询上/下部分的所有信息
export function getInfo(formId,writeType) {
  return request({
    url: `/form/auth/qrCode/write/list?formId=${ formId }&writeType=${ writeType }`,
    method: 'get'
  })
}

// 公开填写添加采集人
export function addCollector(params) {
  return request({
    url: '/form/auth/qrCode/write/add',
    method: 'post',
    data: params
  })
}
// 公开填写删除采集人
export function deleteCollector(formId, writeQrCodeId) {
  return request({
    url: `/form/auth/qrCode/write/delete?formId=${ formId }&writeQrCodeId=${ writeQrCodeId }`,
    method: 'post'
  })
}

// 公开填写设置密码
export function setPassword(params) {
  return request({
    url: '/form/auth/qrCode/write/password/switch',
    method: 'post',
    data: params
  })
}

// 公开填写一开始的状态开关
export function switchStatus(formId, state, writeQrCodeId) {
  return request({
    url: `/form/auth/qrCode/write/status/switch?formId=${ formId }&state=${ state }&writeQrCodeId=${ writeQrCodeId }`,
    method: 'post'
  })
}

// 查询公开查询的信息
export function getOpenSearchInfo(formId,readType) {
  return request({
    url: `/form/auth/qrCode/read/list?formId=${ formId }&readType=${ readType }`,
    method: 'get'
  })
}


// 保存自定义组件的Json数据
export function saveFormJson(params) {
  return request({
    url: '/form/module/save',
    method: 'post',
    data: params
  })
}

// 获取自定义组件的Json数据
export function getFormJson(formId) {
  return request({
    url: `/form/module/query?formId=${ formId }`,
    method: 'post'
  })
}

// 获取应用表单信息
export function getAppFormData(params) {
  return request({
    url: '/form/info/select',
    method: 'get',
    params
  })
}
// 公开查询设置密码
export function setReadPassword(params) {
  return request({
    url: '/form/auth/qrCode/read/password/switch',
    method: 'post',
    data: params
  })
}

// 公开填写一开始的状态开关
export function setReadswitchStatus(formId, state, readQrCodeId) {
  return request({
    url: `/form/auth/qrCode/read/status/switch?formId=${ formId }&state=${ state }&readQrCodeId=${ readQrCodeId }`,
    method: 'post'
  })
}

// 查询公开查询的信息
export function getSingleShareInfo(params) {
  return request({
    url: '/form/auth/qrCode/read/config/find',
    method: 'get',
    params
  })
}

// 获取表单字段信息
export function getAppFormFieldData(params) {
  return request({
    url: '/form/field/list',
    method: 'post',
    data: params,
    formUpload: true
  })
}
// 公开填写一开始的状态开关
export function setSingleShareSwitchStatus(formId,singleReadAuth ) {
  return request({
    url: `/form/auth/qrCode/read/config/update?formId=${ formId }&singleReadAuth=${ singleReadAuth }`,
    method: 'post'
  })
}
// 查询可用字段
export function searchFieldList(formId ) {
  return request({
    url: `/form/field/list?formId=${ formId }`,
    method: 'post'
  })
}
// 查询可用字段
export function setFields(params) {
  return request({
    url: '/form/auth/qrCode/read/fields',
    method: 'post',
    data:params
  })
}


// 获取自定义表单-表单信息
export function getAppFormInfoList(params) {
  return request({
    url: '/form/info/list',
    method: 'get',
    params
  })
}

// 自定义表单-表单信息-排序
export function infoListSort(params) {
  return request({
    url: '/form/info/sort',
    method: 'post',
    data: params
  })
}

// 删除表单
export function deleteInfoList(params) {
  return request({
    url: '/form/info/delete',
    method: 'post',
    data: params
  })
}
// 修改表单
export function updateInfoList(params) {
  return request({
    url: '/form/info/update',
    method: 'post',
    data: params
  })
}

// 新增分组
export function addGroupList(params) {
  return request({
    url: '/form/info/group/add',
    method: 'post',
    data: params
  })
}
// 删除分组
export function deleteGroupList(params) {
  return request({
    url: '/form/info/group/delete',
    method: 'post',
    data: params
  })
}
// 修改分组
export function updateGroupList(params) {
  return request({
    url: '/form/info/group/update',
    method: 'post',
    data: params
  })
}
