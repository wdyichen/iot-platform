<template>
	<page-meta>
		<navigation-bar title="IoT 物联网平台" background-color="#007AFF">
		</navigation-bar>
	</page-meta>
	<view class="home-wrap">
		<view class="container-wrap">
			<u-sticky zIndex="98">
				<view class="top-wrap">
					<view class="tab-wrap">
						<u-tabs :list="groupList" :scrollable="true" lineWidth="40" lineHeight="2"
							lineColor="transparent" :duration="100"
							:activeStyle="{ fontSize: '36rpx', color: '#3c9cff', fontWeight: 'bold' }"
							@change="handleTabChange">
							<view slot="right" class="add-btn" @tap="handleTopPopOpen">
								<u-icon name="plus-circle-fill" size="24" color='#3c9cff' bold></u-icon>
							</view>
						</u-tabs>
					</view>
				</view>
			</u-sticky>

			<view class="device-wrap">
				<view class="content-wrap">
					<view class="item-wrap" v-for="(device, index) in deviceList" :key="index">
						<view class="card"
							:style="{margin:(index%2==0?'15rpx 15rpx 15rpx 30rpx':'15rpx 30rpx 15rpx 15rpx')}"
							@tap="gotoDeviceDetail(device.deviceId)">
							<div style="height:25rpx;">
									<u--image v-if="device.isOwner===0" src="/static/home/device/share.png" mode="aspectFill"
									width="20" height="25rpx" ></u--image></div>
							<view class="top">
								<view class="img-wrap">
									<u--image v-if="device.imgUrl" :src="device.imageUrl" radius="10" mode="aspectFill"
										width="70" height="70">
										<view slot="error" style="font-size: 12px;">加载失败</view>
										<template v-slot:loading>
											<u-loading-icon></u-loading-icon>
										</template>
									</u--image>
									<u--image v-else-if="device.deviceType === 2" src="/static/common/gateway.png"
										radius="10" mode="aspectFill" width="70" height="70">
									</u--image>
									<u--image v-else-if="device.deviceType === 3" src="/static/common/video.png"
										radius="10" mode="aspectFill" width="70" height="70">
									</u--image>
									<u--image v-else src="/static/common/device.png" radius="10" mode="aspectFill"
										width="70" height="70">
									</u--image>
								</view>
								<view class="right-wrap">
									<view class="status-wrap">
										<u--text v-if="device.status == 3 && device.rssi >= '-55'" lines="1"
											prefixIcon="/static/wifi_4.png" iconStyle="margin-right:6rpx;" size="12"
											:text="statusTxt(device.status)"></u--text>
										<u--text
											v-else-if="device.status == 3 && device.rssi >= '-70' && device.rssi < '-55'"
											lines="1" prefixIcon="/static/wifi_3.png" iconStyle="margin-right:6rpx;"
											size="12" :text="statusTxt(device.status)"></u--text>
										<u--text
											v-else-if="device.status == 3 && device.rssi >= '-85' && device.rssi < '-70'"
											lines="1" prefixIcon="/static/wifi_2.png" iconStyle="margin-right:6rpx;"
											size="12" :text="statusTxt(device.status)"></u--text>
										<u--text
											v-else-if="device.status == 3 && device.rssi >= '-100' && device.rssi < '-85'"
											lines="1" prefixIcon="/static/wifi_1.png" iconStyle="margin-right:6rpx;"
											size="12" :text="statusTxt(device.status)"></u--text>
										<u--text v-else lines="1" prefixIcon="/static/wifi_0.png"
											iconStyle="margin-right:6rpx;" size="12" :text="statusTxt(device.status)">
										</u--text>
									</view>
									<view class="shadow-wrap">
										<u--text lines="1" prefixIcon="/static/state_active.png"
											iconStyle="margin-right:6rpx;" size="12" v-if="device.isShadow == 1"
											text="影子">
										</u--text>
										<u--text lines="1" prefixIcon="/static/state.png" iconStyle="margin-right:6rpx;"
											size="12" v-else text="影子"></u--text>
									</view>
								</view>
							</view>
							<view class="title">{{device.deviceName}}</view>
						</view>
					</view>
				</view>
				<u-empty mode="data" :show="total === 0" icon="/static/common/empty.png" marginTop="60"
					text="数据为空"></u-empty>
				<u-loadmore :status="loadStatus" v-if="total > queryParams.pageSize" loading-text="努力加载中..."
					loadmoreText="轻轻上拉" nomoreText="实在没有了" marginTop="15" marginBottom="15" />
			</view>
		</view>
		<view class="other">
			<u-popup :show="isShow" @close="handleTopPopClose" mode="top" round="10">
				<view style="padding:20px 0 10px 0;">
					<u-grid :border="false" col="4">
						<u-grid-item>
							<u-icon name="/static/ap.png" size="25" color="#fff" label="WiFi 配网添加" labelPos="bottom"
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
						<u-grid-item>
							<u-icon name="/static/ap.png" size="25" color="#fff" label="BLE 配网添加" labelPos="bottom"
								labelSize="15" space="10px" @click="gotoBleAddDevice()"
								customStyle="background-color:#307f7f;border-radius:3px;padding:10px;"></u-icon>
						</u-grid-item>
					</u-grid>
					<view>
						<u-row>
							<u-col :span="3">
								<u--text type="info" text="适用于 WiFi 类型的设备" size="12" customStyle="padding:10px 15px;">
								</u--text>
							</u-col>
							<u-col :span="3">
								<u--text type="info" text="适用于蜂窝网络/以太网类设备" size="12" customStyle="padding:10px 15px;">
								</u--text>
							</u-col>
							<u-col :span="3">
								<u--text type="info" text="适用于蜂窝网络/以太网类设备,并支持批量操作" size="12"
									customStyle="padding:10px 15px;"></u--text>
							</u-col>
							<u-col :span="3">
								<u--text type="info" text="适用于 WiFi/BLE 双模设备" size="12" customStyle="padding:10px 15px;">
								</u--text>
							</u-col>
						</u-row>
					</view>
				</view>
			</u-popup>

			<u-modal :show="modal.show" :content="modal.content" @confirm="confirm" @cancel="cancel"
				:showConfirmButton="modal.showConfirmButton" showCancelButton></u-modal>
			<u-loading-page style="z-index: 98" :loading="loading" bg-color="#eef3f7"
				loadingText="iot.yichen.link"></u-loading-page>
		</view>
	</view>
