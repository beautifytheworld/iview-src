
<template>
  <div class="home-main">
    <!-- <Row :gutter="10">
      <Col :md="24"
           :lg="8"
           :offset="8">
      <Row class-name="home-page-row1"
           :gutter="10">
        <Col :md="12"
             :lg="24"
             :style="{marginBottom: '10px'}">
        <Card>
          <p slot="title">

          </p>
          <p slot="extra">

          </p>

          <Row type="flex"
               class="user-info">
            <Col span="8">
            <Row class-name="made-child-con-middle"
                 type="flex"
                 align="middle">
              <img class="avator-img"
                   :src="avatar" />
            </Row>
            </Col>
            <Col span="16"
                 style="padding-left:6px;">
            <Row class-name="made-child-con-middle"
                 type="flex"
                 align="middle">
              <div>
                <b class="card-user-infor-name">{{name}}</b>
                <p>super admin</p>
              </div>
            </Row>
            </Col>
          </Row>
          <div class="line-gray"></div>
          <Row class="margin-top-8">
            <Col span="8">
            <p class="notwrap">上次登录时间:</p>
            </Col>
            <Col span="16"
                 class="padding-left-8">{{lastLoginTime}}</Col>
          </Row>
          <Row class="margin-top-8">
            <Col span="8">
            <p class="notwrap">上次登录地点:</p>
            </Col>
            <Col span="16"
                 class="padding-left-8">{{area}}</Col>
          </Row>
        </Card>
        </Col>

      </Row>
      </Col>

    </Row>
    <Modal v-model="showEdit"
           title="上传头像"
           @on-ok="ok"
           @on-cancel="cancel"
           width="480">
      <Upload multiple
              type="drag"
              action="//jsonplaceholder.typicode.com/posts/">
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload"
                size="52"
                style="color: #3399ff"></Icon>
          <p>Click or drag files here to upload</p>
        </div>
      </Upload>
    </Modal> -->
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { getKey } from '@/utils/auth'
export default {
  name: 'home',
  components: {
  },
  data () {
    return {
      showEdit: false,
      lastLoginTime: '2018-01-02 12:34:23',
      area: '北京'
    }
  },
  computed: {
    ...mapGetters([
      'avatar'
      // ...
    ]),
    szNickName () {
      return getKey('szNickName')
    },
    name () {
      return getKey('user_name')
    }
  },
  methods: {
    toEdit () {
      this.showEdit = true
    },
    cancel () {
      console.log(this.showEdit)
    },
    ok () {
      console.log(this.showEdit)
    }
  }
}
</script>
<style lang="less" scoped>
@import './home.less';
.home-main{
  height: 90vh;
  // background-image: url(http://7xqeyw.com1.z0.glb.clouddn.com/201611-ipad-605420_1920.jpg)
}
</style>
