<template>
  <div>

    <Card>
      <p slot="title">账号设置</p>
      <div style="margin:0 auto;width:400px;">
        <Form label-position="right" :label-width="120" :model="editRow" ref="formValidate" :rules="ruleValidate">

          <FormItem label="管理员账号:" class="">
            <Input v-model="editRow.AccountName" style="width:200px" placeholder="" disabled></Input>
          </FormItem>
          <FormItem label="昵称:" prop="NickName">
            <Input v-model="editRow.NickName" style="width:200px" placeholder="" clearable></Input>
          </FormItem>
          <FormItem label="密码:" prop="Pwd">
            <Input type="password" v-model="editRow.Pwd" style="width:200px" placeholder="" clearable></Input>
          </FormItem>
          <FormItem label="确认密码:" prop="Pwd_confirm">
            <Input type="password" v-model="editRow.Pwd_confirm" style="width:200px" placeholder="" clearable></Input>
          </FormItem>

          <FormItem :label-width="160">
            <Button type="primary" @click="toEdit('formValidate')" :loading="loading">保 存</Button>
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
        if (this.editRow.Pwd_confirm !== '') {
          // 对第二个密码框单独验证
          this.$refs.formValidate.validateField('Pwd_confirm')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '' || value.toString().trim() === '') {
        callback(new Error('请再次输入密码！'))
      } else if (value !== this.editRow.Pwd) {
        callback(new Error('两次密码输入不一致!'))
      } else {
        callback()
      }
    }
    return {
      labelWidth: 0,
      queryLoading: false,
      btTypes: ['ghost', 'ghost', 'ghost'],
      loading: false,
      query: { userid: '' },
      datasTime: [],
      page: 1,
      per_page: 10,
      total: 0,
      showEdit: false,
      showAdd: false,
      addRow: {},
      editRow: {},
      checkboxs: [],
      columns: [
      ],
      tableDatas: [],
      ruleValidate: {
        AccountName: [
          { required: true, message: '账号不能为空！', trigger: 'blur' }
        ],
        NickName: [
          { required: true, message: '昵称不能为空！', trigger: 'blur' }
        ],
        Pwd: [
          { required: true, message: '请输入密码！', trigger: 'blur' },
          { validator: validatePass, trigger: 'change' }
        ],
        Pwd_confirm: [
          { required: true, message: '请再次输入密码！', trigger: 'blur' },
          { validator: validatePassCheck, trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.editRow = { AccountName: getKey('user_name'), NickName: getKey('szNickName') }
  },
  computed: {
    szUser: () => {
      return getKey('user_name')
    },
    szNickName: () => {
      return getKey('szNickName')
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
          this.edit(this.editRow)
        }
      })
    },
    async edit (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('updateGMAccount', data)
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
