<template>
  <div>

    <Card>
      <p slot="title">提交结算</p>
      <div style="margin:0 auto;width:400px;">
        <Form label-position="right" :label-width="120" :model="addRow" ref="formValidate" :rules="ruleValidate">

          <FormItem label="可结算余额:" class="">
            {{fCurMoney}}
          </FormItem>
          <FormItem label="结算金额:" prop="money">
            <Input v-model="addRow.money" style="width:200px" placeholder="" clearable></Input>
          </FormItem>
          <FormItem label="收款支付宝:" class="">
            {{szAliPay}}
          </FormItem>
          <FormItem label="支付宝实名:" class="">
            {{szRealName}}
          </FormItem>
          <FormItem label="结算密码:" prop="SettlePwd">
            <Input type="password" v-model="addRow.SettlePwd" style="width:200px" placeholder="" clearable></Input>
          </FormItem>
          <FormItem label="代理检验码:" prop="szCode">
            <Input v-model="addRow.szCode" style="width:200px" placeholder="" clearable></Input>
          </FormItem>
          <FormItem>
            <Button type="warning" @click="init()">取消</Button>
            &nbsp; &nbsp; &nbsp; &nbsp;
            <Button type="primary" @click="toAdd('formValidate')" :loading="loading">提交结算</Button>
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
    const validateCheck = (rule, value, callback) => {
      if (value === '' || value.toString().trim() === '' || value === 0 || value === '0') {
        callback(new Error('结算金额不能为空！'))
      } else if (value > this.fCurMoney) {
        callback(new Error('结算金额不能超过当前可结算金额!'))
      } else {
        callback()
      }
    }
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
        money: [
          { required: true, message: '结算金额不能为空!', trigger: 'blur' },
          { type: 'number',
            message: '请输入合法的数字!',
            trigger: 'blur',
            transform (value) {
              return Number(value)
            } },
          { validator: validateCheck, trigger: 'change' }
        ],
        szCode: [
          { required: true, message: '验证码不能为空!', trigger: 'blur' }
        ]

      }
    }
  },
  mounted () {
    // this.init();
  },
  computed: {
    fCurMoney: () => {
      return getKey('fCurMoney')
    },
    szAliPay: () => {
      return getKey('szAliPay')
    },
    szRealName: () => {
      return getKey('szRealName')
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
    toAdd (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.add(this.addRow)
        }
      })
    },
    async add (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('insertSettlement', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.showAdd = false
          this.$Message.success('操作成功!')
          this.handleReset('formValidate')
        }
      } catch (error) {
      }
      this.loading = false
    }

  }
}
</script>

<style lang="less" scoped>
.margin-top-10 {
  margin-top: 10px;
}
</style>
