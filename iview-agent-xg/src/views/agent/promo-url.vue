<template>
  <div>
    <Form label-position="right" :label-width="70" inline>
        <FormItem :label-width="1">
        <Button type="primary" @click="toQuery" :loading="queryLoading" icon="ios-search">查询</Button>
      </FormItem>
    </Form>
    <Table :loading="queryLoading" border ref="selection" :columns="columns" :data="tableDatas" stripe></Table>
    <!-- <Page :total="total" :page-size-opts="[20,50,100]" :current="page" class-name="margin-top-10" @on-page-size-change="pageSizeChange" @on-change="pageChange" size="small" show-total show-elevator show-sizer :page-size="20" class="margin-top-10"></Page> -->

        <Card  dis-hover v-show="tableDatas.length">
            <p slot="title">点击选择以下图片合成推广宣传图:</p>
           <div>
                 <img v-for="(item,index) in images" :src="item" :key="'qrcode_bg_'+index" @click="merge(index)" width="140px" height="250px" alt="点击合成推广图!" class="xuanchuan-img" />
           </div>
        </Card>

    <Modal v-model="show"  width="620"   :styles="{textAlign:'center'}" :closable="false" >
       <Tabs value="0">
          <TabPane :label="columns[index].title" :name="index+''"  v-for="(item,index) in imageArr" :key="'q4rcod_'+index">
           <!-- <Tooltip placement="top" content="下载APP推广宣传图请鼠标右键另存！" > -->
           <img :src="item" alt="" width="360px" height="640px">
           <!-- </Tooltip> -->
          </TabPane>
         <!-- <TabPane label="H5下载推广宣传图" name="name2">
           <img :src="imgsrc1" alt="" width="360px" height="640px">
           <canvas id="myCanvas1"> </canvas>
          </TabPane> -->
       </Tabs>
      <canvas id="myCanvas0"> </canvas>
      <canvas id="myCanvas1"> </canvas>
      <canvas id="myCanvas2"> </canvas>
      <canvas id="myCanvas3"> </canvas>
      <div  slot="footer" style="color:#f60;text-align:center">
        下载保存图片请鼠标右键另存为！
      </div>
    </Modal>
  </div>
