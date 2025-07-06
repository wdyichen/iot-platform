<template>
	<view class="container">
		<view class="form-wrap">
			<u--form :model="accountForm" :rules="rules" ref="form" label-width="140rpx">
				<u-form-item prop="avatarUrl" label="用户头像" borderBottom @click="handleToAvatar">
					<view class="item-right" slot="right">
						<image :src="avatarUrl ? avatarUrl : '/static/avatar.png'"
							style="width: 80rpx; border-radius: 10rpx;" mode="widthFix">
						</image>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</u-form-item>
				<u-form-item prop="nickName" label="用户昵称" borderBottom>
					<view class="item-right" slot="right">
						<u--input v-model="accountForm.nickName" clearable border="none" inputAlign="right"
							placeholder="请输入用户昵称"></u--input>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</u-form-item>
				<u-form-item prop="email" label="电子邮箱" borderBottom>
					<view class="item-right" slot="right">
						<u--input v-model="accountForm.email" clearable border="none" inputAlign="right"
							placeholder="请输入电子邮箱"></u--input>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</u-form-item>
				<u-form-item prop="phonenumber" label="电话号码" borderBottom>
					<view class="item-right" slot="right">
						<u--input v-model="accountForm.phonenumber" clearable border="none" inputAlign="right"
							placeholder="请输入电话号码"></u--input>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</u-form-item>
				<u-form-item label="创建时间" borderBottom>
					<view class="item-right" slot="right">
						<u--input v-model="accountForm.createTime" clearable border="none" inputAlign="right"
							placeholder="请输入创建时间" readonly></u--input>
					</view>
				</u-form-item>
				<u-form-item label="登录ip" borderBottom>
					<view class="item-right" slot="right">
						<u--input v-model="accountForm.loginIp" clearable border="none" inputAlign="right"
							placeholder="请输入登录ip" readonly></u--input>
					</view>
				</u-form-item>
				<view style="margin-top:20px;"><u-button type="primary" text="保 存" @click="updateProfile()"></u-button>
				</view>
			</u--form>
		</view>
	</view>
</template>

<script>
	import projectConfig from '@/env.config.js';

	export default {
		data () {
			return {
				avatarUrl: '',
				accountForm: {
					nickName: '',
					email: '',
					phonenumber: '',
					createTime: '',
					loginIp: '',
				},
				rules: {
					nickName: {
						type: 'string',
						required: true,
						message: '请输入用户昵称',
						trigger: ['blur', 'change']
					},
					phonenumber: [{
							type: 'integer',
							min: 11,
							max: 11,
							required: true,
							message: '请输入手机号码',
							trigger: ['blur', 'change']
						},
						{
							validator: (rule, value, callback) => {
								return uni.$u.test.mobile(value);
							},
							message: '手机号码格式不正确',
							trigger: ['change', 'blur']
						}
					],
					email: [{
							required: true,
							message: '请输入邮箱',
							trigger: ['blur', 'change']
						},
						{
							validator: (rule, value, callback) => {
								return uni.$u.test.email(value);
							},
							message: '邮箱号码格式不正确',
							trigger: ['change', 'blur']
						}
					]
				},
			};
		},
		onReady () {
			// 兼容小程序
			this.$refs.form.setRules(this.rules);
		},
		onShow () {
			this.getProfile();
		},
		methods: {
			getProfile () {
				// 调用用户信息接口
				this.$api.common.getProfile().then(res => {
					const { data } = res;
					//存储用户信息,TODO 需要调用一次，不然其他页面调用返回空
					uni.$u.vuex('profile', data);
					this.accountForm = { ...data };
					this.avatarUrl = this.profile.avatar && projectConfig.baseUrl + this.profile.avatar;
				}).catch(err => {
					this.$u.toast(err.msg);
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
			// 调用修改个人信息接口
			updateProfile () {
				this.$refs.form.validate().then(res => {
					const params = { ...this.profile, ...this.accountForm };
					this.$api.account.updateProfile(params).then(res => {
						if (res.code == 200) {
							uni.showToast({
								title: '保存成功',
								icon: 'success',
								success: () => {
									uni.navigateBack()
								}
							});
						}
					}).catch(err => {
						this.$u.toast(err.msg);
					})
				})
			},
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		padding: 20px;
		background: #ffffff;

		.form-wrap {
			.item-right {
				display: flex;
				flex-direction: row;
			}

			::v-deep .u-form-item__body {
				height: 80rpx;
			}
		}
	}
</style>