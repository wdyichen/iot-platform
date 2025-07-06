<template>
	<view class="container">
		<u-loading-page :loading="loading" bg-color="#eef3f7" loadingText="iot.yichen.link"></u-loading-page>
		<view class="card">
			<view class="player-wrapper">
				<web-view v-if="webshow" :src="webviewSrc" ref="webview" @onPostMessage="handlePostMessage"></web-view>
			</view>
			
			
			<view style="display: flex; justify-content: space-between;">
				
				<uni-data-select v-model="zoomvalue" :localdata="zoom" :clear="false" placeholder="请选择变焦方式"
					style="border: none; background-color: #ffffff; width: 750rpx;"
					@change="changezoom"></uni-data-select>
			</view>
			
			<view class="opt_button_wrap">
				<view class="live_str_wrap" v-if="tabIndex == 0">
					<view class="play_btn_wrap">
						<button class="btn_icon" @click="operate" :disabled="playing">
							<u-icon name="play-circle" size="30"></u-icon>
						</button>
						<text class="btn_title">播放</text>
					</view>
					<view class="play_btn_wrap">
						<button class="btn_icon" @click="operate" :disabled="!playing">
							<u-icon name="pause-circle" size="30"></u-icon>
						</button>
						<text class="btn_title">暂停</text>
					</view>
					<view class="play_btn_wrap">
						<button class="btn_icon" @click="handlePtzScale(1)" :disabled="zoomtype">
							<u-icon name="plus" size="30"></u-icon>
						</button>
						<text class="btn_title">放大</text>
					</view>
					<view class="play_btn_wrap">
						<button class="btn_icon" @click="handlePtzScale(2)" :disabled="zoomtype">
							<u-icon name="minus" size="30"></u-icon>
						</button>
						<text class="btn_title">缩小</text>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	var wv;
	import projectConfig from '@/env.config.js';
	import {
		startPlay,
		closeStream,
	} from '@/apis/modules/player';
	
	export default {
		name: 'devicePlayerApp',
		
		
		onLoad(option) {
			if (option.deviceId) {
				console.log(option, '携带参数')
				this.webshow = true
				this.deviceId = option.deviceId
				this.channelId = option.channelSipId
			}
		},
		data() {
			return {
				webshow:false,
				zoomtype: true,
				zoomvalue: '',
				zoom: [{
						value: 0,
						text: "物理变焦"
					},
					{
						value: 1,
						text: "数字变焦"
					}
				],
				value: '',
				range: [
				
				],
				// 设备升级模态窗
				show: false,
				// 加载图标
				loading: false,
				// 控制模块标题
				title: ' 设备通道 ',
				// 选项卡索引
				tabIndex: 0,
				queryParams: {
					deviceSipId: '', //设备sipid
				},
				// 设备信息
				deviceId:'',
				channelId: '',
				streamId: '',
				webviewSrc: '/pages_player/static/app-plus/video.html',
				decoderUrl: '',
				playurl: '',
				playing: false,
				pausing: false,
			}
		},
		onReady() {
			var currentWebview = this.$scope.$getAppWebview()
			this.decoderUrl = projectConfig.decoderUrl;
			setTimeout(function() {
				wv = currentWebview.children()[0]
				wv.setStyle({
					top: 35,
					height: 260
				})
			}, 1000);
		},
		
		onNavigationBarButtonTap(event) {
			console.log(event, 'event')
			console.log(event.type, 'event.type')
		},
		methods: {
			
			closeWebview() {
				this.webviewSrc = 'about:blank'; // 清空当前页面
				this.$nextTick(() => {
					this.webviewSrc = '/pages_player/static/app-plus/video.html';
				});
				wv.clear();
			},
			cleanPlayer(stop) {
				if (stop) {
					this.stopPlay()
				}
				this.closeWebview();
				this.playing = false
			},
			// 单击选显卡
			tabClick(item) {
				this.tabIndex = item.index;
				if (this.playing) {
					this.cleanPlayer(true);
				}
				switch (this.tabIndex) {
					case 0:
						this.sendDevicePush();
						break;
				}
			},
			//直播控制
			sendDevicePush: function() {
				console.log("通知设备推流1：" + this.deviceId + " : " + this.channelId);
				if (this.channelId) {
					startPlay(this.deviceId, this.channelId).then((response) => {
						console.log("开始播放：" + this.deviceId + " : " + this.channelId);
						let res = response.data;
						this.streamId = res.streamId;
						this.playurl = res.playurl;
						//如果是页面初始化调用时，需要延时一下
						this.webviewSrc = 'about:blank'; // 清空当前页面
						wv.clear();
						this.$nextTick(() => {
							// #ifdef APP-ANDROID
							console.log("playurl：" + res.playurl);
							this.webviewSrc = '/pages_player/static/app-plus/video.html?data=' +
								encodeURIComponent(JSON.stringify({
									"type": "play",
									"playUrl": res.playurl,
									"decoderUrl": this.decoderUrl
								}));
							// #endif
							// #ifdef APP-IOS
							console.log("hlsurl：" + res.hls);
							this.webviewSrc = '/pages_player/static/app-plus/video.html?data=' +
								encodeURIComponent(JSON.stringify({
									"type": "play",
									"playUrl": res.hls,
									"decoderUrl": this.decoderUrl
								}));
							// #endif
						});
						this.playing = true;
					});
				}
			},
			
			changezoom(e) {
				console.log("改变了选项", e)
				if(e==0){
					if(this.deviceId){
						this.zoomtype = false
					}
				}
				else{
					this.zoomtype = true
				}
			},
			operate() {
				if (!this.videoVod) {
				if(this.playing == true) {
				  wv?.evalJS(`jessibuca.pause();`);
				  this.playing = false;
				} else {
				  this.sendDevicePush();
				}
								} else {
									if (this.streamId && this.playing) {
										this.playing = false
									} else {
										this.playing = true
									}
								}

			},
			stopPlay() {
				if (this.streamId && this.playing) {
					closeStream(this.deviceId, this.channelId, this.streamId).then(res => {
						this.pausing = false
						this.playing = false
						this.streamId = '';
						this.playurl = '';
					})
				}
			},
			handlePtz(arrow) {
				let leftRight = 0;
				let upDown = 0;
				if (arrow === 'left') {
					leftRight = 2;
				} else if (arrow === 'right') {
					leftRight = 1;
				} else if (arrow === 'up') {
					upDown = 1;
				} else if (arrow === 'down') {
					upDown = 2;
				}
				var data = {
					leftRight: leftRight,
					upDown: upDown,
					moveSpeed: 125
				};
				ptzdirection(this.deviceId, this.channelId, data).then(async response => {
					console.log("云台方向控制：" + JSON.stringify(response));
				});
			},
			handlePtzScale(inOut) {
				console.log('云台缩放：' + inOut);
				var data = {
					inOut: inOut,
					scaleSpeed: 30
				}
				ptzscale(this.deviceId, this.channelId, data);
				// 放大/缩小后自动关闭
				setTimeout(() => {
					ptzscale(this.deviceId, this.channelId, {
						inOut: 0,
						scaleSpeed: 30
					})
				}, 800);
			},
			screenShot() {
				if (this.playing) {
					this.$refs.webview.evalJs("jessibuca.screenshot();");
				}
			},
			handlePostMessage: function(data) {
				console.log("接收到消息：" + JSON.stringify(data.time));
				var json = JSON.stringify(data.time);
				if (json.action == "seekPlay") {
					this.seekPlay(json.msg);
				}
			},
		},
	}