</template>
<script>
import { myMixin } from '@/utils/mixins.js'
// import Qrcode from '@/components/Qrcode'
export default {
  components: {
    // Qrcode
  },
  mixins: [myMixin],
  data () {
    return {
      queryLoading: false,
      images: [
        '/static/images/qrcode_bg0.png',
        '/static/images/qrcode_bg1.png',
        '/static/images/qrcode_bg2.png',
        '/static/images/qrcode_bg3.png',
        '/static/images/qrcode_bg4.png',
        '/static/images/qrcode_bg5.png',
        '/static/images/qrcode_bg6.png',
        '/static/images/qrcode_bg7.png',
        '/static/images/qrcode_bg8.png',
        '/static/images/qrcode_bg9.png',
        '/static/images/qrcode_bg10.png',
        '/static/images/qrcode_bg11.png',
        '/static/images/qrcode_bg12.png',
        '/static/images/qrcode_bg13.png',
        '/static/images/qrcode_bg14.png',
        '/static/images/qrcode_bg15.png',
        '/static/images/qrcode_bg16.png',
        '/static/images/qrcode_bg17.png',
        '/static/images/qrcode_bg18.png',
        '/static/images/qrcode_bg19.png',
        '/static/images/qrcode_bg20.png',
        '/static/images/qrcode_bg21.png',
        '/static/images/qrcode_bg22.png'
      ],
      loading: false,
      datasTime: [],
      page: 1,
      per_page: 20,
      total: 0,
      show: false,
      showAdd: false,
      addRow: {},
      editRow: {},
      columns: [
      ],
      tableDatas: [],
      imageArr: []

    }
  },
  mounted () {
    this.init()
  },
  computed: {},
  methods: {
    init () {
      this.queryList()
    },
    merge (i) {
      setTimeout(() => {
        this.show = true
      }, 300)

      this.canvasN(i, 0)
      this.canvasN(i, 1)
      this.canvasN(i, 2)
      this.canvasN(i, 3)
      // this.canvas1 = document.getElementById('myCanvas1')
      // this.canvas1.width = '720'
      // this.canvas1.height = '1280' // 创建画布，并设置宽高

      // let ctx1 = this.canvas1.getContext('2d')
      // ctx1.rect(0, 0, 720, 1280) // 矩形坐标，大小 (距离左上角x坐标,距离左上角y坐标,宽度,高度)
      // ctx1.fillStyle = '#fff' // 矩形的颜色
      // ctx1.fill() // 填充
      // var qrcodeSrc1 = document.getElementsByTagName('canvas')[0].toDataURL('image/png')
      // this.loadImg([this.images[i], qrcodeSrc1]).then(([img1, img2]) => {
      //   ctx1.drawImage(img1, 0, 0, 720, 1280) // 画布上先绘制人物图`
      //   ctx1.drawImage(img2, 210, 270, 300, 300) // 再绘制二维码图，根据设计图设置好坐标。`
      //   var imageURL1 = this.canvas1.toDataURL('image/png') // 获取图片合并后的data-URL,参数可选图片格式，图片质量，详自查API`

      //   this.imgsrc1 = imageURL1
      //   this.canvas1.style.display = 'none'
      // })
    },

    canvasN (i, n) {
      var canvas2 = document.getElementById('myCanvas' + n)
      canvas2.width = '720'
      canvas2.height = '1280' // 创建画布，并设置宽高
      // 注意canvas元素本身并没有绘制能力（它仅仅是图形的容器
      // getContext()方法可返回一个对象，该对象提供了用于在画布上绘图的方法和属性
      let ctx = canvas2.getContext('2d')
      ctx.rect(0, 0, 720, 1280) // 矩形坐标，大小 (距离左上角x坐标,距离左上角y坐标,宽度,高度)
      ctx.fillStyle = '#fff' // 矩形的颜色
      ctx.fill() // 填充
      var qrcodeSrc2 = document.getElementsByTagName('canvas')[n].toDataURL('image/png')
      this.loadImg([this.images[i], qrcodeSrc2]).then(([img1, img2]) => {
        ctx.drawImage(img1, 0, 0, 720, 1280) // 画布上先绘制人物图`
        ctx.drawImage(img2, 210, 270, 300, 300) // 再绘制二维码图，根据设计图设置好坐标。`
        var imageURL2 = canvas2.toDataURL('image/png') // 获取图片合并后的data-URL,参数可选图片格式，图片质量，详自查API`
        // let img3 = new Image();
        // document.getElementsByClassName("box")[0].append(img3);
        this.imageArr[n] = imageURL2
        canvas2.style.display = 'none'
      })
    },

    loadImg (src) {
      let paths = Array.isArray(src) ? src : [src]
      let promise = paths.map(path => {
        return new Promise((resolve, reject) => {
          let img = new Image()
          img.setAttribute('crossOrigin', 'anonymous')
          img.src = path
          // 只是更新了DOM对象,图片数据信息还未加载完成，加载资源是异步执行的,需要监听load事件的,事件发生后,就能获取资源
          img.onload = () => {
            resolve(img)
          }
          img.onerror = (err) => {
            console.log(err)
            alert('图片加载失败')
          }
        })
      })
      return Promise.all(promise)
    },
    pickerChange (am, b) {
      this.datasTime = am; this.clearDate()
    },
    clearDate () {
      this.btTypes = ['ghost', 'ghost', 'ghost', 'ghost']
    },
    changeDate (day) {
      this.datasTime = []
      var start = new Date()
      var end = new Date()
      if (day === -1) {
        this.btTypes = [ 'ghost', 'ghost', 'ghost', 'success' ]
        start.setDate(start.getDate() - 1)
        end.setDate(end.getDate() - 1)
        this.datasTime = [this.getDateFormate(start), this.getDateFormate(end)]
      } if (day === 1) {
        this.btTypes = ['success', 'ghost', 'ghost', 'ghost']
        this.datasTime = [this.getDateFormate(start), this.getDateFormate(end)]
      }
      if (day === 7) {
        this.btTypes = ['ghost', 'success', 'ghost', 'ghost']
        start.setDate(start.getDate() - 6)
        this.datasTime = [this.getDateFormate(start), this.getDateFormate(end)]
      }
      if (day === 30) {
        this.btTypes = ['ghost', 'ghost', 'success', 'ghost']
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
        let minIndex = (this.page - 1) * this.per_page
        let maxIndex = this.page * this.per_page
        const data = {
          page: this.page,
          per_page: this.per_page,
          minIndex: minIndex,
          maxIndex: (maxIndex > this.total && this.total && this.page > 1) ? this.total : maxIndex,
          ...this.query,
          start_time: (this.datasTime.length > 0 && this.datasTime[0]) ? this.datasTime[0] : '',
          end_time: (this.datasTime.length > 1 && this.datasTime[1]) ? this.datasTime[1] + ' 23:59:59' : ''
        }

        const result = await this.$store.dispatch('getPromoUrl', data)
        const res = this.handleResult(result)
        this.columns = []
        let columnTitles = res.arrTitles

        let columnKeys = res.arrKeys && res.arrKeys.length ? res.arrKeys : res.arrTitles
        for (let i = 0; i < columnKeys.length; i++) {
          let obj = {
            title: columnTitles[i],
            minWidth: 200,
            align: 'center',
            // sortable: 'custom',
            key: columnKeys[i]
          }
          obj.render = (h, params) => {
            return h('div', [
              h('a', {
                style: {
                  display: 'block',
                  height: '30px',
                  lineHeight: '30px'
                },
                on: {
                  click: () => {
                    window.open(params.row[columnKeys[i]])
                  }
                }
              }, params.row[columnKeys[i]]),
              h('qrcode', {
                props: {
                  ref: 'qrcode_me' + params.row.index,
                  options: { color: { dark: '#1c2438' }, width: 200, margin: 1 },
                  value: params.row[columnKeys[i]]
                }
              })
            ])
          }

          this.columns.push(obj)
        }
        this.tableDatas = res.tableDatas
        this.total = res.total
      } catch (error) {
      }
      this.queryLoading = false
    },
    toQuery () {
      this.page = 1
      this.queryList()
    },
    toUpdateSettlement (index, status) {
      let data = {
        OrderID: this.tableDatas[index].OrderID,
        Status: status
      }
      this.saveEdit(data)
    },
    async saveEdit (data) {
      try {
        this.loading = true
        const res = await this.$store.dispatch('updateSettlement', data)
        if (res.data && res.data.hasOwnProperty('result') && res.data.result !== 0) {
          this.$Message.error(res.data.szresult)
        } else {
          this.showEdit = false
          this.$Message.success('操作成功!')
          setTimeout(() => {
            this.toQuery()
          }, 3000)
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
.xuanchuan-img{
  display:inline-block;
  border-radius:4px;
  margin:10px;
  &:hover{
    cursor: pointer;
    box-shadow:5px 0px 5px 5px #abcdef;
  }
}

</style>
