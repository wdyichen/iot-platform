import * as common from './modules/common.js';
import * as account from './modules/account.js';
import * as group from './modules/group.js';
import * as deviceUser from './modules/deviceUser.js';
import * as deviceLog from './modules/deviceLog.js';
import * as device from './modules/device.js';
// const http = uni.$u.http;

// api 接口管理
const install = (Vue, vm) => {

	Vue.prototype.$api = {
		// 登录
		// login:(params = {})=>http.post('/login',params),

		// import modules
		common,
		group,
		deviceUser,
		deviceLog,
		device,
		account
	};
}

export default {
	install
}
