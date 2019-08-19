<template>
  <div>

    <Card>
      <p slot="title">给玩家上分</p>
      <div style="margin:0 auto;width:480px;">
        <Form label-position="right" :label-width="120" :model="addRow" ref="formValidate" :rules="ruleValidate">

          <FormItem label="商人ID:" class="">
            {{szBindID}}
          </FormItem>
          <FormItem label="库存金币:" class="">
            {{bankMoney}}
          </FormItem>

          <hr/>
          <br/>
          <FormItem label="玩家ID:" prop="UserID">
            <Input v-model="addRow.UserID" style="width:160px" placeholder="收款玩家游戏ID" clearable></Input>
          </FormItem>
          <FormItem label="转入金币:" prop="money">
            <Input v-model="addRow.money" style="width:160px" placeholder="转入金币" clearable></Input>
            <span style="color:#f00">{{numToRMB(addRow.money)}}</span>
          </FormItem>
          <FormItem :label-width="70">
            <CheckboxGroup v-model="checkboxs">
              <Checkbox label="1">玩家ID核对无误</Checkbox>
              <Checkbox label="2">转入金额核对无误</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="toOk('formValidate')" >确认转账</Button>
          </FormItem>

        </Form>
      </div>

    </Card>

     <Modal v-model="okModal" width="400">
        <p slot="header" style="color:#2d8cf0;text-align:center">
            <Icon type="information-circled"></Icon>
            <span>请确认信息是否正确？</span>
        </p>
        <div style="text-align:center">
            <p style="font-size:14px;">玩家ID:{{addRow.UserID}}</p>
            <p style="font-size:14px;">转入金币:{{addRow.money}}</p>
        </div>
        <div slot="footer">
            <Button type="primary" size="large" long :loading="loading" @click="toAdd">确认</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
import { myMixin } from '@/utils/mixins.js'
import { moneyUppercase } from '@/utils/validate.js'
import { getKey } from '@/utils/auth'
export default {
  mixins: [myMixin],
  data () {
    const validateCheck = (rule, value, callback) => {
      if (value === '' || value.toString().trim() === '' || value === 0 || value === '0') {
        callback(new Error('转入数量不能为空！'))
      } else {
        callback()
      }
    }
    return {
      bankMoney: '',
      acMoney: '',
      okModal: false,
      labelWidth: 0,
      queryLoading: false,
      btTypes: ['ghost', 'ghost', 'ghost', 'ghost'],
      loading: false,
      query: { userid: '' },
      datasTime: [],
      page: 1,
      per_page: 20,
      total: 0,
      showEdit: false,
      showAdd: false,
      addRow: {},
      editRow: {},
      checkboxs: [],
      columns: [
        {
          title: 'userid',
          width: 160,
          key: 'userid'
        },
        {
          title: '原因',
          key: 'LogUse'
        },
        {
          title: '变化值',
          key: 'LogValue'
        },
        {
          title: '变化后',
          key: 'AfterValue'
        },
        {
          title: '记录时间',
          width: 160,
          key: 'RecordTime'
        }

      ],
      tableDatas: [],
      ruleValidate: {
        UserID: [
          { required: true, message: '玩家ID不能为空!', trigger: 'blur' }
        ],
        money: [
          { required: true, message: '转入数量不能为空!', trigger: 'blur' },
          { type: 'number',
            message: '请输入合法的数字!',
            trigger: 'change',
            transform (value) {
              return Number(value)
            } },
          { validator: validateCheck, trigger: 'change' }

        ]

      }
    }
  },
  mounted () {
    // this.init();
    this.queryMoney()
  },
  computed: {
    szBindID: () => {
      return getKey('szBindID')
    },
    user_name: () => {
      return getKey('user_name')
    }
  },
  methods: {
    numToRMB (num) {
      if (num && Number(num)) {
        return moneyUppercase(num)
      }
    },
    init () {
      this.handleReset('formValidate')
    },
    handleReset (name) {
      this.$refs[name].resetFields()
      this.checkboxs = []
    },
    toOk (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.checkboxs.length !== 2) {
            this.$Message.error('请勾选确认玩家ID以及转入金额!')
          } else {
            this.okModal = true
          }
        }
      })
    },
    toAdd () {
      this.add(this.addRow)
    },
    async add (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('insertTransfer', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.okModal = false

          this.handleReset('formValidate')
          this.$Spin.show({
            render: (h) => {
              return h('div', [
                h('Icon', {
                  'class': 'demo-spin-icon-load',
                  props: {
                    type: 'load-c',
                    size: 18
                  }
                }),
                h('div', '转账中...')
              ])
            }
          })
          setTimeout(() => {
            this.$Spin.hide()
            this.$Message.success('操作成功!')
            this.queryMoney()
          }, 5000)
        }
      } catch (error) {
      }
      this.loading = false
    },
    async queryMoney () {
      const result = await this.$store.dispatch('getAgentList', { minIndex: 0, maxIndex: 1, AgencyID: this.user_name })
      const res = this.handleResult(result)
      let tableDatas = res.tableDatas
      let agent = tableDatas[0]
      this.bankMoney = agent.acMoney
    }

  }
}
</script>
<style>
  .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
</style>

<style lang="less" scoped>
.margin-top-10 {
  margin-top: 10px;
}

</style>
