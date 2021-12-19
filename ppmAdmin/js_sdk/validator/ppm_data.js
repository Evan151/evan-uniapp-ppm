// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "title": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "标题"
  },
  "category_id": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "分类"
  },
  "content": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "数据简介"
  },
  "b_mode": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "value": 0,
            "text": "免费"
          },
          {
            "value": 1,
            "text": "付费,会员免费"
          },
          {
            "value": 2,
            "text": "付费"
          }
        ]
      }
    ],
    "defaultValue": 0,
    "label": "是否付费"
  },
  "price": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "label": "价格"
  },
  "vip_price": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "label": "会员价格"
  },
  "avatar": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "封面大图"
  },
  "store_link": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "数据简介"
  },
  "pass_code": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "label": "密钥"
  },
  "article_status": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "value": 0,
            "text": "未发布"
          },
          {
            "value": 1,
            "text": "已发布"
          }
        ]
      }
    ],
    "defaultValue": 0,
    "label": "状态"
  },
  "publish_date": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "defaultValue": {
      "$env": "now"
    },
    "label": "发表时间"
  }
}

const enumConverter = {
  "b_mode_valuetotext": {
    "0": "免费",
    "1": "付费"
  },
  "article_status_valuetotext": {
    "0": "未发布",
    "1": "已发布"
  }
}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
