const http = uni.$u.http;

// 查询所有产品列表
export function listShortProduct() {
	return http.get('/iot/product/shortList');
}

// 获取验证码
export function captchaImage() {
	return http.get('/captchaImage');
}

// 获取用户信息
export function getProfile() {
	return http.get('/system/user/profile');
}

// 个人中心-微信绑定-app和小程序
export function wechatBind(params) {
	return http.post('/wechat/bind', params);
}

//解除微信绑定
export function secureBind(params) {
	return http.post('/wechat/cancelBind', params);
}

// 登录
export function login(params) {
	return http.post('/login', params);
}

// 绑定登录
export function bindLogin(params) {
	return http.post('/auth/bind/login', params);
}

// 绑定注册
export function bindRegister(params) {
	return http.post('/auth/bind/register', params);
}
//获取短信验证码
export function getSmsCode(phoneNumber) {
	return http.request({
		url: '/notify/smsLoginCaptcha?phoneNumber=' + phoneNumber,
		method: 'get',
	})
}
//短信登录
export function smsLogin(params) {
	return http.post('/auth/sms/login', params);
}
// 退出登录
export function logout() {
	return http.post('/logout');
}

// 注册方法
export function register(params) {
	return http.post('/iot/tool/register', params);
}

// 查询用户列表
export function listUser(params) {
	return http.get('/iot/tool/userList', {
		params: params
	});
}

// 注销账号
export function unsubscribe() {
	return http.post('/unsubscribe');
}