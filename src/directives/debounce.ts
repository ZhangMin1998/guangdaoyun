import { App, DirectiveBinding } from 'vue'

export default (app: App<Element>) => {
  app.directive('debounce', {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      let timer: NodeJS.Timeout | null = null
      el.addEventListener('click', () => {
        const firstClick = !timer
  
        if (firstClick) {
          binding.value()
        }
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          timer = null
          if (!firstClick) {
            binding.value()
          }
        }, 1000)
        // if (timer) {
        //   clearTimeout(timer)
        // }
        // timer = setTimeout(() => {
        //   binding.value()
        //   timer = null
        // }, 1000)
      })
    }
  })
}