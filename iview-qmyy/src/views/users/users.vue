<template>
  <div>
    <Row :gutter="16">
      <Col span="4">
      <Button @click="showAddModal"
              type="primary">新增用户</Button>
      </Col>
      <Col :xs="{ span: 14, offset: 2 }"
           :sm="{ span: 8, offset: 8}"
           :md="{ span: 6, offset: 10 }"
           :lg="{ span: 4, offset: 12 }">
      <Form label-position="right"
            :label-width="60">
        <FormItem label="用户名:"
                  class="">
          <Input type="text"
                 v-model="query.name"
                 placeholder="Enter user name"></Input>
        </FormItem>
      </Form>
      </Col>
      <Col span="4">
      <Button type="primary"
              @click="toQuery"
              :loading="queryLoading"
              icon="ios-search">查询</Button>
      </Col>
    </Row>

    <Table :loading="queryLoading" @on-sort-change="sortChange"
           border
           ref="selection"
           :columns="columns"
           :data="tableDatas"
           stripe
           @on-select-all="selectAlldata"></Table>

    <Page :total="total" :page-size-opts="[20,50,100]"
          :current="page"
          class-name="margin-top-10"
          @on-page-size-change="pageSizeChange"
          @on-change="pageChange"
          size="small"
          show-total
          show-elevator
          show-sizer
          :page-size="20"
          class="margin-top-10"></Page>

    <Modal v-model="showEdit"
           title="编辑用户信息"
           @on-ok="toEdit"
           @on-cancel="cancel"
           width="480">
      <Form :model="editRow"
            ref="editFormValidate"
            label-position="right"
            :label-width="140">
        <FormItem label="用户名"
                  prop="name">
          <Input v-model="editRow.name"
                 style="width:200px"
                 disabled></Input>
        </FormItem>
        <FormItem label="邮箱"
                  prop="email"
                  :rules="{ required: true, message: '请输入邮箱地址', trigger: 'blur' }">
          <Input v-model="editRow.email"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="昵称"
                  prop="nickname">
          <Input v-model="editRow.nickname"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="网站地址">
          <Input v-model="editRow.website"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="描述">
          <Input v-model="editRow.description"
                 style="width:200px"
                 type="textarea"
                 :autosize="{minRows: 2,maxRows: 4}"></Input>
        </FormItem>

      </Form>
    </Modal>

    <Modal v-model="showAdd"
           title="新增用户"
           width="480">
      <Form :model="addRow"
            ref="formValidate"
            :rules="ruleValidate"
            label-position="right"
            :label-width="140">
        <FormItem label="用户名"
                  prop="name">
          <Input v-model="addRow.name"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="邮箱"
                  prop="email">
          <Input v-model="addRow.email"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="密码"
                  prop="password">
          <Input v-model="addRow.password"
                 type="password"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="确认密码"
                  prop="password_confirm">
          <Input v-model="addRow.password_confirm"
                 type="password"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="昵称"
                  prop="nickname">
          <Input v-model="addRow.nickname"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="网站地址"
                  prop="website">
          <Input v-model="addRow.website"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="描述"
                  prop="description">
          <Input v-model="addRow.description"
                 style="width:200px"
                 type="textarea"
                 :autosize="{minRows: 2,maxRows: 4}"
                 placeholder="Enter something..."></Input>
        </FormItem>
      </Form>
      <div slot="footer"
           style="color:#f60;text-align:center">
        <Button type="default"
                @click="cancel">取消</Button>
        <Button type="primary"
                @click="toAdd('formValidate')"
                :loading="loading">保存</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '' || value.toString().trim() === '') {
        callback(new Error('Please enter your password'))
      } else {
        if (this.addRow.password_confirm !== '') {
          // 对第二个密码框单独验证
          this.$refs.formValidate.validateField('password_confirm')
        }
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '' || value.toString().trim() === '') {
        callback(new Error('Please enter your password again'))
      } else if (value !== this.addRow.password) {
        callback(new Error('The two input passwords do not match!'))
      } else {
        callback()
      }
    }
    return {
      queryLoading: false,
      loading: false,
      query: { name: '' },
      page: 1,
      per_page: 20,
      total: 0,
      showEdit: false,
      showAdd: false,
      addRow: {},
      editRow: {},
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'ID',
          width: 60,
          key: 'id'
        },
        {
          title: '头像',
          width: 80,
          key: 'avatar',
          render: (h, params) => {
            return h('div', [
              h('Avatar', {
                props: {
                  src: params.row.avatar,
                  shape: 'square',
                  size: 'large'
                }
              })
            ])
          }
        },
        {
          title: '用户名',
          key: 'name'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '状态',
          key: 'status',
          width: 90,
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: params.row.status === 1,
                  size: 'large'
                },
                scopedSlots: {
                  open: () => {
                    return '启用'
                  },
                  close: () => {
                    return '禁用'
                  }
                },
                on: {
                  'on-change': status => {
                    this.changeStatus(params.index)
                  }
                }
              })
            ])
          }
        },
        {
          title: '创建时间',
          key: 'created_at'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    icon: 'compose',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showEditModal(params.index)
                    }
                  }
                },
                '编辑'
              )
            ])
          }
        }
      ],
      tableDatas: [],

      ruleValidate: {
        name: [
          { required: true, message: 'The name cannot be empty', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' },
          { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please enter your password', trigger: 'blur' },
          { validator: validatePass, trigger: 'change' }
        ],
        password_confirm: [
          { required: true, message: 'Please enter your password again', trigger: 'blur' },
          { validator: validatePassCheck, trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    // this.init();
  },
  computed: {},
  methods: {
    init () {
      this.queryList()
    },
    pageChange (page) {
      this.page = page
      this.queryList()
    },
    pageSizeChange (perPage) {
      if (this.per_page !== perPage) {
        this.per_page = perPage
        this.queryList()
      }
    },
    async queryList () {
      try {
        this.queryLoading = true

        const data = {
          page: this.page,
          per_page: this.per_page,
          name: this.query.name
        }
        const result = await this.$store.dispatch('GetUserList', data)
        this.queryLoading = false
        this.tableDatas = result.data
        this.total = result.meta.total
      } catch (error) {
        const response = error.response
        if (response) {
          if (response.status === 401) {
            this.$Message.error('你没有权限!')
          }
          if (response.status === 500) {
            this.$Message.error('系统繁忙，请稍后再试!')
          }
        }
      }
    },
    changeStatus (index) {
      const data = { id: this.tableDatas[index].id, status: this.tableDatas[index].status === 1 ? 0 : 1 }
      this.saveEdit(data)
    },
    show (index) {
      this.modal1 = true
      this.$Message.info('当前查看索引' + index)
      this.editRow = this.tableDatas[index]
      console.log(this.editRow)
    },
    selectAlldata (datas) {
      this.$Message.success('选择了全部')
      console.log(datas)
    },
    showAddModal () {
      this.showAdd = true
    },
    toAdd (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.add(this.addRow)
        } else {
          // this.$Message.error('Fail!')
        }
      })
    },
    async add (data) {
      try {
        this.loading = true
        await this.$store.dispatch('AddUser', data)
        this.loading = false
        this.showAdd = false
        this.$Message.success('添加成功!')
        this.toQuery()
      } catch (error) {
        const response = error.response
        if (response) {
          if (response.status === 401) {
            this.$Message.error('你没有权限!')
          }
          if (response.status === 500) {
            this.$Message.error('系统繁忙，请稍后再试!')
          }
        }
      }
    },
    showEditModal (index) {
      this.showEdit = true
      this.editRow = { ...this.tableDatas[index] }
    },
    toEdit () {
      this.saveEdit(this.editRow)
    },
    async saveEdit (data) {
      try {
        this.loading = true
        await this.$store.dispatch('UpdateUser', data)
        this.loading = false
        this.$Message.success('修改成功!')
        this.toQuery()
      } catch (error) {
        const response = error.response
        if (response) {
          if (response.status === 401) {
            this.$Message.error('你没有权限!')
          }
          if (response.status === 500) {
            this.$Message.error('系统繁忙，请稍后再试!')
          }
        }
      }
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    cancel () {
      console.log('cancel')
    },
    toQuery () {
      this.queryList()
    }

  }
}
</script>

<style lang="less" scoped>
.margin-top-10 {
  margin-top: 10px;
}
</style>
