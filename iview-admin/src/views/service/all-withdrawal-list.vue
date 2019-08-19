<template>
    <div>
        <Form label-position="right" :label-width="70" inline>
            <FormItem label="玩家ID:" class="">
                <Input clearable type="text" v-model="query.user_id" placeholder="填写玩家ID"></Input>
            </FormItem>
            <!-- <FormItem label="时间选择:" class="">
              <Button :type="btTypes[0]" @click="changeDate(1)" size="small">今天</Button>
              <Button :type="btTypes[1]" @click="changeDate(7)" size="small">近一周</Button>
              <Button :type="btTypes[2]" @click="changeDate(30)" size="small">近一月</Button>
              <DatePicker @on-change="pickerChange" @on-clear="clearDate" :value="datasTime" format="yyyy/MM/dd" type="daterange" clearable placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
            </FormItem> -->

            <FormItem :label-width="1">
                <Button type="primary" @click="toQuery" :loading="queryLoading" icon="ios-search">查询</Button>
            </FormItem>

        </Form>
        <Table :loading="queryLoading" border ref="selection" :columns="columns" :data="tableDatas" stripe></Table>

        <Page :total="total" :page-size-opts="[20,50,100]" :current="page" class-name="margin-top-10" @on-page-size-change="pageSizeChange" @on-change="pageChange" size="small" show-total show-elevator show-sizer :page-size="20" class="margin-top-10"></Page>

    </div>
