<template>
	<page-meta>
		<navigation-bar title="个人中心" title-align="center" background-color="#007AFF" />
	</page-meta>
	<view class="user-wrap">
		<u-sticky offset-top="0">
			<view class="account-wrap">
				<view class="left-wrap">
					<view class="img-wrap" @click="handleToAvatar">
						<u--image :src="avatarUrl ? avatarUrl : '/static/avatar.png'" radius="5" width="50"
							height="50"></u--image>
					</view>
					<view class="title-wrap">
						<view class="name-wrap" v-if="wxStatus">
							<u-icon :label="profile.nickName" labelPos="left" labelSize="16" labelColor="#fff"
								space="10" bold name="/static/wechat_bind.png" size="22" color="#fff"
								@click="handleUnbindWeChart"></u-icon>
						</view>
						<!-- #ifdef H5-->
						<view class="name-wrap" v-if="!wxStatus">
							<u-icon :label="profile.nickName" labelPos="left" labelSize="16" labelColor="#fff"
								space="10" bold></u-icon>
						</view>
						<!-- #endif -->
						<!-- #ifdef APP-PLUS || MP-WEIXIN-->
						<view class="name-wrap" v-if="!wxStatus">
							<u-icon :label="profile.nickName" labelPos="left" labelSize="16" labelColor="#fff"
								space="10" bold name="/static/wechat_unbind.png" size="22" color="#fff"
								@click="handleBindWeChart"></u-icon>
						</view>
						<!-- #endif -->
						<!-- <u--text text="蜂信物联-开源物联网平台" color="#fff" size="12"></u--text> -->
					</view>
				</view>
				<view class="right-wrap">
					<u-icon name="arrow-right" color="#fff" size="20" @click="gotoAccount()"></u-icon>
				</view>
			</view>
		</u-sticky>

		<!-- <view class="grid-wrap">
			<u-grid :border="false" col="3">
				<u-grid-item>
					<u-icon name="/static/device_white.png" size="25" color="#fff" label="添加设备" labelPos="bottom"
						labelSize="11" space="10rpx" @click="openTop"
						customStyle="background-color:#f56c6c; border-radius:6rpx; padding:20rpx;"></u-icon>
				</u-grid-item>
				
				<u-grid-item>
					<u-icon name="/static/group_white.png" size="25" label="分组管理" labelPos="bottom" labelSize="11"
						space="10rpx" @click="gotoGroup()"
						customStyle="background-color:#f9ae3d; border-radius:6rpx; padding:20rpx;"></u-icon>
				</u-grid-item>

				<u-grid-item>
					<u-icon name="/static/simulate.png" size="25" color="#fff" label="平台消息" labelPos="bottom"
						labelSize="11" space="10rpx" @click="gotoEmulator()"
						customStyle="background-color:#5ac725; border-radius:6rpx; padding:20rpx;"></u-icon>
				</u-grid-item>
			</u-grid>
		</view> -->

		<!-- 会员升级 -->
		

		<view class="group-wrap">
			<u-cell-group>
				<!-- <u-cell title="账号" isLink @click="gotoAccount()" size="large">
					<u-icon slot="icon" size="20" name="account" color="#2979ff"></u-icon>
					<text slot="value"></text>
				</u-cell> -->
                <u-cell title="分组管理" isLink @click="gotoGroup()" size="large">
					<u-icon slot="icon" size="20" name="/static/group_white.png" customStyle="background-color:#f9ae3d;"></u-icon>
					<text slot="value"></text>
				</u-cell>
				<u-cell title="平台消息" isLink url="/pagesB/list/user/message" size="large">
					<u-icon slot="icon" size="20" name="email" color="#5ac725"></u-icon>
					<u-badge slot="value" :isDot="true" type="success"></u-badge>
				</u-cell>
				<!-- <u-cell title="设置" isLink url="/pages/tabBarB/user/setting" size="large">
					<u-icon slot="icon" size="20" name="setting" color="#0b969d"></u-icon>
					<text slot="value"></text>
				</u-cell> -->
				<!-- <u-cell title="手机监控" isLink url="/pagesB/tabBar/user/phone" size="large">
					<u-icon slot="icon" size="20" name="star-fill" color="#14cfa9"></u-icon>
					<text slot="value"></text>
				</u-cell> -->
				<u-cell title="密码修改" isLink @click="gotoResetPsd()" size="large">
					<u-icon slot="icon" size="20" name="lock" color="#bdbd00"></u-icon>
					<text slot="value"></text>
				</u-cell>
				<u-cell title="注销账号" isLink size="large" @click="handleUnsubscribe()">
					<u-icon slot="icon" size="20" name="warning" color="#d3077b"></u-icon>
				</u-cell>
				
			</u-cell-group>
		</view>

		<view class="group-wrap">
			<u-cell-group>
				<u-cell title="关于" isLink url="/pagesB/user/about" size="large">
					<u-icon slot="icon" size="20" name="info-circle" color="#0d5ce7"></u-icon>
					<text slot="value"></text>
				</u-cell>
				
				<!-- <u-cell isLink size="large">
					<u-link slot="title" href="https://gitee.com/kerwincui/wumei-smart/tree/master/app" text="APP下载"
						color="#333"></u-link>
					<u-icon slot="icon" size="20" name="download" color="#0d5ce7"></u-icon>
					<text slot="value"></text>
				</u-cell> -->
			</u-cell-group>
		</view>

		<view style="margin-top:10px;"><u-button :plain="true" size="large" text="退出账号" @click="handleExit"></u-button>
		</view>

		<view class="other-wrap">
			<u-modal :show="show" title="确认退出账号？" :showCancelButton="true" @cancel="cancelExit"
				@confirm="confirmExit"></u-modal>
			<u-popup :show="isTopShow" @close="closeTop" @open="openTop" mode="top" round="10">
				<view style="padding:20px 0 10px 0;">
					<u-grid :border="false" col="3">
						<u-grid-item>
							<u-icon name="/static/ap.png" size="25" color="#fff" label="配网添加" labelPos="bottom"
								labelSize="15" space="10px" @click="gotoAddDevice()"
								customStyle="background-color:#f56c6c;border-radius:3px;padding:10px;"></u-icon>
						</u-grid-item>
						<u-grid-item>
							<u-icon name="/static/scan.png" size="25" label="扫码添加" labelPos="bottom" labelSize="15"
								space="10px" @click="openScan"
								customStyle="background-color:#3c9cff;border-radius:3px;padding:10px;"></u-icon>
						</u-grid-item>
						<u-grid-item>
							<u-icon name="/static/relate.png" size="25" label="关联添加" labelPos="bottom" labelSize="15"
								space="10px" @click="gotoRelateDevice()"
								customStyle="background-color:#f9ae3d;border-radius:3px;padding:10px;"></u-icon>
						</u-grid-item>
					</u-grid>
					<view>
						<u-row>
							<u-col :span="4"><u--text type="info" text="适用于WIFI类型的设备" size="12"
									customStyle="padding:10px 15px;"></u--text></u-col>
							<u-col :span="4"><u--text type="info" text="适用于蜂窝网络/以太网类设备" size="12"
									customStyle="padding:10px 15px;"></u--text></u-col>
							<u-col :span="4"><u--text type="info" text="适用于蜂窝网络/以太网类设备,并支持批量操作" size="12"
									customStyle="padding:10px 15px;"></u--text></u-col>
						</u-row>
					</view>
				</view>
			</u-popup>
			<u-modal :show="modal.show" :content="modal.content" @confirm="confirm" @cancel="cancel"
				:showConfirmButton="modal.showConfirmButton" showCancelButton></u-modal>
			<u-modal :show="isUnsubscribe" title="账户注销确认" content='账户注销后,所有信息将被清空,且无法恢复,您是否要注销？' cancelText="暂不注销"
				confirmText="确认注销" :showCancelButton="true" confirmColor="#606266" cancelColor="#2979ff"
				@cancel="isUnsubscribe = false" @confirm="confirmUnsubscribe"></u-modal>
			<u-modal :show="isBindWeChart" title="微信绑定确认" content='您是否要绑定微信？' cancelText="暂不绑定" confirmText="确认绑定"
				:showCancelButton="true" @cancel="isBindWeChart = false" @confirm="confirmBindWeChart"></u-modal>
		</view>
	</view>
