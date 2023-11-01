<template>
  <div class="edit_app">
    <div class="title">
      <div class='ground_bar'>
        <div v-if="!isRename" class='tab_label'>{{ formName }}</div>
        <el-input v-model.trim="formName" placeholder="请输入" maxlength='10' ref="focusInput"
                  @blur='submitReFormname'
                  :autofocus="true" v-else></el-input>
        <div id='operaIcon' class='opera_icon' @click="showOperaEvent">
          <i class='iconfont icon-xiala' v-if='!showOpera'></i>
          <i class='iconfont icon-tongyong-Icontubiao-Line-left' v-else></i>
        </div>
        <div v-show='showOpera' class='opera_btn' id='operaBtn'>
          <div class='btn' @click='reFormname'>重命名</div>
        </div>
        <div class='app_header_hidden'>
          <i class='iconfont icon-yulan-dakai_preview-open' title='显示'></i>
        </div>
      </div>
    </div>
    <div class="choose">
      <!-- <div class="choose_box" v-if="currentRouter.name === 'createchoose'">
        <div class="form_list">
          <div class="form" @click="createForm">
            <i class="iconfont icon-icon_liuchengbiaodan"></i>
            <span class="name">表单</span>
          </div>
        </div>
      </div> -->
      <RouterView />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue'
// import { useRouter } from 'vue-router'
import { updateForm } from '@/api/home'
// const router = useRouter()
const currentRouter = useRoute()
const formName = ref('')
const showOpera = ref(false)
const isRename = ref(false)
const focusInput = ref()
formName.value = typeof (currentRouter.query.formName) === 'string' ? currentRouter.query.formName : '未命名表单1'
onMounted(() => {
  // 查询表单名
})
const reFormname = () => {
  isRename.value = true
  showOpera.value = false
  setTimeout(() => {
    focusInput.value.focus()
  }, 100)
}
const showOperaEvent = () => {
  showOpera.value = !showOpera.value
}
const submitReFormname = () => {
  if (!formName.value) {
    ElMessage.warning('表单名称不可为空!')
    formName.value = typeof (currentRouter.query.formName) === 'string' ? currentRouter.query.formName : '未命名表单1'
    isRename.value = false
    return
  }
  updateForm({ name: formName.value, appId: currentRouter.query.appId, type: 'form', id: currentRouter.query.formId }).then((res: any) => {
    if (res.code === 1) {
      currentRouter.query.formName = formName.value
      console.log(currentRouter.query.formName)
      ElMessage.success('修改成功')
      isRename.value = false
    }
  })
}
</script>

<style lang="less" scoped>
.edit_app {
  height: 100vh;
  padding: 32px;
  background: #F5F7FA;

  .title {
    height: 65px;

    .choose_text {
      font-size: 18px;
    }

    .ground_bar {
      position: absolute;
      min-width: 180px;
      border-bottom: 1px solid #DDDDDD;
    }

    .tab_label {
      padding: 8px 36px 8px 12px;
      font-size: 18px;
      line-height: 21px;
      color: @base-text-color-1;
    }

    :deep(.el-input) {
      margin-right: 4px;

      .el-input__wrapper {
        background-color: transparent;
        box-shadow: none
      }

      .el-input__inner {
        border: 0;
        height: 37px;
        line-height: 37px;
        padding: 0 12px;
      }
    }

    .opera_icon {
      position: absolute;
      right: 12px;
      top: 10px;
      cursor: pointer;

      &.disabled {
        cursor: not-allowed;
      }

      i {
        font-size: 16px;
        line-height: 16px;
        color: #98A3B7
      }
    }

    .opera_btn {
      border: 1px solid @active-color;
      position: absolute;
      right: 0;
      top: 42px;
      z-index: 10;

      .btn {
        min-width: 84px;
        padding: 9px 0;
        font-size: 14px;
        line-height: 14px;
        text-align: center;
        color: @active-color;
        cursor: pointer;
        user-select: none
      }
    }
  }

  .choose {
    background-color: #fff;
    height: calc(100vh - 129px);
    width: 100%;

    .choose_box {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .form_list {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .form {
      padding: 20px 30px;
      display: flex;
      flex-direction: column;
      cursor: pointer;

      &:hover {
        border-radius: 4px;
        border: 1px solid #ebecee;
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .08);
      }

      i {
        font-size: 40px;
        color: @active-color;
      }

      .name {
        margin-top: 27px;
        font-size: 18px;
      }
    }
  }
}
</style>
