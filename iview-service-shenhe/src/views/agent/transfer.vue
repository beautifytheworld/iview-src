<template>
  <div>

    <Card>
      <p slot="title">给玩家上分</p>
      <div style="margin:0 auto;width:400px;">
        <Form label-position="right" :label-width="120" :model="addRow" ref="formValidate" :rules="ruleValidate">

          <FormItem label="商人ID:" class="">
            123456
          </FormItem>
          <FormItem label="注册时间:" class="">
            123456
          </FormItem>
          <FormItem label="库存金币:" class="">
            {{bankMoney}}
          </FormItem>

          <hr/>
          <br/>
          <FormItem label="玩家ID:" prop="UserID">
            <Input v-model="addRow.UserID" style="width:200px" placeholder="收款玩家游戏ID" clearable></Input>
          </FormItem>
          <FormItem label="转入金币:" prop="money">
            <Input v-model="addRow.money" style="width:200px" placeholder="转入金币" clearable></Input>
          </FormItem>
          <FormItem :label-width="70">
            <CheckboxGroup v-model="checkboxs">
              <Checkbox label="1">玩家ID核对无误</Checkbox>
              <Checkbox label="2">转入金额核对无误</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="toAdd('formValidate')" :loading="loading">确认转账</Button>
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
        callback(new Error('转入数量不能为空！'))
      } else if (value > this.bankMoney) {
        callback(new Error('转账金币不能超过库存金币!'))
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
            trigger: 'blur',
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
  },
  computed: {
    bankMoney: () => {
      return getKey('bankMoney')
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
          if (this.checkboxs.length === 2) {
            this.add(this.addRow)
          } else {
            this.$Message.error('请勾选确认玩家ID以及转入金额!')
          }
        }
      })
    },
    async add (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('insertTransfer', data)
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