</template>

<script>
	import projectConfig from '@/env.config.js';
	import vipModel from '@/components/model/vip-model.vue';
	import { logout, secureBind, wechatBind } from '@/apis/modules/common';
	import { deviceRelateUser } from '@/apis/modules/device';

	export default {
		components: {
			vipModel
		},
		data () {
			return {
				avatarUrl: '', // 头像
				// 扫码模态窗
				modal: {
					show: false,
					showConfirmButton: false,
					content: ''
				},
				wxStatus: false,
				scanJson: {}, // 扫码获取的Json
				// 退出模态窗
				show: false,
				isTopShow: false, // 顶部弹出层
				isUnsubscribe: false, // 是否注销账号
				isBindWeChart: false, // 是否绑定微信
				isVipModel: false, // 是否会员升级
			};
		},
		onShow () {
			this.getProfile();
		},
		methods: {
			// 退出系统
			handleExit () {
				this.show = true;
			},
			// 取消退出系统
			cancelExit () {
				this.show = false;
			},
			// 确认退出系统
			confirmExit () {
				logout().then(() => {
					this.clearToken();
					// 跳转
					uni.reLaunch({
						url: '/pages/login/index'
					});
				});
			},
			//移动端微信解绑
			handleAppSecureBind () {
				uni.navigateTo({
					url: '/pagesB/user/secureBind'
				});
			},
			gotoAccount () {
				uni.$u.route('/pagesB/user/account');
			},
			// 添加设备
			gotoAddDevice () {
				this.isTopShow = false;
				uni.navigateTo({
					url: '/pagesA/list/home/deviceAdd'
				});
			},
			// 关联设备
			gotoRelateDevice () {
				this.isTopShow = false;
				uni.navigateTo({
					url: '/pagesA/list/home/deviceRelate'
				});
			},
			gotoEmulator () {
				uni.navigateTo({
					url: '/pagesB/list/user/message'
				});
			},
			
			//设备分组
			gotoGroup () {
				uni.navigateTo({
					url: '/pagesB/user/deviceGroup/index'
				});
			},
			// 清除token
			clearToken () {
				uni.setStorageSync('token', '');
			},
			getProfile () {
				// 调用用户信息接口
				this.$api.common.getProfile().then(res => {
					//存储用户信息,TODO 需要调用一次，不然其他页面调用返回空
					uni.$u.vuex('profile', res.data);
					this.avatarUrl = this.profile.avatar && projectConfig.baseUrl + this.profile.avatar;
					this.wxStatus = res.wxBind;
				}).catch(err => {
					this.$u.toast(err.msg);
				});
			},
			// 打开顶部弹窗
			openTop () {
				this.isTopShow = true;
			},
			// 关闭顶部弹窗
			closeTop () {
				this.isTopShow = false;
			},
			/***************************************扫码关联设备***********************************************/
			// 模态窗确定
			confirm () {
				this.cancel();
				let form = {
					deviceNumberAndProductIds: [{
						deviceNumber: this.scanJson.deviceNumber,
						productId: this.scanJson.productId
					}],
					userId: this.profile.userId
				};
				deviceRelateUser(form).then(res => {
					if (res.code == 200) {
						uni.showToast({
							icon: 'success',
							title: '保存成功'
						});
						this.isTopShow = false;
					} else {
						this.modal = {
							show: true,
							showConfirmButton: false,
							content: '发生错误：' + res.msg
						};
					}
				});
			},
			// 模态窗取消
			cancel () {
				this.modal = {
					show: false,
					showConfirmButton: false,
					content: ''
				};
			},
			// 扫码
			openScan () {
				// #ifndef MP-WEIXIN || APP-PLUS
				uni.showToast({
					icon: 'none',
					title: '扫码只支持App和小程序'
				});
				return;
				// #endif

				// 允许从相机和相册扫码
				uni.scanCode({
					success: res => {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						if (res.result.substr(0, 1) != '{') {
							console.log('坑点：解析二维码后第一个位置包含一个特殊字符，大部分编译器和调试工具识别不了这个特殊字符');
							res.result = res.result.substring(1);
						}
						// 解析JSON
						try {
							this.scanJson = JSON.parse(res.result);
							// type=1 代表扫码关联设备
							if (this.scanJson.type == 1) {
								this.modal = {
									show: true,
									showConfirmButton: true,
									content: '【设备编号:' + this.scanJson.deviceNumber + ', 产品名称:' + this
										.scanJson.productName + '】确定添加吗？'
								};
								return;
							}
							uni.showToast({
								icon: 'none',
								title: '解析二维码后，找不到对应处理类型'
							});
						} catch (error) {
							uni.showToast({
								icon: 'none',
								title: '解析二维码错误，格式不正确'
							});
						}
					}
				});
			},
			// 注销账户
			handleUnsubscribe () {
				this.isUnsubscribe = true;
			},
			//跳转密码修改
			gotoResetPsd(){
				/*uni.navigateTo({
					url:"/pagesB/user/resetPsd"
				})*/
				uni.$u.route('/pagesB/user/resetPsd');
			},
			confirmUnsubscribe () {
				logout().then(() => {
					this.clearToken();
					// 跳转
					uni.reLaunch({
						url: '/pages/login/index'
					});
				});
			},
			//跳转个人信息
			handleToAvatar () {
				const source = {
					album: '从手机相册选择',
					camera: '拍照',
				};
				const success = ({ tempFilePaths: a, tempFiles: b }) => {
					const image = a ? a[0] : b[0].path;
					uni.$u.route('/pagesB/user/avatar', { url: image });
				};
				const _uploadImage = (type) => {
					const sizeType = ['original', 'compressed'];
					uni.chooseImage({
						count: 1,
						sizeType,
						sourceType: [type],
						success
					});
				}
				const list = Object.entries(source);
				// #ifdef H5
				_uploadImage(list[0][0]);
				return;
				// #endif
				uni.showActionSheet({
					itemList: list.map(v => v[1]),
					success: async ({ tapIndex: i }) => {
						// #ifdef APP-PLUS
						const permissionID = list[i][0] === 'album' ? 'READ_EXTERNAL_STORAGE' : 'CAMERA';
						let result = await this.$store.dispatch("permission/requestPermissions", permissionID);
						if (result !== 1) return;
						// #endif
						_uploadImage(list[i][0]);
					}
				});
			},
			// 开通会员
			handleVipUpgrade () {
				this.isVipModel = true;
			},
			// 解绑微信
			handleUnbindWeChart () {
				uni.navigateTo({
					url: '/pagesB/user/secureBind'
				});
			},
			// 绑定微信
			handleBindWeChart () {
				this.isBindWeChart = true;
			},
			confirmBindWeChart () {
				this.isBindWeChart = false;
				let that = this;
				uni.login({
					provider: 'weixin',
					success: function (res) {
						if (res) {
							console.log('用户授权成功');
							// #ifdef APP-PLUS
							const params = {
								sourceClient: 'wechat_open_mobile',
								openId: res.authResult.openid,
								unionId: res.authResult.unionid,
							}
							// #endif
							// #ifdef MP-WEIXIN
							const params = {
								code: res.code,
								sourceClient: 'wechat_open_mini_program',
							}
							// #endif
							wechatBind(params).then(res => {
								if (res.code == 200) {
									uni.showToast({
										icon: 'none',
										title: '绑定成功！',
									});
									that.getProfile();
								} else {
									uni.$u.toast(res.msg);
								}
							}).catch(err => {
								console.log(err);
							});
						}
					}
				})
			}
		}
	};
