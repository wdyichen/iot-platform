<template>
	<view class="device-timing-detail-wrap">
		<view class="name-wrap">
			<u--input clearable border="false" placeholder="请输入名称"
				:customStyle="{ backgroundColor: '#fff',  padding: '12px 30rpx', borderRadius: '10rpx' }" fontSize="16"
				v-model="timingData.jobName"></u--input>
		</view>
		<view class="container-wrap">
			<view class="cell-group-wrap">
				<u-cell-group :border="false">
					<view class="cell-wrap">
						<u-cell size="large" :border="false" title="定时状态">
							<u-switch v-model="timingData.status" slot="value" activeValue="0" inactiveValue="1"
								activeColor="#3C9CFF" inactiveColor="#dbdbdb" size="18"></u-switch>
						</u-cell>
					</view>
				</u-cell-group>
			</view>
			<view class="condition-wrap">
				<view class="form-wrap">
					<u--form errorType="toast" labelPosition="left" labelWidth="80" :labelStyle="{ fontSize: '32rpx' }">
						<view class="form-item-wrap">
							<u-form-item label="时间" @click="isTime = true">
								<u--input v-model="timingData.time" border="none" inputAlign="right" placeholder="请选择时间"
									disabledColor="#fff" disabled :customStyle="{ marginRight: '20rpx' }" />
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
						</view>
						<view class="form-item-wrap">
							<u-form-item label="重复" @click="isRepeat = true">
								<u--input v-model="timingData.repeat" border="none" inputAlign="right"
									placeholder="请选择星期" disabledColor="#fff" disabled
									:customStyle="{ marginRight: '20rpx' }" />
								<u-icon slot="right" name="arrow-right"></u-icon>
							</u-form-item>
						</view>
						<view class="form-item-wrap">
							<u-form-item label="CRON">
								<template slot="right">
									<u-radio-group v-model="timingData.isAdvance">
										<u-radio :customStyle="{marginRight: '30rpx'}" label="默认" :name="0"></u-radio>
										<u-radio :customStyle="{marginRight: '10rpx'}" label="自定义" :name="1"
											disabled></u-radio>
									</u-radio-group>
								</template>
							</u-form-item>
						</view>
						<view class="form-item-wrap">
							<u-form-item>
								<!-- #ifndef APP-NVUE -->
								<u-input v-model="timingData.cronExpression" placeholder="请输入CRON" disabled>
								<!-- #endif -->
									<!-- #ifdef APP-NVUE -->
									<u--input v-model="timingData.cronExpression" placeholder="请输入CRON" disabled>
									<!-- #endif -->
										<template slot="suffix">
											<u-button text="生成表达式" icon="calendar" type="primary" size="mini"
												disabled></u-button>
										</template>
								<!-- #ifndef APP-NVUE -->
								</u-input>
								<!-- #endif -->
								<!-- #ifdef APP-NVUE -->
								</u--input>
								<!-- #endif -->
							</u-form-item>
						</view>
					</u--form>
				</view>
			</view>
			<view class="execute-wrap">
				<view class="title-wrap">
					<view class="left-wrap">
						<text class="title">执行动作</text>
					</view>
					<view class="right-wrap">
						<u-icon name="plus-circle-fill" size="24" color='#3c9cff' bold @click="handleAddModel"></u-icon>
					</view>
				</view>
				<view v-if="timingData.actions.length === 0" class="empty-cell" @click="handleAddModel">
					<view class="text">添加任务</view>
				</view>
				<view v-else class="swipe-action-wrap">
					<u-swipe-action autoClose>
						<u-cell-group :border="false">
							<view class="action-item-wrap" v-for="(item,index) in timingData.actions"
								:key="getKey(index, item)">
								<!-- 设置key为不同id是为了解决uview的SwipeAction 滑动单元格 关闭事件 ，删除当前项，下一项自动弹出删除选择bug -->
								<u-swipe-action-item :options="swipeOptions" @click="handleDeleteSceneItem(index)">
									<u-cell :border="false" isLink
										@click="handleEditTimingItem({item:item, index:index})">
										<view slot="title" class="slot-title">
											<u--image :src="getImageUrl(item)" radius="4" width="33"
												height="33"></u--image>
											<view class="cell-text">
												<view class="title">{{item.deviceName}}</view>
												<view class="des">
													<template v-if="item.parentName && item.parentName !== item.name">
														{{item.parentName}} >>
													</template>
													<template v-if="item.arrayIndexName">
														{{item.arrayIndexName}} >>
													</template>
													{{item.name}}
													{{item.valueName ? item.valueName : item.value !== '' ? item.value : ''}}
												</view>
											</view>
										</view>
									</u-cell>
								</u-swipe-action-item>
							</view>
						</u-cell-group>
					</u-swipe-action>
				</view>
			</view>

			<view class="btn-save-wrap">
				<u-button type="primary" :customStyle="{ height: '96rpx' }" size="normal" text="保存"
					@click="handleSave"></u-button>
			</view>
		</view>
		<view class="other">
			<!-- 选择时间 -->
			<u-datetime-picker :show="isTime" v-model="timingData.time" mode="time" @cancel="isTime=false"
				@close="isTime=false" @confirm="handleDatetimeConfirm"></u-datetime-picker>

			<!-- 星期 -->
			<u-popup :show="isRepeat" :round="5" mode="bottom" bgColor="#eef3f7" :closeOnClickOverlay="true"
				@close="isRepeat = false">
				<view class="repeat-popup-wrap">
					<view class="nav">
						<text @click="isRepeat = false">取消</text>
						<text @click="handleRepeatConfirm">确认</text>
					</view>
					<view class="radio-group-wrap">
						<u-checkbox-group v-model="timingData.repeatValue" :borderBottom="false" placement="column"
							iconPlacement="right">
							<view class="radio-wrap">
								<u-checkbox label="周一" :name="2" iconSize="16"></u-checkbox>
							</view>
							<view class="radio-wrap">
								<u-checkbox label="周二" :name="3" iconSize="16"></u-checkbox>
							</view>
							<view class="radio-wrap">
								<u-checkbox label="周三" :name="4" iconSize="16"></u-checkbox>
							</view>
							<view class="radio-wrap">
								<u-checkbox label="周四" :name="5" iconSize="16"></u-checkbox>
							</view>
							<view class="radio-wrap">
								<u-checkbox label="周五" :name="6" iconSize="16"></u-checkbox>
							</view>
							<view class="radio-wrap">
								<u-checkbox label="周六" :name="7" iconSize="16"></u-checkbox>
							</view>
							<view class="radio-wrap">
								<u-checkbox label="周日" :name="1" iconSize="16"></u-checkbox>
							</view>
						</u-checkbox-group>
					</view>
				</view>
			</u-popup>

			<u-popup :show="isModel" :round="5" mode="bottom" bgColor="#eef3f7" :closeOnClickOverlay="true"
				@close="isModel = false">
				<view class="model-popup-wrap">
					<view class="title">物模型选择</view>
					<u-radio-group>
						<view class="cell-group-wrap">
							<u-cell-group :border="false">
								<view class="cell-wrap">
									<u-cell title="属性" :name="1" :border="false" isLink @click="goToModelList"></u-cell>
								</view>
								<view class="cell-wrap">
									<u-cell title="功能" :name="2" :border="false" isLink @click="goToModelList"></u-cell>
								</view>
							</u-cell-group>
						</view>
					</u-radio-group>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	import { getJob, addJob, updateJob } from '@/apis/modules/job.js';

	export default {
		data () {
			return {
				jobId: null,
				isTime: false,
				isRepeat: false,
				isModel: false,
				swipeOptions: [{ text: '删除', style: { backgroundColor: '#f56c6c' } }],
				timingData: {
					actions: []
				}
			};
		},
		onLoad (option) {
			this.jobId = Number(option.jobId);
			if (this.jobId) {
				this.getDetail();
			} else {
				this.timingData = uni.getStorageSync('timingData');
			}
		},
		onShow () {
			const callback = uni.getStorageSync('callback');
			if (callback) {
				this.timingData = uni.getStorageSync('timingData');
			}
		},
		onHide () {
			// 页面隐藏时关闭弹框
			this.isModel = false;
			// 保存当前页面数据
			uni.setStorageSync('timingData', this.timingData);
		},
		methods: {
			// 获取一键任务详情
			getDetail () {
				getJob(this.jobId).then(res => {
					if (res.code === 200) {
						// 计算时间和重复周期
						const { cronExpression } = res.data;
						const time = cronExpression.substring(5, 7) + ':' + cronExpression.substring(2, 4);
						const repeatValue = cronExpression.substring(12).split(',').map(Number);
						const repeat = this.getRepeatName(repeatValue)
						const actions = JSON.parse(res.data.actions);
						let timingData = uni.getStorageSync('timingData');
						this.timingData = {
							...timingData,
							...res.data,
							time,
							repeat,
							repeatValue,
							cronExpression,
							actions: actions,
						};
						uni.setStorageSync('timingData', this.timingData);
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg
						});
					}
				}).catch(err => {
					console.log('定时详情:', err);
				})
			},
			// 时间选择
			handleDatetimeConfirm () {
				this.$nextTick(() => {
					this.gentCronExpression();
				})
				this.isTime = false;
			},
			// 星期选择
			handleRepeatConfirm () {
				const repeat = this.getRepeatName(this.timingData.repeatValue);
				this.timingData.repeat = repeat;
				this.gentCronExpression();
				this.isRepeat = false;
			},
			// 获取repeat名称
			getRepeatName (repeatValue) {
				const list = repeatValue.map(item => {
					if (item === 2) {
						return '周一'
					} else if (item === 3) {
						return '周二'
					} else if (item === 4) {
						return '周三'
					} else if (item === 5) {
						return '周四'
					} else if (item === 6) {
						return '周五'
					} else if (item === 7) {
						return '周六'
					} else if (item === 1) {
						return '周日'
					}
				})
				if (list.length === 7) {
					return '每天';
				} else {
					return list.join(',');
				}
			},
			// 生成cron表达式
			gentCronExpression () {
				let hour = '00';
				let minute = '00';
				if (this.timingData.time) {
					hour = this.timingData.time.substring(0, 2);
					minute = this.timingData.time.substring(3);
				}
				let week = '*';
				if (this.timingData.repeatValue.length > 0) {
					week = this.timingData.repeatValue.sort();
				}
				this.timingData.cronExpression = '0 ' + minute + ' ' + hour + ' ? * ' + week;
			},
			// 获取设备图片
			getImageUrl (item) {
				if (item.type === 1) {
					return '/static/home/device/attribute.png';
				} else if (item.type === 2) {
					return '/static/home/device/function.png';
				} else {
					return '';
				}
			},
			handleAddModel () {
				uni.removeStorageSync('callback');
				this.isModel = true;
			},
			// 物模跳转
			goToModelList ({ name }) {
				let action = {
					id: '',
					name: '',
					value: '',
					valueName: '',
					type: 1,
					parentId: '',
					parentName: '',
					arrayIndex: '',
					arrayIndexName: '',
				};
				const { deviceId, deviceName } = this.timingData;
				const storage = uni.getStorageSync('action');
				if (storage) {
					uni.removeStorageSync('action');
				}
				action = { ...action, type: name, deviceId, deviceName };
				uni.setStorageSync('action', action);
				uni.$u.route('/pagesA/home/device/model');
			},
			// 删除触发、执行项
			handleDeleteSceneItem (index) {
				const { actions } = this.timingData;
				const list = actions.filter((item, i) => i !== index);
				this.timingData = { ...this.timingData, actions: [...list] };
			},
			// 编辑触发、执行项, 小程序转换问题，所以用对象传进来
			handleEditTimingItem (val) {
				const storage = uni.getStorageSync('action');
				if (storage) {
					uni.removeStorageSync('action');
				}
				uni.setStorageSync('action', val.item);
				uni.removeStorageSync('callback');
				uni.$u.route('/pagesA/home/device/model', { editIndex: val.index });
			},
			// 保存
			handleSave () {
				const { jobId, jobName, deviceId, actions, time, repeat, ...resd } = this.timingData;
				if (!jobName) {
					uni.showToast({
						icon: 'none',
						title: '定时名称不能为空',
					});
					return
				};
				if (actions.length === 0) {
					uni.showToast({
						icon: 'none',
						title: '执行任务不能为空',
					});
					return
				};
				const strActions = JSON.stringify(actions);
				const data = { ...resd, jobId, jobName, deviceId, actions: strActions };
				if (jobId) {
					updateJob(data).then(res => {
						if (res.code === 200) {
							uni.showToast({
								icon: 'none',
								title: '编辑成功',
							});
							uni.navigateBack({ delta: 1 });
						}
					});
				} else {
					addJob(data).then(res => {
						if (res.code === 200) {
							uni.showToast({
								icon: 'none',
								title: '新增成功',
							});
							uni.navigateBack({ delta: 1 });
						}
					});
				}
			},
			getKey (index, item) {
				return `${index}-${item.id}`
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
	.device-timing-detail-wrap {
		height: 100%;
		width: 100%;
		position: relative;

		.name-wrap {
			margin: 30rpx;
		}

		.container-wrap {
			padding-bottom: 140rpx;

			.cell-group-wrap {
				margin: 30rpx;

				.cell-wrap {
					background: #fff;
					border-radius: 12rpx;
				}
			}

			.condition-wrap {
				.form-wrap {
					background: #fff;
					margin: 30rpx;
					border-radius: 12rpx;

					.form-item-wrap {
						padding: 4rpx 30rpx;
					}
				}
			}

			.execute-wrap {
				margin: 30rpx;
				background: #fff;
				border-radius: 12rpx;
				padding-bottom: 12rpx;

				.title-wrap {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					padding: 30rpx;

					.left-wrap {
						flex: 1;
						display: flex;
						flex-direction: column;

						.title {
							font-size: 18px;
						}
					}

					.right-wrap {}
				}

				.empty-cell {
					padding: 30rpx;

					.text {
						height: 92rpx;
						border: 2rpx dashed #8686862e;
						border-radius: 12rpx;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						font-size: 28rpx;
					}
				}

				.swipe-action-wrap {
					.action-item-wrap {

						&:not(:last-child) {
							border-bottom: 2rpx solid #eaeefb;
						}

						.slot-title {
							display: flex;
							flex-direction: row;
							align-items: center;

							.cell-text {
								display: flex;
								flex-direction: column;
								justify-content: center;
								margin-left: 24rpx;

								.title {
									font-size: 32rpx;
								}

								.des {
									font-size: 28rpx;
									color: #868686;
								}
							}
						}
					}
				}

				.btn-wrap {
					padding: 0 28rpx;
					margin-top: 30rpx;
				}
			}

			.btn-save-wrap {
				position: fixed;
				bottom: 0;
				left: 0;
				right: 0;
				z-index: 999;
				padding: 30rpx 26rpx 40rpx;
				background: #eef3f7f7;
			}
		}

		.other {
			.repeat-popup-wrap {
				padding: 30rpx;

				.nav {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					font-size: 32rpx;
					margin-bottom: 34rpx;
				}

				.radio-group-wrap {
					background-color: #fff;
					border-radius: 12rpx;

					.radio-wrap {
						padding: 40rpx;

						&:not(:last-child) {
							border-bottom: 1rpx solid #F1F2F5;
						}
					}
				}
			}

			.model-popup-wrap {
				padding: 30rpx;

				.title {
					font-size: 32rpx;
					text-align: center;
					margin-bottom: 34rpx;
				}

				.cell-group-wrap {
					width: 100%;
					background: #fff;
					border-radius: 12rpx;

					.cell-wrap {
						padding: 6rpx 0;
						border-bottom: 1rpx solid #F1F2F5;
					}
				}
			}
		}
	}
</style>