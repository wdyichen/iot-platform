<template>
	<view class="device-model-wrap">
		<view class="container-wrap">
			<view class="group-wrap">
				<u-cell-group :border="false">
					<view class="cell-wrap" v-for="(item,index) in list" :key="index">
						<u-cell :border="false" isLink
							:arrow-direction="item.datatype.type === 'object' || item.datatype.type === 'array' ? 'left' : 'down'"
							@click="handleModel(item)">
							<view slot="title"> {{item.name}}</view>
						</u-cell>
					</view>
				</u-cell-group>
			</view>
		</view>
		<view class="other">
			<u-empty mode="data" :show="list.length === 0" icon="/static/common/empty.png" marginTop="60"
				text="数据为空"></u-empty>

			<!-- integer、decimal 类型 -->
			<u-popup :show="isInteger" :round="5" mode="bottom" bgColor="#eef3f7" :closeOnClickOverlay="false"
				@close="isInteger = false">
				<view class="integer-popup-wrap">
					<view class="nav">
						<text @click="isInteger = false">取消</text>
						<text @click="handleConfirmInteger">确认</text>
					</view>
					<view class="select-wrap">
						<view class="num-wrap">
							<text class="num">{{value}}</text>
							<text class="unit">{{model.datatype.unit}}</text>
						</view>
						<view class="slider-wrap">
							<u-slider :min="model.datatype.min === undefined ? 0 : model.datatype.min"
								:max="model.datatype.max === undefined ? 100 : model.datatype.max"
								:step="model.datatype.step === undefined ? 1 : model.datatype.step"
								@input="handleSliderChange"></u-slider>
							<view class="limit">
								<text>
									{{`${model.datatype.min === undefined ? 0 : model.datatype.min} ${model.datatype.unit || ''}`}}
								</text>
								<text>
									{{`${model.datatype.max === undefined ? 0 : model.datatype.max} ${model.datatype.unit || ''}`}}
								</text>
							</view>
						</view>
					</view>
				</view>
			</u-popup>

			<!-- bool 类型 -->
			<u-popup :show="isBool" :round="5" mode="bottom" bgColor="#eef3f7" :closeOnClickOverlay="false"
				@close="isBool = false">
				<view class="bool-popup-wrap">
					<view class="nav">
						<text @click="isBool = false">取消</text>
						<text @click="handleConfirmBool">确认</text>
					</view>
					<view class="radio-group-wrap">
						<u-radio-group v-model="value" :borderBottom="false" placement="column" iconPlacement="right">
							<view class="radio-wrap">
								<u-radio label="开" :name="1" iconSize="16"></u-radio>
							</view>
							<view class="radio-wrap">
								<u-radio label="关" :name="0" iconSize="16"></u-radio>
							</view>
						</u-radio-group>
					</view>
				</view>
			</u-popup>

			<!-- enum 类型 -->
			<u-popup :show="isEnum" :round="5" mode="bottom" bgColor="#eef3f7" :closeOnClickOverlay="false"
				@close="isEnum = false">
				<view class="enum-popup-wrap">
					<view class="nav">
						<text @click="isEnum = false">取消</text>
						<text @click="handleConfirmEnum">确认</text>
					</view>
					<view class="radio-group-wrap">
						<u-radio-group v-model="value" :borderBottom="false" placement="column" iconPlacement="right">
							<view class="radio-wrap" v-for="(item, index) in model.datatype.enumList" :key="index">
								<u-radio :label="item.text" :name="item.value" iconSize="16"></u-radio>
							</view>
						</u-radio-group>
					</view>
				</view>
			</u-popup>

			<!-- string 类型 -->
			<u-popup :show="isString" :round="5" mode="bottom" bgColor="#eef3f7" :closeOnClickOverlay="false"
				@close="isString = false">
				<view class="string-popup-wrap">
					<view class="nav">
						<text @click="isString = false">取消</text>
						<text @click="handleConfirmString">确认</text>
					</view>
					<view class="select-wrap">
						<view class="input-wrap">
							<u--input v-model="value" :customStyle="{ padding: '24rpx' }" placeholder="请输入内容"
								border="surround" fontSize="16" clearable></u--input>
						</view>
					</view>
				</view>
			</u-popup>

			<!-- 操作符 -->
			<u-popup :show="isOperator" :round="5" mode="bottom" :closeOnClickOverlay="true" zIndex="10076"
				@close="isOperator = false">
				<view class="operator-popup-wrap">
					<view class="cell-group-wrap">
						<u-cell-group :border="false">
							<view class="cell-wrap" v-for="(item,index) in oprGroup" :key="index"
								v-if="item.types.length === 0 || item.types.includes(model.datatype.type)">
								<u-cell :title="item.name" :name="item.value"
									@click="handleConfirmOperator(item)"></u-cell>
							</view>
							<view class="cell-wrap">
								<u-cell title="取消" name="cancel" :border="false"
									@click="handleConfirmOperator({ value: 'cancel' })"></u-cell>
							</view>
						</u-cell-group>
					</view>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	import { getCacheThingsModel } from '@/apis/modules/device.js';
	import { navigateBackTo } from '@/utils/common.js';

	export default {
		data () {
			return {
				editIndex: null, // null 代表新增
				parentId: null,
				list: [], // 属性
				isInteger: false, // 整型
				oprGroup: [{
						types: [],
						name: '等于（=）',
						value: '=',
					},
					{
						types: [],
						name: '不等于（!=）',
						value: '!=',
					},
					{
						types: ['integer', 'decimal'],
						name: '大于（>）',
						value: '>',
					},
					{
						types: ['integer', 'decimal'],
						name: '小于（<）',
						value: '<',
					},
					{
						types: ['integer', 'decimal'],
						name: '大于等于（>=）',
						value: '>=',
					},
					{
						types: ['integer', 'decimal'],
						name: '小于等于（<=）',
						value: '<=',
					},
					{
						types: ['integer', 'decimal'],
						name: '在...之间（between）',
						value: 'between',
					},
					{
						types: ['integer', 'decimal'],
						name: '不在...之间（notBetween）',
						value: 'notBetween',
					},
					{
						types: ['string'],
						name: '包含（contain）',
						value: 'contain',
					},
					{
						types: ['string'],
						name: '不包含（notContain）',
						value: 'notContain',
					}
				],
				isOperator: false, // 操作符
				isBool: false,
				isEnum: false, // 枚举
				isString: false,
				model: {
					datatype: {},
				},
				value: null, // 属性值
				action: {},
			};
		},
		onLoad (option) {
			const { data, editIndex } = option;
			this.editIndex = Number(editIndex);
			if (data) {
				this.list = JSON.parse(data);
			} else {
				const { productId } = uni.getStorageSync('timingData');
				this.action = uni.getStorageSync('action');
				this.productId = productId;
				this.$nextTick(() => {
					this.getModelDatas();
				})
			};
		},
		methods: {
			// 获取区设备列表
			getModelDatas () {
				getCacheThingsModel(this.productId)
					.then(res => {
						if (res.code === 200) {
							let data = JSON.parse(res.data);
							this.list = this.formatArrayIndex(data);
						} else {
							uni.showToast({
								icon: 'none',
								title: res.msg
							});
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			// 物模型格式化处理
			formatArrayIndex (data) {
				let obj = { ...data };
				for (let o in obj) {
					obj[o] = obj[o].map((item) => {
						item = { ...item, level: 'parent' };
						if (item.datatype.type === 'array') {
							let arrayModel = [];
							for (let k = 0; k < item.datatype.arrayCount; k++) {
								let index = k > 9 ? String(k) : '0' + k;
								if (item.datatype.arrayType === 'object') {
									arrayModel.push({
										id: index,
										name: item.name + ' ' + (k + 1),
										level: 'index',
										datatype: {
											type: item.datatype.arrayType,
											params: item.datatype.params
										},
									});
								} else {
									arrayModel.push({
										id: index,
										name: item.name + ' ' + (k + 1),
										level: 'index',
										datatype: {
											type: item.datatype.arrayType,
										},
									});
								}
							}
							item.datatype.arrayModel = arrayModel;
						}
						return item;
					});
				}
				let list = [];
				if (this.action.type == 1) {
					list = obj.properties || [];
				} else if (this.action.type == 2) {
					list = obj.functions || [];
				} else if (this.action.type == 3) {
					list = obj.events || [];
				}
				list = list.filter((item) => {
					if (item.datatype.params && item.datatype.params.length !== 0) {
						item.datatype.params = item.datatype.params.filter((item) => item.isMonitor == 0 && item
							.isReadonly == 0);
					}
					return item.isMonitor == 0 && item.isReadonly == 0;
				});
				return list;
			},
			// 选中选择
			handleModel (item) {
				this.model = item;
				// 存储 parentId 和 arrayIndex
				let action = uni.getStorageSync('action');
				if (item.level === 'parent') {
					action = {
						...action,
						parentId: item.id,
						parentName: item.name,
						arrayIndex: '',
						arrayIndexName: ''
					};
				}
				if (item.level === 'index') {
					action = {
						...action,
						arrayIndex: item.id,
						arrayIndexName: item.name
					};
				}
				uni.setStorageSync('action', action);
				// 根据类型弹出对应框
				const { datatype } = item;
				const { type, params, arrayModel } = datatype;
				this.value = null;
				if (type === 'integer' || type === 'decimal') {
					this.isInteger = true;
					this.value = datatype.min ? datatype.min : 0;
					this.valueA = null;
					this.valueB = null;
				} else if (type === 'bool') {
					this.isBool = true;
				} else if (type === 'enum') {
					this.isEnum = true;
				} else if (type === 'string') {
					this.isString = true
				} else if (type === 'object') {
					uni.$u.route('/pagesA/home/device/model', {
						type: this.type,
						data: JSON.stringify(params),
						editIndex: this.editIndex
					});
				} else if (type === "array") {
					uni.$u.route('/pagesA/home/device/model', {
						type: this.type,
						data: JSON.stringify(arrayModel),
						editIndex: this.editIndex
					});
				}
			},
			// slider 负数会有问题，所以采用这方式
			handleSliderChange (value) {
				if (this.model.datatype.step) {
					const str = this.model.datatype.step.toString();
					const places = str.match(/\.(\d+)/);
					const num = places ? places[1].length : 0;
					this.value = value.toFixed(num);
				} else {
					this.value = value;
				}
			},
			// 整型、浮点型
			handleConfirmInteger () {
				const { id, name } = this.model;
				const { tempId, tempName } = this.getModelIdAndName(id, name);
				const model = {
					id: tempId,
					name: tempName,
					value: this.value,
					valueName: ''
				};
				this.setModelData(model);
				this.isInteger = false;
				uni.setStorageSync('callback', true);
				navigateBackTo('/pagesA/home/device/timing/detail');
			},
			//  bool 类型
			handleConfirmBool () {
				const { id, name } = this.model;
				if (this.value === null) {
					uni.showToast({
						icon: 'none',
						title: '请选择值'
					});
					return;
				};
				const { tempId, tempName } = this.getModelIdAndName(id, name);
				const model = {
					id: tempId,
					name: tempName,
					value: this.value,
					valueName: this.value === 1 ? '开' : '关'
				};
				this.setModelData(model);
				this.isBool = false;
				uni.setStorageSync('callback', true);
				navigateBackTo('/pagesA/home/device/timing/detail');
			},
			// enum 类型
			handleConfirmEnum () {
				const { id, name } = this.model;
				if (!this.value) {
					uni.showToast({
						icon: 'none',
						title: '请选择值'
					});
					return;
				};
				const { tempId, tempName } = this.getModelIdAndName(id, name);
				const obj = this.model.datatype.enumList.find(item => item.value === this.value);
				const model = {
					id: tempId,
					name: tempName,
					value: this.value,
					valueName: obj.text,
				};
				this.setModelData(model);
				this.isEnum = false;
				uni.setStorageSync('callback', true);
				navigateBackTo('/pagesA/home/device/timing/detail');
			},
			// string 类型
			handleConfirmString () {
				const { id, name } = this.model;
				if (!this.value) {
					uni.showToast({
						icon: 'none',
						title: '请设置对应值'
					});
					return;
				};
				const { tempId, tempName } = this.getModelIdAndName(id, name);
				const model = {
					id: tempId,
					name: tempName,
					value: this.value,
					valueName: ''
				};
				this.setModelData(model);
				this.isString = false;
				uni.setStorageSync('callback', true);
				navigateBackTo('/pagesA/home/device/timing/detail');
			},
			// 获取model的id和name
			getModelIdAndName (id, name) {
				let tempId = id;
				let tempName = name;
				const { parentId, parentName, arrayIndex, arrayIndexName } = uni.getStorageSync('action');
				if (arrayIndex) { // 代表是数组类型
					if (arrayIndex === id) { // 数组
						tempId = `array_${arrayIndex}_${parentId}`;
						tempName = parentName;
					} else { // 数组对象
						tempId = `array_${arrayIndex}_${id}`;
					}
				}
				else{
						tempId=id;
					}
				return { tempId, tempName }
			},
			// 存储数据
			setModelData (data) {
				let action = uni.getStorageSync('action');
				const { id, name, value, valueName } = data;
				action = { ...action, id, name, value, valueName };
				uni.setStorageSync('action', action);
				// 更新或者插入新的触发或者执行
				let { actions, ...res } = uni.getStorageSync('timingData');
				if (Number.isNaN(this.editIndex) || this.editIndex === null) {
					actions.push(action);
					uni.setStorageSync('timingData', { actions, ...res });
				} else {
					let list = actions.map((item, i) => {
						if (i == this.editIndex) {
							return action
						} else {
							return item
						}
					});
					uni.setStorageSync('timingData', { actions: [...list], ...res });
				}
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
	.device-model-wrap {
		.container-wrap {
			.group-wrap {
				margin: 30rpx;
				background: #fff;
				border-radius: 12rpx;

				.cell-wrap {
					padding: 7rpx 0;
					border-bottom: 1rpx solid #F1F2F5;
				}
			}
		}

		.other {
			.integer-popup-wrap {
				padding: 30rpx;

				.nav {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					font-size: 32rpx;
					margin-bottom: 34rpx;
				}

				.select-wrap {
					background-color: #fff;
					border-radius: 10rpx;
					padding: 40rpx 20rpx;

					.form-wrap {
						.form-item-wrap {
							padding: 4rpx 20rpx;
						}
					}

					.num-wrap {
						position: relative;
						margin-top: 60rpx;
						text-align: center;

						.num {
							font-size: 80rpx;
						}

						.unit {
							position: absolute;
							top: 50%;
							margin-top: -23rpx;
							font-size: 32rpx;
							color: #868686;
							margin-left: 60rpx;
						}
					}

					.slider-wrap {
						.limit {
							font-size: 28rpx;
							color: #868686;
							display: flex;
							flex-direction: row;
							justify-content: space-between;
							padding: 0 30rpx;
						}
					}

					.range-wrap {
						display: flex;
						flex-direction: row;
						align-items: center;
						margin-top: 30rpx;
					}
				}
			}

			.operator-popup-wrap {
				padding: 10rpx 0 20rpx;

				.cell-group-wrap {
					background: #eef3f7;

					.cell-wrap {
						text-align: center;
						background: #fff;
						padding: 10rpx;

						&:last-child {
							margin-top: 15rpx;
						}
					}
				}
			}

			.bool-popup-wrap,
			.enum-popup-wrap {
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
					border-radius: 10rpx;

					.radio-wrap {
						padding: 40rpx;

						&:not(:last-child) {
							border-bottom: 1rpx solid #F1F2F5;
						}
					}
				}
			}

			.string-popup-wrap {
				padding: 30rpx;

				.nav {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					font-size: 32rpx;
					margin-bottom: 34rpx;
				}

				.select-wrap {
					background-color: #fff;
					border-radius: 10rpx;
					padding: 40rpx 20rpx;

					.form-wrap {
						.form-item-wrap {
							padding: 4rpx 20rpx;
						}
					}

					.input-wrap {
						margin: 32rpx 12rpx 20rpx;
					}

				}
			}
		}
	}
</style>