'use strict';
const db = uniCloud.database()
let uniID = require('uni-id')

exports.main = async (event, context) => {
  uniID = uniID.createInstance({
    context
  })
  const {
    outTradeNo,
    uniIdToken
  } = event
  const payload = await uniID.checkToken(uniIdToken)
  if (payload.code > 0) {
    return {
      code: 1001,
      msg: '用户身份验证失败，请重新登录'
    }
  }
  const uid = payload.uid
  const order = db.collection('order');
  //const dbCmd = db.command
  // 获取订单中的商品信息
   const orderList = await order.where({
     uid: uid, outTradeNo: outTradeNo
   }).get()
  const cancleOrderResult = await order.doc(orderList.data[0]._id).update({status:3})
  if (cancleOrderResult.updated) {
	  return {
	  		  code: 20000,
	  		  msg: '取消订单成功'
	  }
  } else {
	  return {
	    code: -3,
	    msg: '取消订单失败，请稍后再试'
	  }
  }

};
