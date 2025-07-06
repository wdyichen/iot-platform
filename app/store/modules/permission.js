import permision from "@/utils/permission.js";

const state = {
	ACCESS_FINE_LOCATION: false,
	CAMERA: false,
	READ_EXTERNAL_STORAGE: false,
	/* #ifdef APP-PLUS */
	isIos: plus.os.name == "iOS",
	/* #endif */
	mapping: {
		'ACCESS_FINE_LOCATION': {
			title: "位置信息权限说明",
			content: "便于您使用该功能获取当前位置天气情况、WIFI列表等场景。",
			methods: 'SET_ACCESS_FINE_LOCATION'
		},
		'CAMERA': {
			title: "相机权限说明",
			content: "便于您使用该功能扫码添加设备。",
			methods: 'SET_CAMERA'
		},
		'READ_EXTERNAL_STORAGE': {
			title: "存储空间/照片权限说明",
			content: "便于您使用该功能上传您的照片/图片及用于更换头像与扫描添加设备等场景中读取和写入相册和文件内容。",
			methods: 'SET_READ_EXTERNAL_STORAGE'
		},
	}
}
const mutations = {
	SET_ACCESS_FINE_LOCATION (state, val) {
		state.ACCESS_FINE_LOCATION = val;
	},
	SET_CAMERA (state, val) {
		state.CAMERA = val;
	},
	SET_READ_EXTERNAL_STORAGE (state, val) {
		state.READ_EXTERNAL_STORAGE = val;
	}
}
const actions = {
	//权限获取
	async requestPermissions ({
		state,
		dispatch,
		commit
	}, permissionID) {
		try {
			if (!state[permissionID] && !state.isIos) {
				var viewObj = await dispatch('nativeObjView', permissionID);
				viewObj.show();
			}
			return new Promise(async (resolve, reject) => {
				//苹果不需要这个
				if (state.isIos) {
					resolve(1);
					return;
				}
				// Android权限查询
				const result = await permision.requestAndroidPermission(
					'android.permission.' + permissionID
				);
				if (result === 1) {
					//'已获得授权'
					commit(state.mapping[permissionID].methods, true);
				} else if (result === 0) {
					//'未获得授权'
					commit(state.mapping[permissionID].methods, false);
				} else {
					commit(state.mapping[permissionID].methods, true);
					uni.showModal({
						title: '提示',
						content: '操作权限已被拒绝，请手动前往设置',
						confirmText: "立即设置",
						success: (res) => {
							if (res.confirm) {
								permision.gotoAppPermissionSetting();
							}
						}
					})
				}
				if (viewObj) viewObj.close();
				resolve(result);
			});
		} catch (error) {
			console.log(error);
			reject(error);
		}
	},
	//提示框
	nativeObjView ({ state }, permissionID) {
		const systemInfo = uni.getSystemInfoSync();
		const statusBarHeight = systemInfo.statusBarHeight;
		const navigationBarHeight = systemInfo.platform === 'android' ? 48 :
			44; // Set the navigation bar height based on the platform
		const totalHeight = statusBarHeight + navigationBarHeight;
		let view = new plus.nativeObj.View('per-modal', {
			top: '0px',
			left: '0px',
			width: '100%',
			backgroundColor: '#444',
		});
		view.drawRect({
			color: '#fff',
			radius: '10px'
		}, {
			top: totalHeight + 'px',
			left: '5%',
			width: '90%',
			height: "100px",
		});
		view.drawText(state.mapping[permissionID].title, {
			top: totalHeight + 7 + 'px',
			left: "10%",
			height: "32px"
		}, {
			align: "left",
			color: "#000",
		}, {
			onClick: function (e) {
				console.log(e);
			}
		});
		view.drawText(state.mapping[permissionID].content, {
			top: totalHeight + 35 + 'px',
			height: "62px",
			left: "10%",
			width: "80%"
		}, {
			whiteSpace: 'normal',
			size: "14px",
			align: "left",
			color: "#656563"
		});

		function show () {
			view = plus.nativeObj.View.getViewById('per-modal');
			view.show()
			view = null //展示的时候也得清空，不然影响下次的关闭，不知道为啥
		};

		function close () {
			view = plus.nativeObj.View.getViewById('per-modal');
			view.close();
			view = null
		};
		return {
			show,
			close
		};
	},
}
export default {
	namespaced: true,
	state,
	mutations,
	actions
};