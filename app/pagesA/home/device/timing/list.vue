<template>
	<view class="device-timing-list-wrap">
		<view class="container-wrap">
			<view class="cell-group-wrap">
				<u-cell-group :border="false">
					<view class="cell-wrap" v-for="(item,index) in list" :key="index">
						<u-cell :title="item.jobName" :border="false" @click="handleDelete(item)">
							<u-icon slot="right-icon" size="18" name="minus-circle-fill" color="#ff7e7e"></u-icon>
						</u-cell>
					</view>
				</u-cell-group>
			</view>
			<u-loadmore :status="loadmoreStatus" v-if="total > queryParams.pageSize" loading-text="努力加载中..."
				loadmoreText="轻轻上拉" nomoreText="实在没有了" marginTop="20" marginBottom="30" />
		</view>
		<view class="other">
			<u-empty mode="data" :show="total === 0" icon="/static/common/empty.png" marginTop="60"
				text="数据为空"></u-empty>

			<u-modal :show="isDelete" showCancelButton confirmText="删除" @cancel="() => isDelete = false" title="温馨提示"
				:content="deleteContent" @confirm="handleConfirmDelete">
			</u-modal>
		</view>
	</view>
</template>

<script>
	import { getJobList, delJob } from '@/apis/modules/job.js';

	export default {
		data () {
			return {
				queryParams: {
					pageNum: 1,
					pageSize: 16,
					deviceId: null,
				},
				list: [], // 场景列表
				total: 0,
				loadmoreStatus: 'loadmore', // 刷新和加载相关
				isDelete: false,
				deleteId: '',
				deleteContent: '',
			};
		},
		onLoad (option) {
			this.queryParams.deviceId = Number(option.deviceId);
			this.getTimingDatas();
		},
		methods: {
			// 获取区设备列表
			getTimingDatas () {
				getJobList(this.queryParams)
					.then(res => {
						const { rows, total } = res;
						this.list = this.list.concat(rows);
						this.total = total;
					})
					.catch(err => {
						console.log(err);
					});
			},
			// 下拉刷新
			onPullDownRefresh () {
				this.list = [];
				this.queryParams.pageNum = 1;
				// 模拟网络请求
				setTimeout(x => {
					this.getTimingDatas();
					uni.stopPullDownRefresh();
				}, 1000);
			},
			// 上拉加载
			onReachBottom () {
				this.loadmoreStatus = 'loading';
				this.queryParams.pageNum = ++this.queryParams.pageNum;
				// 模拟网络请求
				setTimeout(() => {
					if ((this.queryParams.pageNum - 1) * this.queryParams.pageSize >= this.total) {
						this.loadmoreStatus = 'nomore';
					} else {
						this.loadmoreStatus = 'loading';
						this.getTimingDatas();
					}
				}, 1000);
			},
			// 删除
			handleDelete (item) {
				this.isDelete = true;
				this.deleteId = item.jobId;
				this.deleteContent = `确定删除“${item.jobName}”?`
			},
			// 确认删除
			handleConfirmDelete () {
				delJob(this.deleteId).then(res => {
					if (res.code === 200) {
						this.list = [];
						this.queryParams.pageNum = 1;
						this.getTimingDatas();
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg
						});
					}
					this.isDelete = false;
				}).catch(e => {
					console.log(e);
				});
			}
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
	.device-timing-list-wrap {
		.container-wrap {
			.cell-group-wrap {
				background-color: #fff;
				border-radius: 12rpx;
				margin: 30rpx;

				.cell-wrap {
					padding: 6rpx;

					&:not(:last-child) {
						border-bottom: 1rpx solid #F1F2F5;
					}
				}
			}
		}
	}
</style>