import store from '@/store';
import config from '@/env.config.js';
import { tansParams } from './common.js';

let timeout = 10000;
const baseUrl = config.baseUrl;

const upload = config => {
	// 是否需要设置 token
	const isToken = (config.headers || {}).isToken === false;
	config.header = config.header || {};
	let token = uni.getStorageSync('token');
	if (token && !isToken) {
		config.header['Authorization'] = 'Bearer ' + token;
	}
	// get请求映射params参数
	if (config.params) {
		let url = config.url + '?' + tansParams(config.params);
		url = url.slice(0, -1);
		config.url = url;
	}
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			timeout: config.timeout || timeout,
			url: baseUrl + config.url,
			filePath: config.filePath,
			name: config.name || 'file',
			header: config.header,
			formData: config.formData,
			success: (res) => {
				let result = JSON.parse(res.data)
				const code = result.code;
				const msg = result.msg;
				if (code === 200) {
					resolve(result)
				} else if (code == 401) {
					uni.showModal({
						title: '提示',
						content: '登录状态已过期，您可以继续留在该页面，或者重新登录?',
						cancelText: "取消", // 取消按钮的文字  
						confirmText: "确认", // 确认按钮文字  
						showCancel: true, // 是否显示取消按钮，默认为 true
						confirmColor: '#999999',
						cancelColor: '#39B54A',
						success: (res) => {
							if (res.confirm) {
								uni.setStorageSync('token', '');
								uni.reLaunch({ url: '/pages/login/index' });
							}
						}
					})
				} else {
					vm.$u.toast(msg);
				}
			},
			fail: (err) => {
				console.log(err);
			}
		})
	})
}

export default upload;