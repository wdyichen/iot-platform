<template>
	<view class="container">
		<view class="form-wrap">
			<u--form :model="passwordForm" :rules="rules" ref="form" label-width="140rpx">
				<u-form-item prop="oldPsd" label="旧密码" borderBottom>
					<view class="item-right" slot="right">
						<u--input v-model="passwordForm.oldPsd" clearable border="none" inputAlign="right" password
							placeholder="请输入旧密码"></u--input>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</u-form-item>
				<u-form-item prop="newPsd" label="新密码" borderBottom>
					<view class="item-right" slot="right">
						<u--input v-model="passwordForm.newPsd" clearable border="none" inputAlign="right" password
							placeholder="请输入新密码"></u--input>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</u-form-item>
				<u-form-item prop="confirmPsd" label="确认密码" borderBottom>
					<view class="item-right" slot="right">
						<u--input v-model="passwordForm.confirmPsd" clearable border="none" inputAlign="right" password
							placeholder="请确认新密码"></u--input>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</u-form-item>
				<view style="margin-top:20px;"><u-button type="primary" text="保 存" @click="submit()"></u-button>
				</view>

			</u--form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				passwordForm: {
					oldPsd: '',
					newPsd: '',
					confirmPsd: '',
				},
				rules: {
					oldPsd: {
						type: 'string',
						required: true,
						message: '请输入旧密码',
						trigger: ['blur', 'change']
					},
					newPsd: {
						type: 'string',
						required: true,
						min: 6,
						max: 20,
						message: '长度在6-20个字符',
						trigger: ['blur', 'change']
					},
					confirmPsd: [{

							type: 'string',
							required: true,
							message: '确认密码不能为空',
							trigger: ['blur', 'change']

						},
						{
							validator: (rule, value, callback) => {
								if (this.passwordForm.newPsd !== value) {
									callback(new Error("两次输入的密码不一致"));
								} else {
									callback();
								}

							}
						}
					]

				}
			}
		},
		onReady() {
			// 兼容小程序
			this.$refs.form.setRules(this.rules);
		},

		methods: {
			//调用修改密码接口
			submit() {
				this.$refs.form.validate().then(res => {
					const params = {
						oldPassword: this.passwordForm.oldPsd,
						newPassword: this.passwordForm.newPsd
					}
					this.$api.account.updateUserPwd(params).then(
						res => {
							if (res.code == 200) {
								uni.showToast({
									title: '保存成功',
									icon: 'success',
									success: () => {
										uni.navigateBack()
									}
								});
							} else {
								this.$u.toast(res.msg);
							}
						}).catch(err => {
						this.$u.toast(res.msg);
					})
				})
				/*this.$refs["form"].validate(valid => {
					if (valid) {
						console.log("成功")
					}
				});*/
			},
			/*close() {
				this.$tab.closePage();
			}*/

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