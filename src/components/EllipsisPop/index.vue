<template>
  <div class="value_box" :style="{ width: width }">
    <el-popover :placement="placement" :trigger="trigger" :content="content + ''" :disabled="showColumnTip"
                :popper-class='popperClass'>
      <template #reference>
        <div class="value" :class="{ line_clamp: rowNum > 1 }" :style="lineNumStyle" @mouseover="mouseOn($event)">
          {{ content || '--' }}
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'EllipsisPop',
  props: {
    content: {
      type: [String, Number],
      default: ''
    },
    rowNum: {
      type: Number,
      default: 1
    },
    placement: {
      type: String,
      default: 'top-start'
    },
    trigger: {
      type: String,
      default: 'hover'
    },
    width: {
      type: String,
      default: '100%'
    },
    popperClass: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const showColumnTip = ref(true)
    const lineNumStyle = computed(() => {
      if (props.rowNum === 1) {
        return ''
      }
      if (props.rowNum > 1) {
        return {
          '-webkit-line-clamp': props.rowNum,
          'line-clamp': props.rowNum
        }
      }
      return ''
    })

    const mouseOn = (e) => {
      if (props.rowNum === 1) {
        if (e.target.scrollWidth > e.target.clientWidth) {
          showColumnTip.value = false
        } else {
          showColumnTip.value = true
        }
      }
      if (props.rowNum > 1) {
        if (e.target.scrollHeight > e.target.clientHeight) {
          showColumnTip.value = false
        } else {
          showColumnTip.value = true
        }
      }
    }

    return {
      showColumnTip,
      lineNumStyle,
      mouseOn
    }
  }
}
</script>

<style lang='less' scoped>
.value {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
  color: var(--base-text-color-1);
}

.line_clamp {
  white-space: normal;
  display: -webkit-box; //特别显示模式
  -webkit-box-orient: vertical; //盒子中内容竖直排列
}
</style>
