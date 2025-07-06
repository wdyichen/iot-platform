<template>
	<view class="device-timing-wrap">
		<u-sticky zIndex="98" bgColor="#eef3f7">
			<view class="nav-bar">
				<view class="left-wrap">
					<view style="margin-right: 20rpx;">
						<u-icon name="list-dot" size="23" @click="goToTimingList"></u-icon>
					</view>
					<view v-if="!isSearch" style="margin-right: 20rpx;">
						<u-icon name="search" size="23" @click="isSearch = true"></u-icon>
					</view>
					<view v-else style="margin-right: 20rpx; width: 100%;">
						<!-- #ifndef APP-NVUE -->
						<u-input :customStyle="{ padding: '6rpx 18rpx'}" v-model="queryParams.jobName"
							placeholder="请输入定时名称" shape="circle" @clear="handleClearSearch" clearable>
						<!-- #endif -->
							<!-- #ifdef APP-NVUE -->
							<u--input :customStyle="{ padding: '6rpx 18rpx'}" v-model="queryParams.jobName"
								placeholder="请输入定时名称" shape="circle" @clear="handleClearSearch" clearable>
							<!-- #endif -->
								<template slot="prefix">
									<u-icon name="search" size="22" @click="isSearch = false"></u-icon>
								</template>
								<template slot="suffix">
									<u-button text="搜索" type="primary" shape="circle" size="mini"
										@click="handleSearch"></u-button>
								</template>
						<!-- #ifndef APP-NVUE -->
						</u-input>
						<!-- #endif -->
						<!-- #ifdef APP-NVUE -->
						</u--input>
						<!-- #endif -->
					</view>
				</view>
				<u-icon name="plus-circle-fill" size="23" color='#3c9cff' bold @tap="handleAddTiming"></u-icon>
			</view>
			<view class="tab-wrap">
				<u-tabs :list="statusGroup" :scrollable="true" lineWidth="40" lineHeight="2" lineColor="transparent"
					:duration="100" :activeStyle="{ fontSize: '36rpx', color: '#3c9cff', fontWeight: 'bold' }"
					@change="handleStatusChange">
				</u-tabs>
			</view>
		</u-sticky>

		<view class="container-wrap">
			<view class="item-wrap" v-for="(item, index) in dataList" :key="index">
				<view class="card" :style="{ margin: index === 0 ? '0 30rpx 30rpx' : '30rpx'}"
					@click="handleTimingDetail(item)">
					<view class="title">
						<u--text lines="1" prefixIcon="clock" :text="item.jobName"
							iconStyle="font-size: 30rpx; margin-right: 12rpx;"></u--text>
						<u-icon name="arrow-right" color="#606266" customStyle="margin-right:5px;" size="14"></u-icon>
					</view>

					<view class="cond" v-html="formatCronDisplay(item)"></view>
					<view class="cond">{{getActionMun(item.actions)}} 个任务</view>

					<view class="bottom-wrap" @tap.stop>
						<u--text lines="1" prefixIcon="/static/scene/once.png"
							iconStyle="width: 14px;height: 14px;margin-right: 3px;" size="13" text="执行一次"
							color='#3C9CFF' lineHeight="16" @click="handleRunOne(item)"></u--text>
						<u-switch v-model="item.status" @change="handleSwitchStatus(item)" activeValue="0"
							inactiveValue="1" activeColor="#3C9CFF" inactiveColor="#dbdbdb" size="18"></u-switch>
					</view>
				</view>
			</view>

			<u-loadmore :status="loadmoreStatus" v-if="total > queryParams.pageSize" loading-text="努力加载中..."
				loadmoreText="点击我加载更多" nomoreText="实在没有了" marginTop="20" @loadmore="loadMoreLogs" />
		</view>

		<u-loading-page :loading="loading" loadingText="fastbee.cn" bg-color="#eef3f7"></u-loading-page>

		<view class="other">
			<u-empty mode="data" :show="total === 0" icon="/static/common/empty.png" marginTop="60"
				text="数据为空"></u-empty>

			<u-modal :show="isModal" :title="modalTitle" :content="modalContent" @confirm="modalConfirm"
				@cancel="modalCancle" :showCancelButton="true"></u-modal>
		</view>
	</view>
</template>

