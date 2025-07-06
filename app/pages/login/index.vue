<template>
	<view class="login-wrap">
		<view class="top-wrap">
			<div>IoT</div>
            <div style="font-size: 20px;">物联网平台</div>
		</view>

		<view class="main-wrap">
			<u--text size="18" type="info" bold margin="20rpx 0" text="账号登录"></u--text>
			<u--form :model="loginForm" :rules="rules" ref="form" labelWidth="31">
				<u-form-item prop="username" borderBottom>
					<u--input v-model="loginForm.username" clearable border="none" placeholder="请输入用户名"
						prefixIcon="account-fill"
						prefixIconStyle="font-size: 44rpx; color: #3c9cff; margin-right: 10rpx"
						:clearable="true"></u--input>
				</u-form-item>
				<u-form-item prop="password" borderBottom>
					<u--input v-model="loginForm.password" type="password" clearable border="none" placeholder="请输入密码"
						prefixIcon="lock-fill" prefixIconStyle="font-size: 44rpx; color: #3c9cff; margin-right: 10rpx"
						:clearable="true"></u--input>
				</u-form-item>
				<u-form-item prop="code" borderBottom>
					<!-- 注意：由于兼容性差异，如果需要使用前后插槽，nvue下需使用u--input，非nvue下需使用u-input -->
					<u-input placeholder="请输入验证码" v-model="loginForm.code" border="none" prefixIcon="integral-fill"
						prefixIconStyle="font-size: 44rpx; color: #3c9cff; margin-right: 10rpx">
						<template slot="suffix">
							<u--image :src="codeUrl" width="240rpx" height="60rpx" @click="getCode"></u--image>
						</template>
					</u-input>
				</u-form-item>
				<view class="clause">
					<checkbox-group @change="handleClauseCheckbox">
                        <br>
						<label>
							<checkbox :checked="isClause" style="transform:scale(0.6)" />
						</label>
						<text class="check_text">
							<text>已阅读并同意</text>
							<text class="service" @click="handleService">服务协议</text>
							<text>与</text>
							<text class="privacy" @click="handlePrivacy">隐私政策</text>
						</text>
					</checkbox-group>
				</view>
				<view style="margin-top: 40rpx;"><u-button type="primary" text="登录" @click="handleLogin()"></u-button>
				</view>
			</u--form>
			<view class="register-wrap">
				<view class="now-btn">
                    <u--text text="接入文档" type="primary" size="14" @click="handleDoc"></u--text>
                    <span style="display:inline-block; width: 15px;"></span>
					<u--text text="现在注册" type="primary" size="14" @click="handleRegister"></u--text>
				</view>
			</view>
			<view class="footer-wrap">
				<!-- #ifdef H5 || APP-PLUS -->

				<!-- #endif -->
				<view class="copyright"><text>Copyright © 2023-2025 YICHEN All Rights Reserved.</text></view>
			</view>
		</view>
		<view class="other-wrap">
			<!-- 微信授权弹出框 -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="one-click-login-pop-wrap">
				<u-popup :show="isShowPop" mode="bottom" :round="10" closeable="true" @close="isShowPop = false">
					<view class="content-wrap">
						<u--image :showLoading="true" src="/static/logo_title.png" width="260rpx" height="90rpx"
							customStyle="float:left"></u--image>
						<text class="title">欢迎登录 IoT 物联网平台</text>
						<view class="btn-login">
							<u-button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"
								@click="isShowPop = false;" type="success">登录</u-button>
						</view>
					</view>
				</u-popup>
			</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	import projectConfig from '@/env.config.js';
	import {
		getProfile
	} from '@/apis/modules/common.js'

	export default {
		data () {
			return {
				token: '',
				codeUrl: '',
				isClause: false,
				loginForm: {
					username: '',
					password: '',
					rememberMe: false,
					code: '',
					uuid: '',
				},
				rules: {
					username: {
						type: 'string',
						min: 2,
						max: 20,
						required: true,
						message: '请输入用户名',
						trigger: ['blur', 'change']
					},
					password: {
						type: 'string',
						required: true,
						min: 5,
						max: 20,
						message: '请输入密码',
						trigger: ['blur', 'change']
					},
					code: {
						type: 'integer',
						required: true,
						message: '请输入验证码',
						trigger: ['blur', 'change']
					}
				},
				isShowPop: false,
			};
		},
		mounted () {
			this.getToken();
			if (this.token != '' && this.token != null) {
				// 跳转主页
				uni.switchTab({
					url: '/pages/tabBar/home/index'
				});
			} else {
				this.getCode();
				this.getAccount();
			}
		},
		methods: {
			handleLogin () {
				this.$refs.form.validate().then(res => {
					if (!this.isClause) {
						uni.showToast({
							icon: 'none',
							title: '请阅读并勾选协议'
						});
						return;
					}
					// 调用登录
					this.$api.common.login(this.loginForm).then(async res => {
						if (res.code == 200) {
							// 存储token和账号
							this.saveToken(res.token);
							this.saveAccount();
							// 获取用户信息
							let profile = await this.getProfile();
							uni.$u.vuex('profile', profile);
							// 跳转主页
							uni.switchTab({
								url: '/pages/tabBar/home/index'
							});
						} else {
							if (res.msg) {
								uni.showToast({
									icon: "none",
									title: res.msg,
									complete: (res) => {
										setTimeout(() => {
											this.getCode();
										}, 1500);
									}
								})
							}
						}
					})
				}).catch(errors => {
					uni.$u.toast('账号信息不能为空');
				});
			},
			// 微信登录

			// 获取验证码
			getCode () {
				this.$api.common.captchaImage().then(res => {
						this.codeUrl = 'data:image/gif;base64,' + res.img;
						this.loginForm.uuid = res.uuid;
						this.loginForm.code = '';
					})
					.catch(err => {
						this.$u.toast(err.msg);
					});
			},
			// 用户注册
			handleRegister () {
				uni.$u.route('/pages/login/register');
			},


			// 获取用户信息
			getProfile () {
				return new Promise((resolve, reject) => {
					getProfile().then(res => {
						resolve(res.data);
					}).catch(err => {
						this.$u.toast(err.msg);
					})
				});
			},
			saveToken (token) {
				// 本地缓存存储token
				uni.setStorageSync('token', token);
				// vuex存储token
				uni.$u.vuex('vuex_token', token);
			},
			getToken () {
				// 本地缓存获取token
				this.token = uni.getStorageSync('token');
				// vuex存储token
				uni.$u.vuex('vuex_token', this.token);
			},
			saveAccount () {
				// 本地缓存存储
				uni.setStorageSync('username', this.loginForm.username);
				uni.setStorageSync('password', this.loginForm.password);
			},
			//微信小程序登录获取手机号
			getPhoneNumber (e) {
				let that = this;
				wx.login({
					success (res) {
						if (e.detail.code && res.code) {
							console.log('用户授权成功');
							//发起网络请求
							wx.request({
								url: projectConfig.baseUrl + '/wechat/miniLogin',
								data: {
									code: res.code,
									phoneCode: e.detail.code,
								},
								method: 'post',
								success: async res => {
									if (res.data.code == 200) {
										// 存储token和账号
										const token = wx.setStorageSync('token', res.data.data.token)
										that.saveToken(res.data.data.token);
										that.saveAccount();
										// 获取用户信息
										let profile = await that.getProfile();
										uni.$u.vuex('profile', profile);
										// 跳转主页
										wx.switchTab({
											url: '/pages/tabBar/home/index'
										});
									} else {
										wx.showToast({
											icon: "none",
											mask: true,
											title: res.data.msg,
											duration: 3000,
										})
									}
								},
							})
						} else {
							console.log('用户拒绝授权');
						}
					}
				})
			},
			getAccount () {
				// 本地缓存获取
				let username = uni.getStorageSync('username');
				let password = uni.getStorageSync('password');
				if (username && username != '') {
					this.loginForm.username = username;
				}
				if (password && password != '') {
					this.loginForm.password = password;
				}
			},
			// 服务协议
			handleService () {
				let title = '服务协议';
				let url = projectConfig.officialWebUrl + 'service-agreement.html';
				uni.navigateTo({
					url: `/pages/common/webview/index?title=${title}&url=${url}`
				});
			},
			// 隐私政策
			handlePrivacy () {
				let title = '隐私政策';
				let url = projectConfig.officialWebUrl + 'privacy-policy.html';
				uni.navigateTo({
					url: `/pages/common/webview/index?title=${title}&url=${url}`
				});
			},
			// 勾选协议
			handleClauseCheckbox (e) {
				this.isClause = !this.isClause;
			},
            // 接入文档
			handleDoc () {
				let title = '接入文档';
				let url = 'http://iot2.yichen.link/doc';
				uni.navigateTo({
					url: `/pages/common/webview/index?title=${title}&url=${url}`
				});
			}
		}
	};
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.login-wrap {
		height: 100%;

		.top-wrap {
            white-space: pre-wrap;
			text-align: center;
		}

		.main-wrap {
			position: fixed;
			padding: 40rpx;
			background: #ffffff;
			border-top-left-radius: 0;
			border-top-right-radius: 0;
			top: 420rpx;
			left: 0;
			right: 0;
			bottom: 0;

            .clause {
                font-size: 28rpx;

                .check_text {
                    display: inline-block;
                    vertical-align: middle;
                }

                .service,
                .privacy {
                    color: #3c9cff;
                }
            }

			.register-wrap {
				margin-top: 30rpx;
				display: flex;

				.now-btn {
                    display: flex;
					margin-left: 20rpx;
				}
			}

			.footer-wrap {
				position: fixed;
				bottom: 40rpx;
				left: 0;
				right: 0;
				color: #909399;
				text-align: center;

				.other-login1 {
					display: flex;
					flex-direction: row;
					justify-content: center;
					margin-bottom: 45rpx;

					.item-wrap {
						background-color: #eaeaea;
						width: 40px;
						height: 40px;
						border-radius: 50%;
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: center;
						margin: 10rpx 20rpx;
					}
				}

				.other-login2 {
					display: flex;
					flex-direction: column;
					align-items: center;
					margin-bottom: 45rpx;
				}

				.copyright {
					font-size: 16rpx;
					margin-top: 20rpx;
				}
			}
		}

		.other-wrap {
			.one-click-login-pop-wrap {
				.content-wrap {
					display: flex;
					flex-direction: column;
					align-items: center;
					margin-top: 90rpx;

					.title {
						margin-top: 30rpx;
						font-size: 36rpx;
					}

					.btn-login {
						margin-top: 100rpx;
						margin-bottom: 60rpx;
						width: 320rpx;
						border-radius: 20rpx
					}
				}
			}
		}
	}
</style>