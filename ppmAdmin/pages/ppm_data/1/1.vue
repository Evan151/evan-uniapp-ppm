<template>
  <view>
    <view class="uni-header">
      <view class="uni-group">
        <view class="uni-title"></view>
        <view class="uni-sub-title"></view>
      </view>
      <view class="uni-group">
        <input class="uni-search" type="text" v-model="query" @confirm="search" placeholder="请输入搜索内容" />
        <button class="uni-button" type="default" size="mini" @click="search">搜索</button>
        <button class="uni-button" type="default" size="mini" @click="navigateTo('./add')">新增</button>
        <button class="uni-button" type="default" size="mini" :disabled="!selectedIndexs.length" @click="delTable">批量删除</button>
        <download-excel class="hide-on-phone" :fields="exportExcel.fields" :data="exportExcelData" :type="exportExcel.type" :name="exportExcel.filename">
          <button class="uni-button" type="primary" size="mini">导出 Excel</button>
        </download-excel>
      </view>
    </view>
    <view class="uni-container">
      <unicloud-db ref="udb" collection="ppm_data,opendb-news-categories" field="title,category_id{name as text,fileinfo.url},content,b_mode,price,vip_price,avatar,store_link,pass_code,article_status,publish_date" :where="where" page-data="replace"
        :orderby="orderby" :getcount="true" :page-size="options.pageSize" :page-current="options.pageCurrent"
        v-slot:default="{data,pagination,loading,error,options}" :options="options" loadtime="manual" @load="onqueryload">
        <uni-table ref="table" :loading="loading" :emptyText="error.message || '没有更多数据'" border stripe type="selection" @selection-change="selectionChange">
          <uni-tr>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'title')" sortable @sort-change="sortChange($event, 'title')">标题</uni-th>
            <uni-th v-if="categoryList.length > 0" align="center" filter-type="select" :filterData="categoryList" @filter-change="filterChange($event, 'category_id.text')">分类</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'content')" sortable @sort-change="sortChange($event, 'content')">数据简介</uni-th>
            <uni-th align="center" filter-type="select" :filter-data="options.filterData.b_mode_localdata" @filter-change="filterChange($event, 'b_mode')">是否付费</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'price')" sortable @sort-change="sortChange($event, 'price')">价格</uni-th>
            <uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'vip_price')" sortable @sort-change="sortChange($event, 'vip_price')">会员价格</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'avatar')" sortable @sort-change="sortChange($event, 'avatar')">封面大图</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'store_link')" sortable @sort-change="sortChange($event, 'store_link')">数据简介</uni-th>
            <uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'pass_code')" sortable @sort-change="sortChange($event, 'pass_code')">密钥</uni-th>
            <uni-th align="center" filter-type="select" :filter-data="options.filterData.article_status_localdata" @filter-change="filterChange($event, 'article_status')">状态</uni-th>
            <uni-th align="center" filter-type="timestamp" @filter-change="filterChange($event, 'publish_date')" sortable @sort-change="sortChange($event, 'publish_date')">发表时间</uni-th>
            <uni-th align="center">操作</uni-th>
          </uni-tr>
          <uni-tr v-for="(item,index) in data" :key="index">
            <uni-td align="center">{{item.title}}</uni-td>
           <uni-td v-if="categoryList.length > 0" align="center">
                    <uni-tag type="primary" inverted size="small" :text=" item.category_id && item.category_id[0] && item.category_id[0].text"></uni-tag>
            </uni-td>
            
            <uni-td align="center">{{item.content}}</uni-td>
            <uni-td align="center">{{options.b_mode_valuetotext[item.b_mode]}}</uni-td>
            <uni-td align="center">{{item.price}}</uni-td>
            <uni-td align="center">{{item.vip_price}}</uni-td>
            <!-- 数据图片 默认为类别图片 -->
            <uni-td align="center" v-if="item.avatar"> <image  :src="item.avatar" style="width: 100px;height: 57px;border-radius: 3px;"></image></uni-td>
            <uni-td align="center" v-else><image  :src="item.category_id[0].fileinfo.url" mode="" style="width: 100px;height: 57px;border-radius: 3px;"></image></uni-td>
 
            <uni-td align="center">{{item.store_link}}</uni-td>
            <uni-td align="center">{{item.pass_code}}</uni-td>
            <uni-td align="center">{{options.article_status_valuetotext[item.article_status]}}</uni-td>
            <uni-td align="center">
              <uni-dateformat :threshold="[0, 0]" :date="item.publish_date"></uni-dateformat>
            </uni-td>
            <uni-td align="center">
              <view class="uni-group">
                <button @click="navigateTo('./edit?id='+item._id, false)" class="uni-button" size="mini" type="primary">修改</button>
                <button @click="confirmDelete(item._id)" class="uni-button" size="mini" type="warn">删除</button>
              </view>
            </uni-td>
          </uni-tr>
        </uni-table>
        <view class="uni-pagination-box">
          <uni-pagination show-icon :page-size="pagination.size" v-model="pagination.current" :total="pagination.count" @change="onPageChanged" />
        </view>
      </unicloud-db>
    </view>
  </view>
