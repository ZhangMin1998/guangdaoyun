import { App, DirectiveBinding } from 'vue'

export default (app: App<Element>) => {
  app.directive('throttle', {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      let timer: NodeJS.Timeout | null = null
      el.addEventListener('click', () => {
        if (!timer) {
          timer = setTimeout(() => {
            binding.value()
            timer = null
          }, 5000)
        }
      })
    }
  })
}