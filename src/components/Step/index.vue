<template>
  <div class="step">
    <div class="each_item" v-for="(item, index) in stepData" :key="index">
      <div class="step_title" :class="{ 'active': active >= index + 1 }" @click="changeStep(index + 1)">
        <div class="circle">
          <span>{{ index + 1 }}</span>
        </div>
        <div class="name">
          {{ item.title }}
        </div>
      </div>
      <div class="line" :class="{ 'active_line': active > index + 1 }" v-if="index !== stepData.length - 1"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Root1 {
  title: string;
}
defineProps({
  stepData: {
    type: Array<Root1>,
    default: () => [{
      title: '步骤1'
    }, {
      title: '步骤2'
    }, {
      title: '表单发布'
    }]
  },
  active: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['update:active','change'])

const changeStep = (index) => {
  emit('update:active', index)
  emit('change', index)
}
</script>


<style lang="less" scoped>
.step {
  display: flex;

  .each_item {
    display: flex;
    justify-content: center;
    align-items: center;

    .step_title {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      .circle {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: #C0C4CC;
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          color: #fff;
        }
      }

      .name {
        color: #C0C4CC;
        margin-left: 8px;
      }
    }

    .step_title.active {
      .circle {
        background-color: @active-color;
      }

      .name {
        color: #0D162A;
      }
    }



    .line {
      height: 1px;
      width: 88px;
      background-color: #DDDDDD;
      margin: 0 8px;
    }

    .active_line {
      background-color: @active-color;
    }
  }
}
</style>