// let images = 'https://xnsmb.xnsoft.net.cn'
// let API_Url = "https://zs-beta.cntracechain.com/obor/"
let API_Url = "https://zhuisu.china.com.cn/obor/"
// let API_Url = "https://pdb-beta.cntracechain.com/obor/"
// 请求Url
let getUrl = function(url) {
	// #ifdef H5
	return '/obor/' + url
	// #endif
	// #ifdef MP-WEIXIN
	return API_Url + url
	// #endif

}

let footer = {
	phone: '联系电话：020-3142 0284',
	copyright: 'Copyright © 2017-2018 京ICP备17012074号',
	title: '“一带一路”可追溯商品数据库中心 版权所有'
}

// 请求头部
let header = {
	'Content-Type': 'application/json'
}

// 请求
function request(url, data, method, success,is_close=true) {
	wx.showLoading({
		title: '加载中......',
	})
	wx.request({
		url: getUrl(url),
		data: data,
		header: header,
		method: method,
		success: function(res) {
			success(res);
		},
		fail: function(res) {
			wx.showToast({
				title: '网络不良',
				icon: 'loading',
				mask: true,
				duration: 1000,
			})
		},
		complete(res) {
			if(is_close){
					wx.hideLoading();
			}
		
		}
	})
}

function httpPost(url, data, method, success) {
	wx.showLoading({
		title: '加载中......',
	})
	wx.request({
		url: getUrl(url),
		data: data,
		header: header,
		method: method,
		success: function(res) {
			success(res);
		},
		fail: function(res) {
			wx.showToast({
				title: '网络不良',
				icon: 'loading',
				mask: true,
				duration: 1000,
			})
		}
	})
}

// 邮箱验证
const test_email = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
//手机号码验证
const test_mobile = /^1[0-9]{10}$/;


// 日期去T
let replaceT = function(data) {
	return data.replace("T", " ")
}

//拨打电话
function phoneCall(phone_number) {
	wx.makePhoneCall({
		phoneNumber: phone_number,
	})
}

// 弹窗提醒
function showtoast(text) {
	wx.showToast({
		title: text,
		icon: 'none',
		mask: true,
		duration: 1000,
	})
}

// 路由跳转
function navigateTo(url) {
	wx.navigateTo({
		url: url,
	})
}

function reLaunch(url) {
	wx.reLaunch({
		url: url
	})
}

export default {
	// #ifdef H5
	API_Url,
	// #endif

	getUrl,
	footer,
	header,
	test_mobile,
	test_email,
	replaceT,
	phoneCall,
	showtoast,
	request,
	navigateTo,
	reLaunch,
	httpPost
}

// 账号：obor@kc5.net
// 密码：Zgzs2019.