</script>

<style lang="scss">
	page {
		background: #eef3f7;
	}

	.user-wrap {
		padding-bottom: 200rpx;
		background: #eef3f7;

		.account-wrap {
			display: flex;
			flex-direction: row;
			background-color: #007AFF;
			align-items: center;
			justify-content: space-between;

			.left-wrap {
				flex: 1;
				display: flex;
				flex-direction: row;
				align-items: center;
				padding: 20px;

				.img-wrap {}

				.title-wrap {
					display: flex;
					flex-direction: column;
					margin-left: 24rpx;

					.name-wrap {
						flex: 1;
						display: flex;
						flex-direction: row;
						margin-bottom: 15rpx;
					}
				}
			}

			.right-wrap {
				padding: 40rpx;
			}
		}

		.grid-wrap {
			background-color: #ffffff;
			padding: 40rpx;
		}

		.vip-wrap {
			margin: 20rpx 0;

			.vip {
				display: flex;
				flex-direction: row;
				padding: 20rpx 40rpx;
				align-items: center;
				background-color: #ffffff;

				.left {
					flex: 1;
				}
			}
		}

		.group-wrap {
			background-color: #ffffff;
			margin-top: 20rpx;
		}

		.other-wrap {
			.popup-title {
				margin: 20px 20px;
			}

			.btnclass {
				margin: 0px 20px 20px 20px;
				border-radius: 10px;
			}
		}

	}
</style>