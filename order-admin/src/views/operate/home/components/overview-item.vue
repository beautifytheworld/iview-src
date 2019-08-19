<template>
    <div :class="className">
        <div class="title">{{title}}</div>
        <div :style="{float:'left',display:'inline-block',background:color,height:height,width:width }"></div>
        <div style="float:right;">&nbsp;&nbsp;{{' 占比:'+ percent}}</div>
        <div style="float:right;">{{peoples+'人'}}</div>
    </div>
</template>

<script>

export default {
  props: {
    className: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '注册总数:'
    },
    color: {
      type: String,
      default: '#6666cc'
    },
    height: {
      type: String,
      default: '22px'
    },

    peoples: {
      type: String,
      default: '0'
    },
    max: {
      type: String,
      default: '1'
    }

  },
  data () {
    return {

    }
  },
  computed: {
    width () {
      if (this.max === 0) {
        return '0px'
      }
      return parseInt(270 * this.peoples / this.max) + 'px'
    },
    percent () {
      if (this.max === 0) {
        return 0 + '%'
      }
      return parseInt(this.peoples / this.max * 100) + '%'
    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.title {
  float: left;
  width: 100px;
  text-align: right;
}
</style>