</template>

<script>
	import projectConfig from '@/env.config.js';
	
	import {
		getGroupList
	} from '@/apis/modules/group';
	import {
		listDeviceShort,
		deviceRelateUser
	} from '@/apis/modules/device';

	export default {
		components: {
			
		},
		data() {
			return {
				groupList: [], // 分组列表
				// 查询参数
				queryParams: {
					pageNum: 1,
					pageSize: 11,
					groupId: 0
				},
				loadStatus: 'loadmore', // 加载更多
				deviceList: [], // 设备列表
				total: 0, // 总条数
				isShow: false, // 顶部弹出层
				// 扫码模态窗
				modal: {
					show: false,
					showConfirmButton: false,
					content: ''
				},
				scanJson: {}, // 扫码获取的Json
				loading: true,
			};
		},
		onLoad() {
			if (this.profile == null) {
				this.getProfileInfo();
			}
			this.connectMqtt();
		},
		methods: {
			// 连接Mqtt消息服务器
			async connectMqtt() {
				if (this.$mqttTool.client == null) {
					await this.$mqttTool.connect(this.vuex_token);
				}
				this.mqttCallback();
				this.getDatas();
			},
			// Mqtt回调处理
			mqttCallback() {
				this.$mqttTool.client.on('message', (topic, message, buffer) => {
					let topics = topic.split('/');
					let productId = topics[1];
					let deviceNum = topics[2];
					message = JSON.parse(message.toString());
					if (!message) {
						return;
					}
					if (topics[3] == 'status') {
						console.log('接收到【设备状态】主题：', topic);
						console.log('接收到【设备状态】内容：', message);
						// 更新列表中设备的状态
						for (let i = 0; i < this.deviceList.length; i++) {
							if (this.deviceList[i].serialNumber == deviceNum) {
								this.deviceList[i].status = message.status;
								this.deviceList[i].isShadow = message.isShadow;
								this.deviceList[i].rssi = message.rssi;
								return;
							}
						}
					}
				});
			},
			// 订阅消息
			mqttSubscribe(list) {
				// 订阅当前页面设备状态和实时监测
				let topics = [];
				for (let i = 0; i < list.length; i++) {
					let topicStatus = '/' + list[i].productId + '/' + list[i].serialNumber + '/status/post';
					topics.push(topicStatus);
				}
				this.$mqttTool.subscribe(topics);
			},
			// 获取数据
			getDatas() {
				this.getGroups();
				this.getDevices();
			},
			// 获取分组列表
			getGroups() {
				getGroupList({
					userId: this.profile.userId
				}).then(res => {
					if (res.code === 200) {
						this.groupList = [{
							name: '全部',
							id: 0
						}];
						if (res.rows.length !== 0) {
							for (let i = 0; i < res.rows.length; i++) {
								this.groupList.push({
									name: res.rows[i].groupName,
									id: res.rows[i].groupId
								});
							}
						}
					}
				});
			},
			// 获取设备列表
			getDevices() {
				listDeviceShort(this.queryParams).then(response => {
					let {
						code,
						rows,
						total
					} = response;
					if (code === 200) {
						rows = rows.map(item => {
							item.imageUrl = item.imgUrl !== null && item.imgUrl !== '' ? projectConfig
								.baseUrl + item.imgUrl : item.imgUrl;
							return item;
						});
						if (this.queryParams.pageNum == 1) {
							this.deviceList = rows;
						} else {
							this.deviceList = this.deviceList.concat(rows);
						}
						this.total = total;
						const {
							pageNum,
							pageSize
						} = this.queryParams;
						this.loadStatus = total > pageNum * pageSize ? 'loadmore' : 'nomore';
						// 订阅消息
						if (this.deviceList && this.deviceList.length > 0) {
							this.mqttSubscribe(this.deviceList);
						}
					}
					this.deviceList = this.deviceList.filter(device => device.deviceId !== 118);
					console.log(this.deviceList)
					
					this.loading = false;
					uni.stopPullDownRefresh();
				});
			},
			getProfileInfo() {
				// 调用用户信息接口
				this.$api.common.getProfile().then(res => {
					//存储用户信息,TODO 需要调用一次，不然其他页面调用返回空
					uni.$u.vuex('profile', res.data);
					this.profile;
				}).catch(err => {
					this.$u.toast(err.msg);
				});
			},
			// 设备分组改变事件
			handleTabChange(item) {
				this.queryParams.groupId = item.id;
				this.queryParams.pageNum = 1;
				this.getDevices();
			},
			// 设备状态
			statusTxt(status) {
				let txt = '';
				switch (status) {
					case 1:
						txt = '未激活';
						break;
					case 2:
						txt = '禁用';
						break;
					case 3:
						txt = '在线';
						break;
					case 4:
						txt = '离线';
						break;
				}
				return txt;
			},
			// 跳转详情
			gotoDeviceDetail(deviceId) {
				uni.navigateTo({
					url: '/pagesA/home/device/index?deviceId=' + deviceId
				});
			},
			// 打开顶部弹窗
			handleTopPopOpen() {
				this.isShow = true;
			},
			// 关闭顶部弹窗
			handleTopPopClose() {
				this.isShow = false;
			},
			// 添加设备
			gotoAddDevice() {
				this.isShow = false;
				uni.navigateTo({
					url: '/pagesA/list/home/deviceAdd'
				});
			},
			// 添加BLE设备
			gotoBleAddDevice() {
				this.isShow = false;
				uni.navigateTo({
					url: '/pagesA/list/home/deviceAddBle'
				});
			},
			// 关联设备
			gotoRelateDevice() {
				this.isShow = false;
				uni.navigateTo({
					url: '/pagesA/list/home/deviceRelate'
				});
			},
			// 下拉刷新
			onPullDownRefresh() {
				this.list = [];
				this.queryParams.pageNum = 1;
				this.getDatas(); //重新获取数据
			},
			// 上拉加载
			onReachBottom() {
				this.queryParams.pageNum = this.queryParams.pageNum + 1;
				if ((this.queryParams.pageNum - 1) * this.queryParams.pageSize > this.total) {
					this.loadStatus = 'nomore';
				} else {
					this.loadStatus = 'loading';
					this.getDevices();
				}
			},
			/***************************************扫码关联设备***********************************************/
			// 模态窗确定
			confirm() {
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
						this.isShow = false;
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
			cancel() {
				this.modal = {
					show: false,
					showConfirmButton: false,
					content: ''
				};
			},
			// 扫码
			async openScan() {
				// #ifndef MP-WEIXIN || APP-PLUS
				uni.showToast({
					icon: 'none',
					title: '扫码只支持App和小程序'
				});
				return;
				// #endif

				// 权限问题，app 需要做权限说明
				let onlyFromCamera = false;
				// #ifdef APP-PLUS
				onlyFromCamera = true;
				let result = await this.$store.dispatch("permission/requestPermissions", 'CAMERA');
				if (result !== 1) return;
				// #endif
				this.startScanCode(onlyFromCamera);
			},
			startScanCode(onlyFromCamera) {
				uni.scanCode({
					onlyFromCamera, // 是否允许从相册扫码
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
			}
		}
	};
</script>

<style lang="scss">
	page {
		height: 100%;
		background: #eef3f7;
	}

	.home-wrap {
		// 不要设置height会影响u-sticky 算uviewbug吧
		// height: 100%;

		.container-wrap {
			// height: 100%;

			.top-wrap {
				background: #eef3f7;

				.swiper-wrap {
					padding: 30rpx;

					.swiper-item {
						display: block;
						height: 334rpx;
					}
				}

				.tab-wrap {
					padding: 0 12rpx;

					.add-btn {
						padding: 0 12rpx;
						background: #eef3f7;
					}
				}
			}

			.device-wrap {
				display: flex;
				flex-direction: column;
				justify-content: center;
				padding-bottom: 120rpx;

				.content-wrap {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					align-content: flex-start;
					width: 100%;

					.item-wrap {
						width: 50%;

						.card {
							box-shadow: 0 2rpx 0 0 rgba(0, 0, 0, .1);
							padding: 10rpx 20rpx 20rpx 20rpx;
							background-color: #fff;
							border-radius: 20rpx;

							.top {
								display: flex;
								flex-direction: row;
								align-items: center;
								justify-content: space-between;

								.img-wrap {}

								.right-wrap {
									margin-right: 20rpx;

									.status-wrap {}

									.shadow-wrap {
										margin-top: 15rpx;
									}
								}
							}

							.title {
								margin-top: 20rpx;
								font-size: 32rpx;
								padding: 10rpx;
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
							}
						}
					}
				}
			}
		}
	}
</style>