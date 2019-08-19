
<template>
  <div>
    <div class="home-main">

      <Card class="risk-card">
        <p slot="title">
          用户风控内容
        </p>

        <div class="risk-times"> 每 <InputNumber  :min="1" v-model="m1" number size="small" style="width:80px"></InputNumber> 分钟运行一次</div>
        <CheckboxGroup v-model="userRisks">
          <Checkbox v-for="(i, index ) in userRiskConfigs" :key="'userRiskConfigs'+index" :label="i.id" class="checkbox-item" readonly>
            <span v-if="i.content.length===2">
              &nbsp;{{i.content[0]}} <InputNumber  :min="1" v-model="i.p1" size="small" style="width:80px"></InputNumber> {{i.content[1]}}
            </span>
            <span v-if="i.content.length===3">
              &nbsp;{{i.content[0]}} <InputNumber  :min="1" v-model="i.p1" size="small" style="width:80px"></InputNumber> {{i.content[1]}} <InputNumber :min="1" v-model="i.p2" size="small" style="width:80px"></InputNumber> {{i.content[2]}}
            </span>
          </Checkbox>
        </CheckboxGroup>

      </Card>
      <Card class="risk-card">
        <p slot="title">
          支付风控内容
        </p>

        <div class="risk-times"> 每 <InputNumber  :min="1" v-model="m4"  size="small"  style="width:80px"></InputNumber> 分钟运行一次</div>

        <CheckboxGroup v-model="payRisks">
          <Checkbox v-for="(i, index ) in payRiskConfigs" :key="'payRiskConfigs'+index" :label="i.id" class="checkbox-item">
            <span v-if="i.content.length===2">
              &nbsp;{{i.content[0]}} <InputNumber v-model="i.p1" size="small" style="width:80px"></InputNumber> {{i.content[1]}}
            </span>
            <span v-if="i.content.length===3">
              &nbsp;{{i.content[0]}} <InputNumber v-model="i.p1" size="small" style="width:80px"></InputNumber> {{i.content[1]}} <InputNumber v-model="i.p2" size="small" style="width:80px"></InputNumber> {{i.content[2]}}
            </span>
          </Checkbox>
        </CheckboxGroup>
      </Card>
      <Card class="risk-card">
        <p slot="title">
          代理风控内容
        </p>

        <div class="risk-times"> 每 <InputNumber  :min="1" v-model="m2" size="small" style="width:80px"></InputNumber> 分钟运行一次</div>

        <CheckboxGroup v-model="agentRisks">
          <Checkbox v-for="(i, index ) in agentRiskConfigs" :key="'agentRiskConfigs'+index" :label="i.id" class="checkbox-item">
            <span v-if="i.content.length===2">
              &nbsp;{{i.content[0]}} <InputNumber v-model="i.p1" size="small" style="width:80px"></InputNumber> {{i.content[1]}}
            </span>
            <span v-if="i.content.length===3">
              &nbsp;{{i.content[0]}} <InputNumber v-model="i.p1" size="small" style="width:80px"></InputNumber> {{i.content[1]}} <InputNumber v-model="i.p2" size="small" style="width:80px"></InputNumber> {{i.content[2]}}
            </span>
          </Checkbox>
        </CheckboxGroup>
      </Card>

      <Card class="risk-card">
        <p slot="title">
          平台风控内容
        </p>

        <div class="risk-times"> 每 <InputNumber :min="1" v-model="m3"  size="small" style="width:80px"></InputNumber> 分钟运行一次</div>

        <CheckboxGroup v-model="platformRisks">
          <Checkbox v-for="(i, index ) in platformRiskConfigs" :key="'platformRiskConfigs'+index" :label="i.id" class="checkbox-item">
            <span v-if="i.content.length===2">
              &nbsp;{{i.content[0]}} <InputNumber v-model="i.p1" size="small" style="width:80px"></InputNumber> {{i.content[1]}}
            </span>
            <span v-if="i.content.length===3">
              &nbsp;{{i.content[0]}} <InputNumber v-model="i.p1" size="small" style="width:80px"></InputNumber> {{i.content[1]}} <InputNumber v-model="i.p2" size="small" style="width:80px"></InputNumber> {{i.content[2]}}
            </span>
          </Checkbox>
        </CheckboxGroup>
      </Card>
      <div class="clearfloat">
        <Row>
          <Col span="12" style="padding-left:10px;">
          <Button type="primary" icon="android-checkbox-outline"  @click="selectAll" >全部选中</Button>
          <Button type="warning" icon="android-cancel" @click="allCancel" >全部取消</Button>
          </Col>
          <Col span="12" style="text-align:right;padding-right:50px;">
          <Button type="ghost" icon="android-refresh" @click="refreshLoad">重置</Button>
          <Button type="success" icon="filing"  :loading="loading" @click="toSave">保存</Button>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>

