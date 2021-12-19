const path = require('path')
module.exports = {
	// 微信小程序端对应的微信支付及登录配置配置
	wxConfigMp: {
		appId: 'wxc5211e6839cb4ad3',
		secret: '',
		mchId: '1611125915',
		key: 'Ztl56qcBzFCgPoP4ZxcXKLK9p2XLyXFl',
	},
	// App端对应的微信支付配置
	wxConfigApp: {
		appId: '',
		mchId: '',
		key: '',
	},
	// 微信PC网站支付
	wxConfigH5: {
		appId: '',
		mchId: '',
		key: '',
	},
	// 支付宝小程序端对应的支付宝支付及登录配置
	aliConfigMp: {
		mchId: "",
		appId: "",
		alipayPublicKey: "",
		privateKey: "",
	},
	// App端对应的支付宝支付配置
	aliConfigApp: {
		mchId: "",
		appId: "",
		alipayPublicKey: "",
		privateKey: "",
	}
}
