<script>
	export default {
		onLaunch: function () {
			console.log('App Launch');
		},
		onShow: function () {
			console.log('App Show');
			// #ifndef H5 || APP-PLUS
			//判断当前微信版本是否支持版本更新
			if (uni.canIUse('getUpdateManager')) {
				const updateManager = uni.getUpdateManager();
				// 请求完新版本信息的回调
				updateManager.onCheckForUpdate(function (res) {
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function () {
							uni.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								success: function (res) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									if (res.confirm) {
										updateManager.applyUpdate()
									}
								}
							})
						});
						// 新的版本下载失败
						updateManager.onUpdateFailed(function () {
							uni.showModal({
								title: '已经有新版本了哟~',
								content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
							})
						})
					}
				})
			} else {
				// 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
				uni.showModal({
					title: '提示',
					content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
				})
			}
			// #endif
		},
		onHide: function () {
			console.log('App Hide');
		}
	};
</script>

<style lang="scss">
	@import '@/uni_modules/uview-ui/index.scss';
</style>