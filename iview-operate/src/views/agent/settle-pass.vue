<template>
  <div>

    <Card>
      <p slot="title">结算密码</p>
      <div style="margin:0 auto;width:400px;">
        <Form label-position="right" :label-width="120" :model="editRow" ref="formValidate" :rules="ruleValidate">

          <FormItem label="当前结算密码:" prop="oldSettlePwd">
            <Input type="password" v-model="editRow.oldSettlePwd" style="width:200px" placeholder="" clearable></Input>
          </FormItem>
          <FormItem label="新密码:" prop="newSettlePwd">
            <Input type="password" v-model="editRow.newSettlePwd" style="width:200px" placeholder="" clearable></Input>
          </FormItem>
          <FormItem label="重复新密码:" prop="newSettlePwd2">
            <Input type="password" v-model="editRow.newSettlePwd2" style="width:200px" placeholder="" clearable></Input>
          </FormItem>
          <FormItem label="代理检验码:" prop="szCode">
            <Input v-model="editRow.szCode" style="width:200px" placeholder="" clearable></Input>
          </FormItem>
          <FormItem label="代理ID:" prop="AgencyID">
            <Input v-model="editRow.AgencyID" style="width:200px" placeholder="" clearable></Input>
          </FormItem>
          <FormItem>
            <Button type="warning" @click="init()">取消</Button>
            &nbsp; &nbsp; &nbsp; &nbsp;
            <Button type="primary" @click="toEdit('formValidate')" :loading="loading">保存</Button>
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
    const validatePass = (rule, value, callback) => {
      if (value === '' || value.toString().trim() === '') {
        callback(new Error('请输入密码！'))
      } else {
        if (this.editRow.newSettlePwd2 !== '') {
          // 对第二个密码框单独验证
          this.$refs.formValidate.validateField('newSettlePwd2')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '' || value.toString().trim() === '') {
        callback(new Error('请再次输入密码！'))
      } else if (value !== this.editRow.newSettlePwd) {
        callback(new Error('两次密码输入不一致!'))
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
        oldSettlePwd: [
          { required: true, message: '当前结算密码不能为空!', trigger: 'blur' }
        ],
        newSettlePwd: [
          { required: true, message: '新密码不能为空！', trigger: 'blur' },
          { validator: validatePass, trigger: 'change' }
        ],
        newSettlePwd2: [
          { required: true, message: '请再次输入密码！', trigger: 'blur' },
          { validator: validatePassCheck, trigger: 'change' }
        ],
        szCode: [
          { required: true, message: '验证码不能为空!', trigger: 'blur' }
        ],
        AgencyID: [
          { required: true, message: '代理ID不能为空!', trigger: 'blur' },
          { type: 'number',
            message: '请输入合法的数字!',
            trigger: 'change',
            transform (value) {
              return Number(value)
            } }
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
    toEdit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.saveEdit(this.editRow)
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