</script>

<style lang="scss">
	.player-wrapper {
		display: flex;
		place-content: center;
		font-size: 12px;
		width: 100%;
		height: 220px;
	}

	.tab_wrap {
		margin-top: -40rpx;
	}

	.play_btn_wrap {
		display: inline-block;
		text-align: center;
		flex: 1;
		margin-top: 60px;

		.btn_icon {
			display: inline-block;
			padding: 16px;
			border-radius: 50px;

			&::after {
				border: transparent;
			}
		}

		.btn_icon-size {
			display: inline-block;
			padding: 8px;
			background-color: #01a394;
			// border-radius: 50px;

			&::after {
				border: transparent;
			}
		}

		.btn_title {
			display: block;
			font-size: 14px;
			margin-top: 8px;
		}
	}

	.live_str_item {
		display: flex;
		flex-direction: row;
		margin-top: 60px;
	}

	.opt_button_wrap {
		margin-top: 40px;
	
		.play_btn_wrap {
			display: inline-block;
			text-align: center;
			flex: 1;
	
			.btn_icon-size {
				display: inline-block;
				padding: 8px;
				background-color: #01a394;
				// border-radius: 50px;
	
				&::after {
					border: transparent;
				}
			}
	
			.btn_icon {
				display: inline-block;
				padding: 16px;
				// background-color: #01a394;
				border-radius: 50px;
	
				&::after {
					border: transparent;
				}
			}
	
			.btn_title {
				display: block;
				font-size: 14px;
				margin-top: 8px;
			}
	
		}
	
		.live_str_wrap {
			display: flex;
			flex-direction: row;
		}
	
		.live_str_item {
			display: flex;
			flex-direction: row;
			margin-top: 60px;
		}
	
		.playback_wrap {
			padding: 0 20px;
	
			.date_wrap {}
	
			.button_wrap {
				display: flex;
				flex-direction: row;
				margin-top: 56px;
			}
		}
	}

	.container-circle {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		margin-top: 50rpx;
	}

	.circle {
		width: 200rpx;
		height: 200rpx;
		background-color: #fff;
		border: 90rpx solid #01a394;
		border-radius: 50%;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.button {
		width: 40rpx;
		height: 40rpx;
		// background-color: #fff;
		position: absolute;
	}

	.top {
		top: -80rpx;
		left: 80rpx;
	}

	.right {
		bottom: 80rpx;
		right: -80rpx;
	}

	.bottom {
		bottom: -80rpx;
		left: 80rpx;
	}

	.left {
		bottom: 80rpx;
		left: -80rpx;
	}
</style>