</template>
<script>
    import { myMixin } from '@/utils/mixins.js'
    import { mapGetters } from 'vuex'

    // import axios from 'axios'
    export default {
        mixins: [myMixin],
        data () {
            return {
                box: '',
                queryLoading: false,
                btTypes: ['ghost', 'ghost', 'ghost'],
                loading: false,
                query: { game_type: 0, UserId: '', servicetype: '' },
                datasTime: [],
                page: 1,
                per_page: 20,
                total: 0,
                showEdit: false,
                showAdd: false,
                id: '',
                name: '',
                bank_card: '',
                bill_price: '',
                statusObj: {
                    '0': '待处理',
                    '1': '已受理',
                    '2': '已拒绝',
                    '3': '成功',
                },
                notifyStatusObj: {
                    '0': '待通知',
                    '1': '成功',
                    '2': '失败',
                },
                bank_code: '',
                chatCurrentPage: 1,
                chatTotalPage: 1,
                addRow: {},
                editRow: {},
                columns: [
                    {
                        title: '创建时间',
                        minWidth: 100,
                        key: 'created_at'
                    },
                    {
                        title: '商户号',
                        minWidth: 80,
                        key: 'merchant_no'
                    },
                    {
                        title: '商户订单号',
                        minWidth: 100,
                        key: 'merchant_order_id'
                    },
                    {
                        title: '平台订单号',
                        minWidth: 100,
                        key: 'order_id'
                    },
                    {
                        title: '用户ID',
                        minWidth: 60,
                        key: 'user_id'
                    },
                    {
                        title: '提现金额',
                        minWidth: 60,
                        key: 'bill_price'
                    },
                    {
                        title: '账户',
                        minWidth: 50,
                        key: 'name'
                    },
                    {
                        title: '银行卡号',
                        minWidth: 120,
                        key: 'bank_card'
                    },
                    {
                        title: '银行代码',
                        minWidth: 50,
                        key: 'bank_code'
                    },
                    {
                        title: '出款状态',
                        minWidth: 50,
                        key: 'status',
                        render: (h, params) => {
                            return h('span',{
                                style: {
                                    color: params.row.status == 3 ? '#19be6b' : (params.row.status == 2 ? '#ed3f14' : '#000')
                                }
                            },  this.statusObj[params.row.status])
                        }
                    },
                    {
                        title: '受理人',
                        minWidth: 50,
                        key: 'service_id',
                        render: (h, params) => {
                            return h('span',{
                            },  params.row.service_id == '0' ? '' : params.row.service_id)
                        }
                    },
                    {
                        title: '通知状态',
                        minWidth: 50,
                        key: 'notify_status',
                        render: (h, params) => {
                            return h('span',{
                                style: {
                                    color: params.row.notify_status == 1 ? '#19be6b' : (params.row.notify_status == 2 ? '#ed3f14' : '#000')
                                }
                            },  this.notifyStatusObj[params.row.notify_status])
                        }
                    }

                ],
                tableDatas: [],
                mymodel: 'my-model1'
            }
        },
        watch: {
            $route (to) {

            }
        },
        mounted () {
            this.init()
        },
        methods: {
            init () {
                this.queryList()
            },
            pickerChange (am, b) {
                this.datasTime = am; this.clearDate()
            },
            clearDate () {
                this.btTypes = ['ghost', 'ghost', 'ghost']
            },
            changeDate (day) {
                this.datasTime = []
                var start = new Date()
                var end = new Date()
                if (day === 1) {
                    this.btTypes = ['success', 'ghost', 'ghost']
                    this.datasTime = [this.getDateFormate(start), this.getDateFormate(end)]
                }
                if (day === 7) {
                    this.btTypes = ['ghost', 'success', 'ghost']
                    start.setDate(start.getDate() - 6)
                    this.datasTime = [this.getDateFormate(start), this.getDateFormate(end)]
                }
                if (day === 30) {
                    this.btTypes = ['ghost', 'ghost', 'success']
                    start.setDate(start.getDate() - 29)
                    this.datasTime = [this.getDateFormate(start), this.getDateFormate(end)]
                }
            },
            getDateFormate (date) {
                return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
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
                        ...this.query,
                        start_time: (this.datasTime.length > 0 && this.datasTime[0]) ? this.datasTime[0] : '',
                        end_time: (this.datasTime.length > 1 && this.datasTime[1]) ? this.datasTime[1] + ' 23:59:59' : ''
                    }
                    const result = await this.$store.dispatch('getWithdrawalList', data)
                    if (result) {
                        if (result.data) {
                            this.tableDatas = result.data
                        }
                        if (result.meta) {
                            this.total = result.meta.total
                        }
                    }
                    // this.tableDatas = res.tableDatas
                    // this.total = res.total
                    // this.arrTitles = res.arrTitles
                } catch (error) {
                }
                this.queryLoading = false
            },
            toQuery () {
                this.page = 1
                this.queryList()
            },
            boxShake (flag) {
                setTimeout(() => {
                    this.$refs.message_box.scrollTop = this.$refs.message_box.scrollHeight
                }, 500)
                if (flag) {
                    var si = setInterval(() => {
                        this.mymodel = this.mymodel === 'my-model2' ? 'my-model1' : 'my-model2'
                    }, 80)
                    setTimeout(() => {
                        clearInterval(si)
                        this.mymodel = 'my-model'
                    }, 600)
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    .message {
        list-style: none;
        padding: 10px 15px;
        overflow-y: scroll;
        height: 400px;
        li {
            margin-bottom: 15px;
        }
        .time1 {
            margin: 7px 0;
            text-align: left;
            > span {
                display: inline-block;
                padding: 0 18px;
                font-size: 12px;
                color: #fff;
                border-radius: 2px;
                background-color: #dcdcdc;
            }
        }
        .time2 {
            margin: 7px 0;
            text-align: right;
            > span {
                display: inline-block;
                padding: 0 18px;
                font-size: 12px;
                color: #fff;
                border-radius: 2px;
                background-color: #dcdcdc;
            }
        }
        .time {
            margin: 7px 0;
            text-align: center;
            > span {
                display: inline-block;
                padding: 0 18px;
                font-size: 12px;
                color: #fff;
                border-radius: 2px;
                background-color: #dcdcdc;
            }
        }
        .avatar {
            float: left;
            margin: 0 10px 0 0;
            border-radius: 3px;
        }
        .text {
            display: inline-block;
            position: relative;
            padding: 0 10px;
            max-width: ~'calc(100% - 40px)';
            min-height: 30px;
            line-height: 2.5;
            font-size: 12px;
            text-align: left;
            word-break: break-all;
            background-color: #f3f3f3;
            border-radius: 3px;
            &:before {
                content: ' ';
                position: absolute;
                top: 2px;
                right: 100%;
                border: 5px solid transparent ;
                border-bottom-width: 8px  ;
                border-right-color: #f3f3f3;
            }
        }
        .self {
            text-align: right;
            .avatar {
                float: right;
                margin: 0 0 0 10px;
            }
            .text {
                background-color: #b2e281;
                &:before {
                    right: inherit;
                    left: 100%;
                    border-right-color: transparent;
                    border-left-color: #b2e281;
                }
            }
        }
    }
    .send-box {
        display: flex;
        .replay-box {
            flex: 1;
        }
        .replay-btn {
            flex: 0 0 60px;
            align-self: flex-end;
            text-align: center;
        }
    }
    .margin-top-10 {
        margin-top: 10px;
    }
</style>