</template>

<script>
  import { enumConverter, filterToWhere } from '../../js_sdk/validator/ppm_data.js';

  const db = uniCloud.database()
  // 表查询配置
  const dbOrderBy = '' // 排序字段
  const dbSearchFields = [] // 模糊搜索字段，支持模糊搜索的字段列表。联表查询格式: 主表字段名.副表字段名，例如用户表关联角色表 role.role_name
  // 分页配置
  const pageSize = 20
  const pageCurrent = 1

  const orderByMapping = {
    "ascending": "asc",
    "descending": "desc"
  }

  export default {
    data() {
      return {
        query: '',
        where: '',
        orderby: dbOrderBy,
        orderByFieldName: "",
        selectedIndexs: [],
        categoryList: [],
        options: {
          pageSize,
          pageCurrent,
          filterData: {
            "b_mode_localdata": [
              {
                "value": 0,
                "text": "免费"
              },
              {
                "value": 1,
                "text": "付费,会员免费"
              },
              {
                "value": 1,
                "text": "付费"
              }
            ],
            "article_status_localdata": [
              {
                "value": 0,
                "text": "未发布"
              },
              {
                "value": 1,
                "text": "已发布"
              }
            ]
          },
          ...enumConverter
        },
        imageStyles: {
          width: 64,
          height: 64
        },
        exportExcel: {
          "filename": "ppm_data.xls",
          "type": "xls",
          "fields": {
            "数据标题": "title",
            "分类": "category_id",
            "数据简介": "content",
            "是否付费": "b_mode",
            "价格": "price",
            "会员价格": "vip_price",
            "封面大图": "avatar",
            "网盘地址": "store_link",
            "密钥": "pass_code",
            "状态": "article_status",
            "发表时间": "publish_date"
          }
        },
        exportExcelData: []
      }
    },
    onLoad() {
      this._filter = {}
    },
    onReady() {
        this.$refs.udb.loadData()
        setTimeout(()=>{
            this.getCategory()
        },500)

    },
    methods: {
      onqueryload(data) {
        this.exportExcelData = data
      },
      getWhere() {
        const query = this.query.trim()
        if (!query) {
          return ''
        }
        const queryRe = new RegExp(query, 'i')
        return dbSearchFields.map(name => queryRe + '.test(' + name + ')').join(' || ')
      },
      search() {
        const newWhere = this.getWhere()
        this.where = newWhere
        this.$nextTick(() => {
          this.loadData()
        })
      },
      loadData(clear = true) {
        this.$refs.udb.loadData({
          clear
        })
      },
      onPageChanged(e) {
        this.selectedIndexs.length = 0
        this.$refs.table.clearSelection()
        this.$refs.udb.loadData({
          current: e.current
        })
      },
      navigateTo(url, clear) {
        // clear 表示刷新列表时是否清除页码，true 表示刷新并回到列表第 1 页，默认为 true
        uni.navigateTo({
          url,
          events: {
            refreshData: () => {
              this.loadData(clear)
            }
          }
        })
      },
      getCategory() {
          let dataList = this.$refs.udb.dataList
          console.log('dataList1', JSON.stringify(dataList));
          this.categoryList = dataList.map(v => {
              return {
                  "value": v.category_id[0].text,
                  "text": v.category_id[0].text
              }
          })
          console.log('categoryList:', JSON.stringify(this.categoryList));
      },
      // 多选处理
      selectedItems() {
        var dataList = this.$refs.udb.dataList
        return this.selectedIndexs.map(i => dataList[i]._id)
      },
      // 批量删除
      delTable() {
        this.$refs.udb.remove(this.selectedItems(), {
          success:(res) => {
            this.$refs.table.clearSelection()
          }
        })
      },
      // 多选
      selectionChange(e) {
        this.selectedIndexs = e.detail.index
      },
      confirmDelete(id) {
        this.$refs.udb.remove(id, {
          success:(res) => {
            this.$refs.table.clearSelection()
          }
        })
      },
      sortChange(e, name) {
        this.orderByFieldName = name;
        if (e.order) {
          this.orderby = name + ' ' + orderByMapping[e.order]
        } else {
          this.orderby = ''
        }
        this.$refs.table.clearSelection()
        this.$nextTick(() => {
          this.$refs.udb.loadData()
        })
      },
      filterChange(e, name) {
        this._filter[name] = {
          type: e.filterType,
          value: e.filter
        }
        let newWhere = filterToWhere(this._filter, db.command)
        if (Object.keys(newWhere).length) {
          this.where = newWhere
        } else {
          this.where = ''
        }
        this.$nextTick(() => {
          this.$refs.udb.loadData()
        })
      }
    }
  }
</script>

<style>
</style>
