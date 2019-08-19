<template>
  <div>

    <Card style="width:780px;">
      <p slot="title">POST-URL请求接口</p>
      <div style="margin:0 auto;">
        <Form label-position="right" :label-width="100" :model="editRow" ref="formValidate" :rules="ruleValidate">

          <FormItem label="请求url:" prop="url">
            <Input v-model="editRow.url" style="width:420px" placeholder="例如:http://www.xxyy.zzz" clearable></Input>       &nbsp;&nbsp;
             <Button type="success" @click="toEdit('formValidate')" :loading="loading">发送</Button>
            <Button @click="handleReset('formValidate')">全部清空</Button>
          </FormItem>
          <FormItem label="请求类型:" prop="type">
<Select v-model="editRow.type" style="width:200px">
        <Option v-for="item in types" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>          </FormItem>
          <FormItem label="post参数:" prop="paramsStr">
            <Input type='textarea' v-model="editRow.paramsStr" :autosize="{minRows: 5,maxRows: 6}" style="width:420px" :placeholder="postExampleStr"></Input>
          </FormItem>

          <FormItem label="请求响应:">
            <Input type='textarea' v-model="result" :autosize="{minRows: 4,maxRows: 4}" style="width:420px" readonly></Input>
          </FormItem>
        </Form>
      </div>

    </Card>
  </div>
</template>
<script>

export default {
  data () {
    return {
      loading: false,
      types: [ {label: 'multipart/form-data', value: 'form-data'}, {label: 'application/json', value: 'json'}, {label: 'application/x-www-form-urlencoded', value: 'form'} ],
      result: '',
      editRow: {
        url: '',
        paramsStr: '',
        type: 'json'
      },
      ruleValidate: {
        url: [
          { required: true, message: '请求url不能为空!', trigger: 'blur' }
        ],
        paramsStr: [
          { required: true, message: 'post参数不能为空!', trigger: 'blur' }
        ]

      }
    }
  },
  computed: {
    postExampleStr: function () {
      return this.editRow.type === 'form' ? '例如:param1=a&param2=b&param3=c' : '例如:{"key1":"value1","key2":"value2"}'
    }
  },
  mounted () {

  },
  methods: {
    handleReset (name) {
      this.$refs[name].resetFields()
      this.result = ''
    },
    toEdit (name) {
      this.result = ''
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.saveEdit(this.editRow)
        }
      })
    },
    async saveEdit (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('toSendRequest', data)
        console.log(res)
        this.result = JSON.stringify(res)
        if (res.code === 200 && res.success === 'success') {
          this.$Message.success('请求成功!')
        }
        if (res.code === 200 && res.success && res.success !== 'success') {
          this.$Message.error(res.success)
        }
        if (res.success === false) {
          this.$Message.error('请求失败')
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
