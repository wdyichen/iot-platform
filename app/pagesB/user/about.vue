<template>
	<view class="container">
		<view style="background-color: #eef3f7; padding:40px 20px;">
			<!-- <u--image :showLoading="true" src="/static/logo_title.png" width="130px" height="45px" @click="click"
				customStyle="margin:auto"></u--image> -->
			<u--text text="IoT 物联网平台" size="14" type="info"
				customStyle="margin:auto;"></u--text>
            <!-- <u--text text="iot.yichen.link" size="14" type="info"
				customStyle="margin:auto; margin-top:10px;"></u--text> -->
			<u--text text="Version1.3.1" size="14" type="info"
				customStyle="margin:auto; margin-top:8px;"></u--text>
		</view>

		<view style="margin-top:20px;">
			<!-- #ifndef APP-PLUS -->
			<!-- <u-cell title="作者微信: QQ164770707" size="large"><u-icon slot="icon" size="20" name="weixin-circle-fill"
					color="#5ac725"></u-icon></u-cell>
			<u-cell title="交流群: 946029159 , 1073236354" size="large">
				<u-icon slot="icon" size="20" name="qq-circle-fill" color="#3c9cff"></u-icon>
				<text slot="value" class="u-slot-value"></text>
			</u-cell> -->
			<!-- #endif -->
			<u-cell isLink size="large">
				<u-link slot="title" href="https://iot.yichen.link" text="访问网站" color="#333"></u-link>
				<u-icon slot="icon" size="20" name="home-fill" color="#f56c6c"></u-icon>
				<text slot="value" class="u-slot-value"></text>
			</u-cell>
			<u-cell title="联系管理员 Q Q: 435395893" size="large">
				<u-icon slot="icon" size="20" name="qq-circle-fill" color="#3c9cff"></u-icon>
				<text slot="value" class="u-slot-value"></text>
			</u-cell>
            <u-cell title="联系管理员邮件: yichen@wdyichen.cn" size="large">
				<u-icon slot="icon" size="20" name="email-fill" color="#3c9cff"></u-icon>
				<text slot="value" class="u-slot-value"></text>
			</u-cell>
			<!-- #ifndef APP-PLUS -->
			<!-- <u-cell isLink size="large">
				<u-link slot="title" href="https://gitee.com/kerwincui/wumei-smart" text="查看源码" color="#333"></u-link>
				<u-icon slot="icon" size="20" name="github-circle-fill" color="#666"></u-icon>
				<text slot="value" class="u-slot-value"></text>
			</u-cell> -->
			<!-- #endif -->
			<!-- <u-cell isLink size="large">
				<u-link slot="title" href="http://www.hpiot.cn/" text="华普物联" color="#333"></u-link>
				<u-icon slot="icon" name="/static/hp_logo.png" size="20" color="#0d5ce7"></u-icon>
				<text slot="value" class="u-slot-value"></text>
			</u-cell> -->
		</view>

		<view style="position:fixed;bottom:20px;left:0;right:0;">
			<u--text size="10" type="info" align="center"
				text="Copyright © 2023-2025 YICHEN All Rights Reserved."></u--text>
		</view>
	</view>
</template>

<script>
	export default {
		data () {
			return {};
		},
		created () {},
		methods: {}
	};
</script>

<style>
	.container {
		padding-bottom: 100px;
	}
</style>