<template>
  <view class="uni-container">
    <uni-forms ref="form" :value="formData" validateTrigger="bind">
      <uni-forms-item name="title" label="数据标题" required>
        <uni-easyinput placeholder="标题" v-model="formData.title" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="category_id" label="分类">
        <uni-data-checkbox v-model="formData.category_id" collection="opendb-news-categories" field="name as text, _id as value"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="content" label="数据简介" required>
        <uni-easyinput placeholder="数据简介" v-model="formData.content" trim="right"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="b_mode" label="是否付费">
        <uni-data-checkbox v-model="formData.b_mode" :localdata="formOptions.b_mode_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="price" label="价格">
        <uni-easyinput placeholder="价格" type="number" v-model="formData.price"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="vip_price" label="会员价格">
        <uni-easyinput placeholder="会员价格" type="number" v-model="formData.vip_price"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="avatar" label="封面大图">
        <uni-easyinput placeholder="缩略图地址" v-model="formData.avatar" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="store_link" label="网盘地址">
        <uni-easyinput placeholder="网盘地址" v-model="formData.store_link" trim="right"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="pass_code" label="密钥">
        <uni-easyinput placeholder="密钥" v-model="formData.pass_code" trim="right"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="article_status" label="状态">
        <uni-data-checkbox v-model="formData.article_status" :localdata="formOptions.article_status_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="publish_date" label="发表时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.publish_date"></uni-datetime-picker>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
        <navigator open-type="navigateBack" style="margin-left: 15px;">
          <button class="uni-button" style="width: 100px;">返回</button>
        </navigator>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../js_sdk/validator/ppm_data.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'ppm_data';

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.includes(key)) {
        result[key] = validator[key]
      }
    }
    return result
  }

  export default {
    data() {
      let formData = {
        "title": "",
        "category_id": "",
        "content": "",
        "b_mode": 0,
        "price": null,
        "vip_price": null,
        "avatar": "",
        "store_link": "",
        "pass_code": "",
        "article_status": 0,
        "publish_date": null
      }
      return {
        formData,
        formOptions: {
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
        rules: {
          ...getValidator(Object.keys(formData))
        }
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      /**
       * 验证表单并提交
       */
      submit() {
        uni.showLoading({
          mask: true
        })
        this.$refs.form.validate().then((res) => {
          return this.submitForm(res)
        }).catch(() => {
        }).finally(() => {
          uni.hideLoading()
        })
      },

      /**
       * 提交表单
       */
      submitForm(value) {
        // 使用 clientDB 提交数据
        return db.collection(dbCollectionName).add(value).then((res) => {
          uni.showToast({
            title: '新增成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      }
    }
  }
</script>
