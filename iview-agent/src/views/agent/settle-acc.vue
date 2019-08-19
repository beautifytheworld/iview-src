<template>
  <div>

    <Card>
      <p slot="title">结算账户</p>
      <div style="margin:0 auto;width:400px;">
        <Form label-position="right" :label-width="120" :model="editRow" ref="formValidate" :rules="ruleValidate">
       <FormItem label=""  :label-width="1">

       <Alert type="warning" show-icon>
        提示：账户中如果包含 * 则确认修改时不会保存！
       </Alert> </FormItem>
          <FormItem label="结算支付宝账户:" prop="AliPay">
            <Input v-model="editRow.AliPay" style="width:200px" placeholder="" clearable></Input>
          </FormItem>
          <FormItem label="结算银行卡账户:" prop="UnionCard">
            <Input v-model="editRow.UnionCard" style="width:200px" placeholder="" clearable></Input>
          </FormItem>
          <FormItem label="账户实名:" prop="RealName">
            <Input v-model="editRow.RealName" style="width:200px" placeholder="" clearable></Input>
          </FormItem>
          <FormItem label="手机:" prop="Mobile">
            <Input v-model="editRow.Mobile" style="width:200px" placeholder="" clearable></Input>
          </FormItem>
          <FormItem label="身份证:" prop="IDCard">
            <Input v-model="editRow.IDCard" style="width:200px" placeholder="" clearable></Input>
          </FormItem>
          <FormItem label="开户行省/市:" prop="BankProvince">
            <al-cascader  data-type="name"  v-model="resArr" level="1" style="width:200px"/>
          </FormItem>
          <FormItem label="开户支行名:" prop="BankName">
            <Input v-model="editRow.BankName" style="width:200px" placeholder="" clearable></Input>
          </FormItem>
          <!-- <FormItem label="验证码:" prop="szCode">
            <Input v-model="editRow.szCode" style="width:200px" placeholder="" clearable></Input>
          </FormItem>
          <FormItem label="代理ID:" prop="AgencyID">
            <Input v-model="editRow.AgencyID" style="width:200px" placeholder="" clearable></Input>
          </FormItem> -->

          <FormItem>
            <Button type="warning" @click="init()">取消</Button>
            &nbsp; &nbsp; &nbsp; &nbsp;
            <Button type="primary" @click="toEdit('formValidate')" :loading="loading">确认修改</Button>
          </FormItem>

        </Form>
      </div>

    </Card>
  </div>
</template>
<script>
import { myMixin } from '@/utils/mixins.js'
import { getKey } from '@/utils/auth'

export default {
  mixins: [myMixin],
  data () {
    return {
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
      editRow: {resArr: []},
      resArr: [],
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
        // AliPay: [
        //   { required: true, message: '结算支付宝账户不能为空!', trigger: 'blur' }
        // ],
        RealName: [
          { required: true, message: '账户实名不能为空!', trigger: 'blur' }
        ]
        // szCode: [
        //   { required: true, message: '验证码不能为空!', trigger: 'blur' }
        // ],
        // AgencyID: [
        //   { required: true, message: '代理ID不能为空!', trigger: 'blur' },
        //   { type: 'number',
        //     message: '请输入合法的数字!',
        //     trigger: 'change',
        //     transform (value) {
        //       return Number(value)
        //     } }
        // ]

      }
    }
  },
  mounted () {
    // this.init();
    this.queryMoney()
  },
  computed: {
    user_name: () => {
      return getKey('user_name')
    }
  },
  methods: {
    init () {
      this.handleReset('formValidate')
    },
    handleReset (name) {
      this.$refs[name].resetFields()
      this.checkboxs = []
    },
    toEdit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.editRow.AliPay || this.editRow.UnionCard) {
            var tmpData = {
              RealName: this.editRow.RealName
            }
            if (this.editRow.UnionCard) {
              if (!this.editRow.UnionCard.includes('*')) {
                tmpData.UnionCard = this.editRow.UnionCard
              }
            }
            if (this.editRow.AliPay) {
              if (!this.editRow.AliPay.includes('*')) {
                tmpData.AliPay = this.editRow.AliPay
              }
            }
            if (this.editRow.IDCard) {
              tmpData.IDCard = this.editRow.IDCard
            }
            if (this.editRow.Mobile) {
              if (!this.editRow.Mobile.includes('*')) {
                tmpData.Mobile = this.editRow.Mobile
              }
            }
            if (this.resArr.length === 2) {
              tmpData.BankProvince = this.resArr[0]
              tmpData.BankCity = this.resArr[1]
            }
            if (this.resArr.length === 1) {
              tmpData.BankProvince = this.resArr[0]
            }
            // if (this.editRow.BankProvince) {
            //   tmpData.BankProvince = this.editRow.BankProvince
            // }
            // if (this.editRow.BankCity) {
            //   tmpData.BankCity = this.editRow.BankCity
            // }
            if (this.editRow.BankName) {
              tmpData.BankName = this.editRow.BankName
            }

            this.saveEdit(tmpData)
          } else {
            this.$Message.error('支付宝账户或银行账户至少填一个!')
          }
        }
      })
    },
    async saveEdit (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('updateAgentAccountSettle', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.$Message.success('操作成功!')
          this.handleReset('formValidate')
          setTimeout(() => {
            this.queryMoney()
          }, 2000)
        }
      } catch (error) {
      }
      this.loading = false
    },
    async queryMoney () {
      const result = await this.$store.dispatch('getAgentList', {minIndex: 0, maxIndex: 1, AgencyID: this.user_name})
      const res = this.handleResult(result)
      let tableDatas = res.tableDatas
      let agent = tableDatas[0]
      this.editRow = {
        AliPay: agent.AliPay,
        UnionCard: agent.UnionCard,
        RealName: agent.RealName,
        Mobile: agent.Mobile,
        IDCard: agent.IDCard,
        // BankProvince: agent.BankProvince,
        // BankCity: agent.BankCity,
        BankName: agent.BankName
      }
      this.resArr = [agent.BankProvince, agent.BankCity]
    }

  }
}
</script>

<style lang="less" scoped>
.margin-top-10 {
  margin-top: 10px;
}
</style>
