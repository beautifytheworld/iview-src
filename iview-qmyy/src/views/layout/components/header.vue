<template>
  <div class="layout-header">
    <div class="header-icon">
      <Icon @click.native="collapsedSider"
            :class="rotateIcon"
            type="navicon-round"
            size="24"></Icon>
    </div>
    <div class="header-breadcrumb">
      <Breadcrumb>
        <BreadcrumbItem :to="item.path"
                        v-for="item in breadcrumbItems"
                        :key="item.path">{{item.title}}</BreadcrumbItem>
      </Breadcrumb>
    </div>
       <div class="header-select">
            <Select v-model="RegisterPlatform">
                <Option value="0">全部</Option>
                <Option value="UU">UU</Option>
                <Option value="QX">QX</Option>
            </Select>
       </div>
    <div class="header-avatar">
      <Dropdown @on-click="userCommand">
        <a href="javascript:void(0)">
          <!-- 登陆用户 名称 和头像-->
          <span> {{name}} </span>
          <Icon type="arrow-down-b"></Icon>
        </a>
        <DropdownMenu slot="list">
          <DropdownItem name="home">首页</DropdownItem>
          <DropdownItem divided
                        name="logout">退出</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Avatar :src="avatar" /> &nbsp;

    </div>
    <slot></slot>
  </div>
</template>

<script>
import { setKey } from '@/utils/auth'

import { mapGetters } from 'vuex'
export default {
  name: 'layout-header',
  components: {},
  data () {
    return {
      isCollapsed: false,
      RegisterPlatform: '0',
      breadcrumbItems: []
    }
  },
  props: {},
  computed: {
    ...mapGetters(['avatar', 'name', 'introduction', 'isLogin']),
    rotateIcon () {
      return ['menu-icon', this.isCollapsed ? 'rotate-icon' : '']
    }
  },
  methods: {
    initBreadcrumbItems (router) {
      let breadcrumbItems = []
      for (let index in router.matched) {
        if (router.matched[index].meta && router.matched[index].meta.title) {
          breadcrumbItems.push({
            path: router.matched[index].path ? router.matched[index].path : '/',
            title: router.matched[index].meta.title
          })
        }
      }
      this.breadcrumbItems = breadcrumbItems
    },
    collapsedSider () {
      this.isCollapsed = !this.isCollapsed
      this.$store.commit('SET_SHRINK', this.isCollapsed)
    },
    userCommand (command) {
      switch (command) {
        case 'home':
          this.$router.push({ name: 'welcome' })
          break
        case 'logout':
          this.$store.dispatch('logOut').then(() => location.reload())
          break
      }
    }
  },
  watch: {
    $route (to) {
      this.initBreadcrumbItems(to)
    },
    RegisterPlatform (value) {
      setKey('RegisterPlatform', value)
    }
  },
  mounted () {
    setKey('RegisterPlatform', this.RegisterPlatform)
  },
  created () {
    this.initBreadcrumbItems(this.$route)
  }
}
</script>

<style lang="less" scoped>
.layout-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background-color: #fff;
  .header-icon {
    flex: 0 0 50px;
    text-align: center;
    .menu-icon {
      transition: all 0.3s;
    }
    .rotate-icon {
      transform: rotate(-90deg);
    }
  }

  .header-breadcrumb {
    flex: 1;
  }
  .header-select{
    flex: 0 0 100px;
    margin-right: 20px;
  }
  .header-avatar {
    flex: 0 0 120px;
  }
}
</style>