import { myMixin } from '@/utils/mixins.js'
export default {
  mixins: [myMixin],
  name: 'home',
  components: {
  },
  data () {
    return {
      agentRisks: [],
      userRisks: [],
      payRisks: [],
      platformRisks: [],

      agentRisksall: [],
      userRisksall: [],
      payRisksall: [],
      platformRisksall: [],

      userRiskConfigs: [],
      agentRiskConfigs: [],
      platformRiskConfigs: [],
      payRiskConfigs: [],

      m1: 0, // 用户频率调用 分钟
      m2: 0, // 代理频率调用 分钟
      m3: 0, // 平台频率调用 分钟
      m4: 0, // 支付频率调用 分钟

      loading: false,
      ruleValidate: {
        MsgTitle: [
          { required: true, message: '标题不能为空!', trigger: 'blur' }
        ],
        MsgContent: [
          { required: true, message: '内容不能为空!', trigger: 'blur' }
        ],
        StartTime: [
          { required: true, message: '请选择开始时间!', trigger: 'change' }
        ],
        EndTime: [
          { required: true, message: '请选择结束时间!', trigger: 'change' }
        ],
        OrderNum: [
          { required: true, message: '请填写排序数字! ', trigger: 'blur' },
          { type: 'number',
            message: '请输入合法的数字!',
            trigger: 'blur',
            transform (value) {
              return Number(value)
            } }

        ]
      }

    }
  },
  computed: {

  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getRisks()
    },
    // 全选
    selectAll () {
      this.userRisks = this.userRisksall
      this.agentRisks = this.agentRisksall
      this.payRisks = this.payRisksall
      this.platformRisks = this.platformRisksall
    },
    // 全部取消
    allCancel () {
      this.userRisks = []
      this.agentRisks = []
      this.payRisks = []
      this.platformRisks = []
    },
    // 重置
    refreshLoad () {
      this.userRisks = []
      this.agentRisks = []
      this.payRisks = []
      this.platformRisks = []

      this.userRisksall = []
      this.agentRisksall = []
      this.payRisksall = []
      this.platformRisksall = []

      this.userRiskConfigs = []
      this.agentRiskConfigs = []
      this.payRiskConfigs = []
      this.platformRiskConfigs = []
      this.getRisks()
    },
    async getRisks () {
      try {
        this.loading = true
        const data = {}
        const result = await this.$store.dispatch('getRiskManagements', data)
        if (result && result.data) {
          result.data.forEach((item) => {
            if (item.type === 1) {
              this.userRiskConfigs.push({
                id: item.id,
                rate_minute: item.rate_minute,
                status: item.status,
                type: item.type,
                content: item.content.split('p'),
                p1: +item.p1,
                p2: +item.p2
              })
              this.m1 = +item.rate_minute
              if (item.status) {
                this.userRisks.push(item.id)
              }
              this.userRisksall.push(item.id)
            }
            if (item.type === 2) {
              this.agentRiskConfigs.push({
                id: item.id,
                rate_minute: item.rate_minute,
                status: item.status,
                type: item.type,
                content: item.content.split('p'),
                p1: +item.p1,
                p2: +item.p2
              })
              this.m2 = +item.rate_minute

              if (item.status) {
                this.agentRisks.push(item.id)
              }
              this.agentRisksall.push(item.id)
            }
            if (item.type === 3) {
              this.platformRiskConfigs.push({
                id: item.id,
                rate_minute: item.rate_minute,
                status: item.status,
                type: item.type,
                content: item.content.split('p'),
                p1: +item.p1,
                p2: +item.p2
              })
              this.m3 = +item.rate_minute

              if (item.status) {
                this.platformRisks.push(item.id)
              }
              this.platformRisksall.push(item.id)
            }
            if (item.type === 4) {
              this.payRiskConfigs.push({
                id: item.id,
                rate_minute: item.rate_minute,
                status: item.status,
                type: item.type,
                content: item.content.split('p'),
                p1: +item.p1,
                p2: +item.p2
              })
              this.m4 = +item.rate_minute

              if (item.status) {
                this.payRisks.push(item.id)
              }
              this.payRisksall.push(item.id)
            }
          })
        }
      } catch (error) {
      }
      this.loading = false
    },
    toSave () {
      this.loading = true
      var a1 = this.userRiskConfigs.map((item) => {
        return {
          id: item.id,
          rate_minute: this.m1,
          status: (this.userRisks.length && (this.userRisks.indexOf(item.id) >= 0)) ? 1 : 0,
          p1: item.p1,
          p2: item.p2
        }
      })

      var a2 = this.agentRiskConfigs.map((item) => {
        return {
          id: item.id,
          rate_minute: this.m2,
          status: (this.agentRisks.length && (this.agentRisks.indexOf(item.id) >= 0)) ? 1 : 0,
          p1: item.p1,
          p2: item.p2
        }
      })

      var a3 = this.platformRiskConfigs.map((item) => {
        return {
          id: item.id,
          rate_minute: this.m3,
          status: (this.platformRisks.length && (this.platformRisks.indexOf(item.id) >= 0)) ? 1 : 0,
          p1: item.p1,
          p2: item.p2
        }
      })

      var a4 = this.payRiskConfigs.map((item) => {
        return {
          id: item.id,
          rate_minute: this.m4,
          status: (this.payRisks.length && (this.payRisks.indexOf(item.id) >= 0)) ? 1 : 0,
          p1: item.p1,
          p2: item.p2
        }
      })
      var data = a1.concat(a2, a3, a4)
      this.update(data)
    },
    async update (data) {
      try {
        await this.$store.dispatch('updateRiskManagements', {riskManage: data})
        this.$Message.success('保存成功!')
        this.refreshLoad()
      } catch (error) {
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.home-main {
  margin: 0 auto;
  width: 1280px;
  .risk-card {
    width: 600px;
    margin: 10px;
    float: left;

    .risk-times {
      background: #f8f9fa;
      padding: 8px 0 8px 36px;
      margin: -16px -16px 0 -16px;
      border-bottom: 1px solid #dcdcdc;
    }
    .checkbox-item {
      display: block;
      margin: 12px;
      padding-bottom: 10px;
      border-bottom: 1px dashed #dcdcdc;
    }
  }
  .clearfloat {
    clear: both;
    height: 50px;
    line-height: 50px;
  }
}
</style>

<style lang="less">
.risk-card {
  .ivu-card-head {
    background: #dee2e6;
    opacity: .8;
  }
}
</style>