<script>
	import { getJobList, runJob, changeJobStatus } from '@/apis/modules/job';

	export default {
		name: 'device-timing',
		props: {
			device: {
				type: Object,
				default: null,
				required: true
			},
			type: Number
		},
		watch: {
			device: {
				handler (val) {
					this.deviceInfo = val;
					this.queryParams.deviceId = val.deviceId;
				},
				deep: true,
			},
			type (val) {
				if (val === 1) {
					this.getList();
				}
			}
		},
		data () {
			return {
				loading: true, // 遮罩层
				isSearch: true,
				// 状态列表
				statusGroup: [{
						id: null,
						name: '全部'
					},
					{
						id: '0',
						name: '启用'
					},
					{
						id: '1',
						name: '未启用'
					}
				],
				deviceInfo: {}, // 设备信息
				queryParams: {
					pageNum: 1,
					pageSize: 4,
					deviceId: 0
				},
				dataList: [], // 列表数据
				total: 0, // 总条数
				loadmoreStatus: 'loadmore', // 加载更多
				// 模态窗显示
				handleType: 1, // 1-修改状态，2-执行一次
				isModal: false,
				modalTitle: '',
				modalContent: '',
				currentTiming: {}, // 当前选中的设备定时项
			};
		},
		methods: {
			// 获取列表数据
			getList () {
				getJobList(this.queryParams).then(res => {
					if (res.code === 200) {
						if (this.queryParams.pageNum == 1) {
							this.dataList = res.rows;
						} else {
							this.dataList = this.dataList.concat(res.rows);
						}
						this.total = res.total;
						setTimeout(() => {
							if ((this.queryParams.pageNum - 1) * this.queryParams.pageSize >= this.total) {
								this.loadmoreStatus = 'nomore';
							} else {
								this.loadmoreStatus = 'loadmore';
							}
						}, 1000);
					}
					this.loading = false;
				});
			},
			// 搜索
			handleSearch () {
				this.dataList = [];
				this.queryParams.pageNum = 1;
				this.getList();
			},
			handleClearSearch () {
				this.handleSearch();
			},
			goToTimingList () {
				const { deviceId } = this.deviceInfo;
				uni.$u.route('/pagesA/home/device/timing/list', { deviceId: deviceId });
			},
			// 新增
			handleAddTiming () {
				// 使用vuex会导致小程序性能问题所以存储本地
				let timingData = {
					jobId: null,
					jobName: '',
					jobGroup: 'DEFAULT', // 定时分组
					jobType: 1, // 任务类型 1=设备定时，2=设备告警，3=场景联动
					status: '0',
					isAdvance: 0, // 是否详细cron表达式
					time: uni.$u.timeFormat(new Date(), 'hh:MM'), // 辅助暂存数据
					repeat: '每天', // 辅助暂存数据
					repeatValue: [1, 2, 3, 4, 5, 6, 7], // 辅助暂存数据
					cronExpression: `0 ${uni.$u.timeFormat(new Date(),'MM')} ${uni.$u.timeFormat(new Date(),'hh')} ? * 1,2,3,4,5,6,7`,
					misfirePolicy: 2, // 1=立即执行，2=执行一次，3=放弃执行
					concurrent: 1, // 是否并发，1=禁止，0=允许
					productId: null,
					productName: '',
					deviceId: null,
					deviceName: '',
					serialNumber: '',
					sceneId: 0, // 场景ID
					alertId: 0, // 告警ID
					actions: [],
				};
				const storage = uni.getStorageSync('timingData');
				if (storage) {
					uni.removeStorageSync('timingData');
				}
				const { productId, productName, deviceId, deviceName, serialNumber } = this.deviceInfo;
				timingData = { ...timingData, productId, productName, deviceId, deviceName, serialNumber };
				uni.setStorageSync('timingData', timingData);
				uni.removeStorageSync('callback');
				uni.$u.route('/pagesA/home/device/timing/detail');
			},
			// 定时状态改变事件
			handleStatusChange (item) {
				this.dataList = [];
				this.queryParams.status = item.id;
				this.queryParams.pageNum = 1;
				this.getList();
			},
			// 格式化显示CRON描述
			formatCronDisplay (item) {
				let result = '';
				let time = '<span>' + item.cronExpression.substring(5, 7) + ':' + item.cronExpression.substring(2, 4) +
					'</span>';
				let week = item.cronExpression.substring(12);
				if (week == '1,2,3,4,5,6,7') {
					result = '每天 ' + time;
				} else {
					let weekArray = week.split(',');
					for (let i = 0; i < weekArray.length; i++) {
						if (weekArray[i] == '1') {
							result = result + '周一、';
						} else if (weekArray[i] == '2') {
							result = result + '周二、';
						} else if (weekArray[i] == '3') {
							result = result + '周三、';
						} else if (weekArray[i] == '4') {
							result = result + '周四、';
						} else if (weekArray[i] == '5') {
							result = result + '周五、';
						} else if (weekArray[i] == '6') {
							result = result + '周六、';
						} else if (weekArray[i] == '7') {
							result = result + '周日、';
						}
					}
					result = result.substring(0, result.length - 1) + " <span style='color:#3fd1ad'>( " + time +
						' )</span>';
				}
				return result;
			},
			// 获取任务个数
			getActionMun (json) {
				if (json) {
					return JSON.parse(json).length;
				} else {
					return 0;
				}
			},
			// 立即执行一次
			handleRunOne (row) {
				this.modalContent = '确认要立即执行一次"' + row.jobName + '"定时吗？';
				this.isModal = true;
				this.handleType = 2;
				this.currentTiming = row;
			},
			// 定时状态修改
			handleSwitchStatus (row) {
				let text = row.status === '0' ? '启用' : '停用';
				this.modalContent = '确认要"' + text + '""' + row.jobName + '"定时吗？';
				this.isModal = true;
				this.handleType = 1;
				this.currentTiming = row;
			},
			// 模态窗确定
			modalConfirm () {
				if (this.handleType == 1) { // 修改定时状态
					const { jobId, status } = this.currentTiming;
					const data = {
						jobId: jobId,
						status: status
					};
					changeJobStatus(data).then(res => {
						uni.showToast({
							icon: 'none',
							title: res.msg
						});
					});
				} else if (this.handleType === 2) { // 执行一次
					const { jobId, jobGroup } = this.currentTiming;
					const data = {
						jobId: jobId,
						jobGroup: jobGroup,
					};
					runJob(data).then(res => {
						uni.showToast({
							icon: 'none',
							title: res.msg
						});
					});
				}
				this.isModal = false;
			},
			// 模态窗取消
			modalCancle () {
				if (this.handleType == 1) {
					this.currentTiming.status = this.currentTiming.status === '0' ? '1' : '0';
				}
				this.isModal = false;
			},
			// 编辑
			handleTimingDetail (item) {
				const storage = uni.getStorageSync('timingData');
				if (storage) {
					uni.removeStorageSync('timingData');
				}
				const timingData = {
					jobId: null,
					jobName: '',
					jobGroup: 'DEFAULT', // 定时分组
					jobType: 1, // 任务类型 1=设备定时，2=设备告警，3=场景联动
					status: '0',
					isAdvance: 0, // 是否详细cron表达式
					time: uni.$u.timeFormat(new Date(), 'hh:MM'), // 辅助暂存数据
					repeat: '每天', // 辅助暂存数据
					repeatValue: [1, 2, 3, 4, 5, 6, 7], // 辅助暂存数据
					cronExpression: `0 ${uni.$u.timeFormat(new Date(),'MM')} ${uni.$u.timeFormat(new Date(),'hh')} ? * 1,2,3,4,5,6,7`,
					misfirePolicy: 2, // 1=立即执行，2=执行一次，3=放弃执行
					concurrent: 1, // 是否并发，1=禁止，0=允许
					productId: null,
					productName: '',
					deviceId: null,
					deviceName: '',
					serialNumber: '',
					sceneId: 0, // 场景ID
					alertId: 0, // 告警ID
					actions: [],
				};
				uni.setStorageSync('timingData', timingData);
				uni.removeStorageSync('callback');
				uni.$u.route('/pagesA/home/device/timing/detail', { jobId: item.jobId });
			},
			// 上拉加载（由于不是在新页面，所以只能点击加载)
			loadMoreLogs () {
				this.loadmoreStatus = 'loading';
				this.queryParams.pageNum = ++this.queryParams.pageNum;
				// 模拟网络请求
				setTimeout(() => {
					if ((this.queryParams.pageNum - 1) * this.queryParams.pageSize >= this.total) {
						this.loadmoreStatus = 'nomore';
					} else {
						this.loadmoreStatus = 'loading';
						this.getList();
					}
				}, 1000);
			},
			// 下拉刷新
			onPullDownRefresh () {
				this.dataList = [];
				this.queryParams.pageNum = 1;
				// 模拟网络请求
				setTimeout(x => {
					this.type === 1 && this.getList();
					uni.stopPullDownRefresh();
				}, 1000);
			},
		}
	};
</script>

<style>
	page {
		height: 100%;
		background: #eef3f7;
	}
</style>
<style lang="scss" scoped>
	.device-timing-wrap {
		.nav-bar {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			margin: 24rpx 26rpx 0;
			height: 74rpx;

			.left-wrap {
				flex: 1;
				display: flex;
				flex-direction: row;
				align-items: center;
			}
		}

		.tab-wrap {
			padding: 0 12rpx 10rpx 12rpx;

			.add-btn {
				padding: 0 20rpx;
			}
		}

		.container-wrap {
			.item-wrap {
				.card {
					box-shadow: 0 2rpx 0rpx 0 rgba(0, 0, 0, 0.1);
					border-radius: 20rpx;
					padding: 30rpx;
					background-color: #fff;

					.title {
						padding: 10rpx 0;
						display: flex;
						flex-direction: row;
					}

					.cond {
						font-size: 12px;
						color: #7e7e7e;
						margin-top: 10rpx;
					}

					.bottom-wrap {
						display: flex;
						flex-direction: row;
						padding: 20rpx 0 10rpx;
					}
				}
			}
		}
	}
</style>