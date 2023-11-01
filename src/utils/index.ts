// 获取加密 key
export function obtainKey() {
  const jsonObj: any = JSON.parse(sessionStorage.getItem('vuex') || '')
  return jsonObj?.User?.privateKeyStr
}

// 判断IE11
export function isIE11() {
  if (/Trident\/7\./.test(navigator.userAgent)) return true
  return false
}

// 判断是否是移动端
export function isMobile() {
  const flag = navigator.userAgent.match(
    /(phone|pad|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows phone)/i
  )
  return flag
}
// 保存
export function setLocal (key = 'token',value:string) {
  window.localStorage.setItem(key, value)
}

// 获取
export function getLocal (key = 'token') {
  return window.localStorage.getItem(key)
}

// 删除
export function removeLocal (key = 'token') {
  window.localStorage.removeItem(key)
}