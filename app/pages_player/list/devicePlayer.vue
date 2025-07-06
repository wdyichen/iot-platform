<template>
	<view class="container">
		<u-loading-page :loading="loading" bg-color="#eef3f7" loadingText="iot.yichen.link"></u-loading-page>
		<view class="card">
			<view class="player-wrapper">
				<div class="container-shell">
					<div id="container" @tap='operate' :ref="'container'+refId"></div>
				</div>
				<div class="player-display" />

				<view class="kBps"
					v-if="statisticsAll && (screensStats.abps || screensStats.buf || screensStats.fps || screensStats.ts || screensStats.vbps)">
					<text class="iconfont icon-dian"></text>
					<text class="li" v-if="screensStats.abps">{{ statisticsAll.abps }}abps</text>
					<text class="li" v-if="screensStats.buf">{{ statisticsAll.buf }}buf</text>
					<text class="li" v-if="screensStats.fps">{{ statisticsAll.fps }}fps</text>
					<text class="li" v-if="screensStats.ts">{{ statisticsAll.ts }}ts</text>
					<text class="li" v-if="screensStats.vbps">{{ statisticsAll.vbps }}vbps</text>
				</view>

				<view class="tabbar" v-if="isTabbar" @tap="tapTbabar">
					<view class="title">
						<text class="iconfont icon-fanhui"></text>
						<view class="texts">{{ title }}</view>
					</view>
				</view>
				<slot></slot>
			</view>
			<view style="display: flex; justify-content: space-between;">
				<uni-data-select v-model="value" :localdata="range" :clear="false" placeholder="请选择通道"
					style="border: none; background-color: #ffffff; width: 375rpx;"
					@change="changeindex"></uni-data-select>
				<uni-data-select v-model="zoomvalue" :localdata="zoom" :clear="false" placeholder="请选择变焦方式"
					style="border: none; background-color: #ffffff; width: 375rpx;"
					@change="changezoom"></uni-data-select>
			</view>




			<!-- <u-tabs class="tab_wrap" :list="list" @click="tabClick" lineWidth="60"></u-tabs> -->

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
	import props from './props.js';
	import {
		ptzdirection,
		ptzscale
	} from '@/apis/modules/sip';
	import {
		startPlay,
		closeStream,
	} from '@/apis/modules/player';

	export default {
		name: 'devicePlayer',
		mixins: [props],
		props: {
			device: {
				type: Array,
				default: null,
				required: true
			}
		},
		watch: {
			// 兼容小程序
			device: function(newVal, oldVal) {
				console.log("传过来的通道数据是", newVal)
				for (let i = 0; i < newVal.length; i++) {
					this.range.push({
						value: i,
						text: newVal[i].channelName,
						deviceId: newVal[i].deviceSipId,
						channelId: newVal[i].channelSipId,
						status: newVal[i].status
					})

				}
				console.log('现在range的数据是：', this.range)
			}
		},
		onLoad(option) {
			if (option.deviceId) {
				console.log(option, '携带参数')
				this.deviceId = option.deviceId
				this.channelId = option.channelSipId
			}
		},
		data() {
			return {
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
				showcalendar: false,
				// 加载图标
				loading: false,
				// 控制模块标题
				title: ' 设备通道 ',
				// 选项卡索引
				tabIndex: 0,
				queryParams: {
					deviceSipId: '', //设备sipid
				},
				// 通道集合
				selectChannel: null,
				// 设备信息
				deviceId: '',
				channelId: '',
				streamId: '',
				streaminfo: {
					ssrc: '',
					playurl: ''
				},
				jessibuca: null,
				operateBtns: {
					fullscreen: true,
					play: true,
					ptz: true,
					zoom: true,
				},
				list: [{
					name: '设备直播',
				}],
				statisticsAll: null,
				playing: false,
				pausing: false,
				retryCount: 0,
			}
		},
		mounted() {
			window.onerror = (msg) => (this.err = msg);

		},
		methods: {
			create() {
				const jessibuca = new window.Jessibuca(
					Object.assign({
							container: this.$refs['container' + this.refId],
							videoBuffer: Number(0.2),
							decoder: this.decoder + 'pages_player/static/h5/js/jessibuca/decoder.js',
							timeout: 20,
							debug: false,
							debugLevel: 'debug',
							isResize: false,
							useWCS: false,
							useMSE: false,
							useSIMD: true,
							wcsUseVideoRender: false,
							loadingText: '加载中...',
							hasAudio: true,
							isFlv: true,
							showBandwidth: true,
							supportDblclickFullscreen: true,
							operateBtns: this.operateBtns,
							ptzClickType: 'mouseDownAndUp',
							forceNoOffscreen: true,
							playbackForwardMaxRateDecodeIFrame: 4,
							playbackCurrentTimeMove: false,
							networkDelayTimeoutReplay: true
						},
						this.options
					)
				);
				this.jessibuca = jessibuca
				const _this = this
				jessibuca.on('error', function(error) {
					console.log('error')
					console.log(error)
					_this.destroy()
				})
				jessibuca.on('timeout', function() {
					console.log('timeout')
					if (_this.retryCount <= 2) {
						_this.replay()
						_this.retryCount++
					}
				})
				let pre = 0
				let cur = 0
				jessibuca.on('timeUpdate', function(ts) {
					cur = parseInt(ts / 60000)
					if (pre !== cur) {
						pre++
					}
				})

				jessibuca.on("play", function(play) {
					console.log('play success!')
					_this.playing = true
				})
				jessibuca.on("pause", function(pause) {
					console.log('pause success!')
					console.log(pause)
					_this.playing = false
				})
				// jessibuca.on('stats', function (s) {
				//   console.log('stats is', s)
				// })
				jessibuca.on("ptz", (arrow) => {
					console.log('ptz arrow', arrow);
					_this.handlePtz(arrow);
				})
				jessibuca.on("crashLog", (value) => {
					console.error('crashLog: ', value);
					_this.$u.toast({
						type: 'error',
						message: JSON.stringify(value)
					})
				})
				jessibuca.on("close", () => {
					!this.isDebug && console.log('jessibuca close');
					setTimeout(() => {
						_this.cleanPlayer(true);
					}, 10)
				})
			},
			changeindex(e) {
				console.log("改变了选项", e)
				this.range.forEach(item => {
					if (item.value == e) {
						if (item.status != 2) {
							uni.showToast({
								title: "设备离线！！",
								icon: "none"
							})
							this.value = null
							//该设备是离线的
							return;
						}
						window.onerror = (msg) => (this.err = msg);
						this.create();
						this.deviceId = item.deviceId
						this.channelId = item.channelId
						if(this.zoomvalue == 0){
							this.zoomtype = false
						}
					}
				})

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
			initUrl(data) {
				if (data) {
					this.streamId = data.streamId
					this.streaminfo.ssrc = data.ssrc
					this.streaminfo.playurl = data.playurl
				} else {
					this.streamId = ''
					this.streaminfo.ssrc = ''
					this.streaminfo.playurl = ''
				}
			},
			cleanPlayer(stop) {
				this.destroy()
				if (stop) {
					this.stopPlay()
				}
				this.playing = false
			},
			destroy() {
				if (this.jessibuca) {
					this.jessibuca.destroy()
				}
				switch (this.tabIndex) {
					case 0:
						this.operateBtns.ptz = true;
						this.operateBtns.zoom = true;
						break;
				}
				// this.create();
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
						console.log("playurl：" + res.playurl);
						this.streamId = res.streamId;
						this.streaminfo.playurl = res.playurl;
						this.play();
					});
				}
			},
			play: function() {
				this.playing = true;
				this.jessibuca.play(this.streaminfo.playurl);
			},
			operate() {
				if (this.streaminfo.playurl) {
					if (this.playing) {
						this.jessibuca.pause();
						this.pausing = true;
					} else {
						this.play();
						this.pausing = false;
					}
				} else {
					this.sendDevicePush();
				}
			},
			stopPlay() {
				if (this.streamId && this.playing) {
					closeStream(this.deviceId, this.channelId, this.streamId).then(res => {
						this.pausing = false
						this.playing = false
						if (this.jessibuca) {
							this.retryCount = 0
							this.destroy()
						}
						this.streamId = '';
						this.streaminfo = {
							ssrc: '',
							playurl: ''
						};
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
					//console.log("云台方向控制：" + JSON.stringify(response));
				});
			},
			handlePtzScale(inOut) {
				if (this.deviceId) {
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
				}

			},
			replay() {
				this.cleanPlayer(false);
				this.play();
			},
		},
		onUnload() {
			this.cleanPlayer(true);
		},


	}
</script>

<style lang="scss">
	.player-wrapper {
		display: flex;
		place-content: center;
		font-size: 12px;
		width: 100%;
		height: 260px;

		.player-display {
			position: absolute;
			left: 4px;
			bottom: 48px;
			display: flex;
			width: 150px;
			height: 30px;
			justify-content: center;
			color: #fff;
		}

		.container-shell {
			position: relative;
			width: 100%;
		}

		#container {
			background: rgba(13, 14, 27, 0.7);
			width: 100%;
			height: 100%;
			position: relative;
		}
	}

	.tab_wrap {
		margin-top: 10px;
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
</style>