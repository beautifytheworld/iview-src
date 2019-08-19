
<template>
    <div class="setting-main">
        <div class="setting-top">
            <div class="top-title">
                <span class="title">
                    <span style="background:#1abc9c;">&nbsp;</span>
                    &nbsp; 充值功能配置
                </span>
                <Button icon="loop" :loading="loading" @click="toLoading" class="title-refresh">刷新</Button>
            </div>
        </div>
        <div class="setting-data">
            <Table :loading="queryLoading" @on-sort-change="sortChange" border ref="selection" :columns="columns" :data="tableDatas" stripe></Table>

        </div>
        <!-- <div style="text-align:right;padding:10px;">
            <Button>取消修改</Button>
            <Button type="primary">提交修改</Button>
        </div> -->

     <Modal v-model="showEdit" title="修改充值配置" width="580" >
      <Form :model="editRow" ref="editFormValidate" label-position="right" :label-width="120">

        <FormItem label="pkid">
          <Input v-model="editRow.pkid" style="width:200px" disabled></Input>
        </FormItem>
        <FormItem label="请求地址">
          <Input v-model="editRow.ChannelURL" style="width:360px"></Input>
        </FormItem>
        <FormItem label="回调地址">
          <Input v-model="editRow.ChannelCallbackURL" style="width:360px"></Input>
        </FormItem>
        <FormItem label="商户名">
          <Input v-model="editRow.MerchandID" style="width:360px"></Input>
        </FormItem>

      </Form>
      <div slot="footer" style="color:#f60;text-align:center">
        <Button type="default" @click="cancel">取消</Button>
        <Button type="primary" @click="toEdit" :loading="loading">确定</Button>
      </div>
    </Modal>
    </div>

</template>

<script>
import { myMixin } from '@/utils/mixins.js'
export default {
  mixins: [myMixin],
  components: {

  },
  data () {
    return {
      modal5: false,
      loading: false,
      showEdit: false,
      editRow: {},
      queryLoading: false,
      query: {},
      arrTitles: [],
      arrDatas: [],
      page: 1,
      per_page: 100,
      title: '',
      content: '',
      columns: [],
      tableDatas: []
    }
  },
  computed: {

  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.page = 1
      this.per_page = 30
      this.queryList()
    },
    sortChange (obj) {
      this.query.order_by = obj.key + ' ' + obj.order
      this.queryList()
    },
    async queryList () {
      try {
        this.loading = true
        const data = {...this.query}
        const result = await this.$store.dispatch('getRechargeChannel', data)
        const res = this.handleResult(result)
        this.columns = []
        let columnTitles = res.arrTitles
        let columnKeys = res.arrKeys
        for (let i = 0; i < columnKeys.length; i++) {
          let obj = {
            title: columnTitles[i],
            sortable: 'custom',
            minWidth: 120,
            align: 'center',
            key: columnKeys[i]
          }

          if (obj.key === 'Status') {
            obj.render = (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    value: (params.row.Status === '1' || params.row.Status === 1),
                    size: 'large'
                  },
                  scopedSlots: {
                    open: () => {
                      return '开启'
                    },
                    close: () => {
                      return '关闭'
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
          }

          this.columns.push(obj)
        }
        this.columns.push({
          title: '操作',
          key: 'action',
          // fixed: 'right',
          align: 'center',
          width: 160,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'success',
                    icon: 'compose',
                    size: 'small'
                  },
                  style: {
                    marginRight: '2px'
                  },
                  on: {
                    click: () => {
                      this.showEditModal(params.index)
                    }
                  }
                }, '编辑'
              )
            ])
          }
        })
        this.tableDatas = res.tableDatas
        this.total = res.total
      } catch (error) {
      }
      this.loading = false
    },
    toLoading () {
      this.init()
    },
    cancel () {
      this.showEdit = false
    },
    showEditModal (index) {
      this.showEdit = true
      this.editRow = { ...this.tableDatas[index] }
    },
    toEdit () {
      this.saveEdit({
        pkid: this.editRow.pkid,
        ChannelCallbackURL: this.editRow.ChannelCallbackURL,
        ChannelURL: this.editRow.ChannelURL,
        MerchandID: this.editRow.MerchandID
      })
    },
    changeStatus (index) {
      const data = { pkid: this.tableDatas[index].pkid, Status: (this.tableDatas[index].Status === '1' || this.tableDatas[index].Status === 1) ? '0' : '1' }
      this.saveEdit(data)
    },
    async saveEdit (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('updateRechargeChannel', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.$Message.success('修改成功!')
          this.showEdit = false
          this.init()
        }
      } catch (error) {
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.setting-main {
  margin: 0 auto;
  width: 1280px;
  .setting-top {
    height: 40px;
    line-height: 40px;
    background: #ebebeb;
    margin: 0 auto;
    .top-title {
      width: 1260px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      .title {
        flex: 0 0 100px;
        font-size: 13px;
        color: #999;
      }
      .title-refresh {
        flex: 0 0 50px;
        margin-top: 5px;
        height: 30px;
      }
    }
  }
  .setting-data {
    margin: 10px 0;
  }
}
</style>
