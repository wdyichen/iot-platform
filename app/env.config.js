// H5端开发和生产环境协议
let protocalDev = "wss://";
let protocalProd = "wss://";

// 条件编译，微信端和移动端使用wxs协议
// #ifdef MP-WEIXIN || APP-PLUS
protocalDev = 'wxs://';
protocalProd = 'wxs://';
// #endif

// 腾讯地图key
let qqmapKey = '4PDBZ-4KQKU-AX6VO-GU7NB-INDZJ-YBFXC';

// 心知天气key
let xinzhiKey = 'SBh45_yy21FU5ErV_';

const CONFIG = {
	// 开发环境配置
	development: {
		officialWebUrl: 'https://fastbee.cn/',
		baseUrl: 'http://localhost:8080',
		mqttServer: protocalDev + 'localhost:8080/mqtt',
		decoderUrl: 'http://localhost/', //主项目前端部署地址,能访问到js/jessibuca/decoder.js文件
		qqmapKey,
		xinzhiKey,
	},
	// 生产环境配置
	production: {
		officialWebUrl: 'https://fastbee.cn/',
		baseUrl: 'http://localhost:8080/',
		mqttServer: protocalProd + 'localhost:8080/mqtt',
		decoderUrl: 'http://localhost/', //主项目前端部署地址,能访问到js/jessibuca/decoder.js文件
		qqmapKey,
		xinzhiKey,
	}
}
export default CONFIG[process.env.NODE_ENV];
