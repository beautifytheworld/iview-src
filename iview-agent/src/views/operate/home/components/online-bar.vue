<template>
    <div class="bar-item">
        <div class="bar-item-title" :style="{ bottom: px}">
            {{number}}
        </div>
        <div class="bar-item-bar" :style="{ height: px,  backgroundColor: bg}">
        </div>
    </div>
</template>

<script>
export default {
  props: {
    bg: {
      type: String,
      default: '#ebebeb'
    },
    max: {
      type: Number,
      default: 100
    },
    number: {
      type: String,
      default: '0'
    }
  },
  data () {
    return {}
  },
  computed: {
    px () {
      if (this.max === 0 || this.max === '0') {
        return '1px'
      }
      return this.number / this.max * 100 + 'px'
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.bar-item {
  position: relative;
  border-bottom: 1px solid #000;
  height: 120px;
  width: 30px;
  .bar-item-title {
    position: absolute;
    height: 20px;
    text-align: center;
    width: 30px;
  }

  .bar-item-bar {
    position: absolute;
    width: 20px;

    bottom: 0;
    left: 5px;
  }
}
</style>
