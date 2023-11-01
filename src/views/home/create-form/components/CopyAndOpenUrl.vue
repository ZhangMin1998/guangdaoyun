<template>
  <div class="copy_and_open_url">
    <div class="url_line">
      <div class="text" v-if="hasText">链接:</div>
      <el-input disabled v-model="shareOpenUrl"></el-input>
      <el-button class="copy_btn blank" @click="copyText" plain>复制</el-button>
      <el-button class="open_btn blank" @click="openUrl" plain>打开</el-button>
      <el-popover placement="bottom-start" trigger="click" popper-class="qrcode_popover" :offset="-10">
        <template #reference>
          <i class="iconfont icon-icon_erweima"></i>
        </template>
        <template #default>
          <div class="qrcode">
            <span class="text">扫描二维码，分享此链接</span>
            <qr-code class="code_img" :value="shareOpenUrl" :size="150" id="canvasDom"
                     v-if="isShow"></qr-code>
            <el-button class="blank" plain @click="downLoadQRcode">下载</el-button>
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ClipboardJS from 'clipboard'
import { ElMessage } from 'element-plus'
import qrCode from '@/components/Qrcode/index.vue'

const shareOpenUrl = ref('')
const isShow = ref(false)
const props = defineProps({
  url: {
    type: String,
    default: ''
  },
  hasText: {
    type: Boolean,
    default: false
  }
})

const copyText = () => {
  const clipboard = new ClipboardJS('.copy_btn', {
    text() {
      return shareOpenUrl.value
    }
  })
  clipboard.on('success', () => {
    ElMessage.success('复制成功')
    // 释放内存
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    ElMessage.success('复制失败')
    // 释放内存
    clipboard.destroy()
  })
}

watch(() => props.url, (newVal) => {
  isShow.value = false
  nextTick(() => {
    shareOpenUrl.value = newVal
    isShow.value = true
  })
}, { immediate: true })

const openUrl = () => {
  window.open(shareOpenUrl.value)
}
const downLoadQRcode = (): void => {
  const canvas = document.getElementById('canvasDom') as HTMLCanvasElement
  const url = canvas.toDataURL('image/png') // 通过 toDataURL 返回一个包含图片展示的 data URI 
  const aDom = document.createElement('a')
  aDom.download = '二维码' // 设置下载的文件名
  aDom.href = url
  document.body.appendChild(aDom)
  aDom.click()
  aDom.remove()
}

</script>

<style lang="less" scoped>
.copy_and_open_url {
  position: relative;
  width: 600px;

  .url_line {
    display: flex;
    align-items: center;

    .text {
      width: 40px;
      margin-right: 8px;
      color: @base-text-color-3;
    }

    .el-input {
      width: 400px;
    }

    // .el-input.is-disabled{

    // }
    :deep(.el-input.is-disabled) {
      cursor: auto;

      .el-input__wrapper {
        background-color: transparent;

        .el-input__inner {
          cursor: auto;
        }
      }

    }

    .el-button {
      margin-left: 16px;
      width: 56px;
      height: 28px;
      background-color: #f2f6fd;
    }

    i {
      font-size: 24px;
      margin-left: 16px;
      cursor: pointer;
      color: #495770
    }
  }
}

.qrcode {
  height: 256px;
  width: 190px;
  margin-left: -18px;
  background-color: #fff;
  user-select: none;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 10px 1px rgba(0, 82, 217, 0.08);
  border: 1px solid #DDDDDD;
  padding: 16px;

  .text {
    font-size: 14px;
  }
  .el-button{
    background-color: #f2f6fd;
  }

  .code_img {
    margin: 12px 0;
  }
}
</style>
<style lang="less">
.qrcode_popover {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;

  .el-popper__arrow::before {
    display: none;
  }
}</style>