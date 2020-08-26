<template>
	<view class="detail">
		<view class="flex_items logo_title">
			<image src='../../static/images/icon_logo.png' class="logo"></image>
			“一带一路”可追溯商品数据库
		</view>
		<!-- 轮播图 -->
		<swiper indicator-dots :autoplay="autoplay" indicator-color="rgba(255,255,255,1);" v-if="info.length>0">
			<swiper-item v-for="(item,index) in info" :key="index">
				<image :src="item.content" mode="aspectFit" style="height: 100%;width: 100%;"></image>
			</swiper-item>
		</swiper>

		<!-- 	<uni-swiper-dot :info="info" :current="current" field="content" :mode="mode">
			<swiper class="swiper-box" @change="change" :autoplay="autoplay">
				<swiper-item v-for="(item ,index) in info" :key="index">
					<view class="swiper-item" style="height:562upx;width: 100%;">
						<image :src="item.content" mode="aspectFit" style="height: 100%;width: 100%;"></image>
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot> -->


		<!-- 商品 -->
		<block v-if="selectIndex==0">
			<view class="goodsDetail">
				<!-- 商品名 -->
				<view class="flex_items">
					<view class="goodsName">{{goodsList.goodsName}}</view>
					<view class="brandName ellipsis" v-if="goodsList.brandName">{{goodsList.brandName}}</view>
				</view>
				<!-- 类别 -->
				<view class="kinds">商品类别：{{goodsList.categoryName}}</view>
				<!-- 入库时间 -->
				<view>入库时间：{{goodsList.enterTime}}</view>
			</view>
			<!-- 基本信息 -->
			<view class="baseInfo">
				<view class="name">基本信息</view>
				<view class="flex box" v-for="(item,index) in goodsList.propertyValue" :key="index" v-if="item.propertyValue">
					<view>{{item.propertyName}}：</view>
					<view class="value ellisips">{{item.propertyValue}}</view>
				</view>
			</view>
			<!-- 所属公司 -->
			<view class="baseInfo" @click="changeShop">
				<view class="name">所属公司</view>
				<view class="shop flex_items shop1">
					<image :src="merchantLogo"></image>
					<view class="shopInfo">
						<!-- 商家名 -->
						<view class="flex_items">
							<view class="shopName ellipsis">{{shopList.merchantName}}</view>
							<view class="brandName">
								<view class="tags">{{shopList.enterprise}}</view>
								<view class="tags">{{shopList.approve?'已认证':'未认证'}}</view>
							</view>
						</view>
						<!-- 商家类别 -->
						<view class="tag">
							<view class="blue">{{shopList.merchantType}}</view>
							<view class="red">{{shopList.netType}}</view>
							<view class="green ellipsis">{{shopList.businessLines}}</view>
						</view>
						<!-- 入库时间 -->
						<view>入库时间: {{shopList.enterTime}}</view>
					</view>
				</view>
			</view>
			<!-- 进货需求 -->
			<view class="baseInfo">
				<view class="name">进货需求</view>
				<view class="stockBox">
					<view class="linkman">
						联系人：
					</view>
					<view class="stockvalue">
						<input class="uni-input" v-model="Info.contact" placeholder="请输入联系人姓名" style="width: calc(100vw - 250rpx);" />
					</view>
				</view>
				<view class="stockBox">
					<view class="linkman">
						联系电话：
					</view>
					<view class="stockvalue">
						<input class="uni-input" v-model="Info.number" placeholder="请输入联系电话" style="width: calc(100vw - 250rpx);" />
					</view>
				</view>
				<view class="stockBox">
					<view class="linkman">
						具体需求：
					</view>
					<view class="stockvalue" style="position: relative;padding-bottom: 40upx;">
						<textarea  v-model="Info.requirement" maxlength="500" style="height: 100rpx;width: calc(100vw - 250rpx);"
						 placeholder="请输入具体需求,字符不得超过500" />
						<text style="position: absolute; right: 20upx;bottom: 5upx;font-size: 26upx;">{{Info.requirement.length}}/500</text>
						</view>
				</view>
				<view class="Btn">
						<div  class="push" @tap="confirm1">提交</div>
				</view>
			</view>
		</block>

		<!-- 商家 -->
		<block v-if="selectIndex==1">
			<view class="shop flex_items">
				<image :src="merchantLogo"></image>
				<view class="shopInfo">
					<!-- 商家名 -->
					<view class="flex_items">
						<view class="shopName">{{shopList.merchantName}}</view>
						<view class="brandName">
							<view class="tags">{{shopList.enterprise}}</view>
							<view class="tags">{{shopList.approve?'已认证':'未认证'}}</view>
						</view>
					</view>
					<!-- 商家类别 -->
					<view class="tag">
						<view class="blue">{{shopList.merchantType}}</view>
						<view class="red">{{shopList.netType}}</view>
						<view class="green ellipsis">{{shopList.businessLines}}</view>
					</view>
					<!-- 入库时间 -->
					<view>入库时间: {{shopList.enterTime}}</view>
				</view>
			</view>
			<!-- 基本信息 -->
			<view class="baseInfo">
				<view class="name">基本信息</view>
				<view class="flex box">
					<view class="title">联系人：</view>
					<view class="value1">{{shopList.contact}}</view>
				</view>
				<view class="flex box">
					<view class="title">联系电话：</view>
					<view class="value1">{{shopList.phone | capitalize}}</view>
				</view>
				<view class="flex box">
					<view class="title">详细地址 : </view>
					<view class="value1">{{shopList.site}}</view>
				</view>
				<view class="flex box">
					<view class="title">商家描述 : </view>
					<view class="value1 wrap_ellipsis" :class="[more?'show':'']" style="-webkit-line-clamp: 2;">{{shopList.merchantDesciption}}</view>
				</view>
				<view class="flex_center showButton" @click="showMore">展开更多
					<image src="../../static/images/icon_more.png" v-if="!more"></image>
					<image src="../../static/images/icon_up.png" v-if="more"></image>
				</view>
			</view>
			<!-- 商品列表 -->
			<view class="baseInfo" v-if="goodsCount!=0">
				<view class="name">商品列表</view>
				<view class="goods flex_items goods1" v-for="(item,index) in goodsList" :key="index" @click="changeGoods(index)">

					<image v-if="item.goodsPicture" :src="item.goodsPicture"></image>
					<image v-if="!item.goodsPicture" src="../../static/images/extra.png"></image>
					<view style="flex:1">
						<!-- 商品名 -->
						<view class="flex_items" style="flex:1">
							<view class="goodsName ellipsis" style="flex: 1;">{{item.goodsName}}</view>
							<view class="brandName ellipsis" v-if="item.brandName">{{item.brandName}}</view>
						</view>
						<!-- 类别 -->
						<view class="kinds">商品类别：{{item.categoryName}}</view>
						<!-- 入库时间 -->
						<view>入库时间：{{item.enterTime}}</view>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>


<script>
import com from '../common/com/com.js'
	import {
		uniSwiperDot
	} from "@/components/uni-swiper-dot/uni-swiper-dot.vue"
	export default {
		components: {
			components: {
				uniSwiperDot
			}
		},
		onReachBottom() {
			console.log("12121")
			if(this.goodsCount > this.goodsList.length) {
				this.getBalanceListMore()
			}
		},
		data() {
			return {
				total:0,
				goodsList: [],
				shopList: [],
				merchantId: '',
				selectIndex: '',
				imgUrls: [], //轮播图
				pageNum: 1,
				pageSize: 20,
				goodsCount: '',
				more: false,
				info: [],
				current: 0,
				mode: 'default',
				merchantLogo: '',
				autoplay:false,
				options:{},
				Info:{
					"number": "",
					 "goodsId":'',
					  "contact":"",
					  "requirement":""
				}
			}
		},
		filters: {
		  capitalize:  (value)=> {
			  
			if (value) {
				var tel = value;
				tel = "" + tel;
				var tel1 =tel.replace(tel.substring(3,7), "****")
				return tel1
			}else{
				return "****"
			}
		  }
		},
		methods: {
			getBalanceListMore(){
				this.pageNum++
				const that = this
				let data = {
						merchantId: this.merchantId,
						pageNum: that.pageNum,
						pageSize: that.pageSize
					},
					success = function(res) {
						if (that.selectIndex == 1) {
							if (res.data.code == 200) {
								that.goodsCount = res.data.data.total
									// that.goodsList = res.data.data.list
									if (res.data.data.list.length > 0) {
										for (let s of res.data.data.list) {
											that.goodsList.push(s)
										}
									}
				
							}
						}
					}
				com.request('goods/getMerchantGoods', data, "POST", success)
			},
			confirm1(){
				if (this.options.goodsid) {
					console.log(this.Info)
					if(!this.Info.contact){
						
						uni.showToast({
							title:"请输入联系姓名",
							icon:'none'
						})
						return false
					}
										if(this.Info.contact.length>20){
											
											uni.showToast({
												title:"字符不能超过20个字符",
												icon:'none'
											})
											return false
										}
					if(!this.Info.number){
						uni.showToast({
							title:"请输入联系电话",
							icon:'none'
						})
						return false
					}
				
				if(!this.Info.requirement){
					
					uni.showToast({
						title:"进货需求不能为空",
							icon:'none'
					})
					return false
				}
				if(this.Info.requirement.length>500){
					uni.showToast({
						title:"字符不能超过500个字符",
							icon:'none'
					})
					return false
				}
				
				
				let that=this
				com.httpPost('goods/purchaseDemand', this.Info, 'Post', (data) => {
							console.log(data)
							if (data.data.code === 200) {
								uni.showToast({
									title:data.data.desc
								})
								
								that.Info={
									"number": "",
									 "goodsId":that.Info.goodsId,
									  "contact":"",
									  "requirement":""
								}
							}else{
								console.log("data.data.desc",data.data.desc)
								
								uni.showToast({
									title:data.data.desc,
									icon:'none'
								})
								setTimeout(()=>{
									uni.hideLoading();
								},1500)
							}
						})
				}
			},
			// 展开更多
			showMore() {
				const that = this
				that.more = !that.more
			},
			change(e) {
				this.current = e.detail.current;
			},
			changeGoods(index) {
				const that = this
				that.selectIndex = 0
				that.getGoodsDetail(that.goodsList[index].goodsId)
				// this.Info.goodsId=that.goodsList[index].goodsId
				this.Info={
					"number": "",
					 "goodsId":that.goodsList[index].goodsId,
					  "contact":"",
					  "requirement":""
				}
			},

			changeShop() {
				const that = this
				that.selectIndex = 1
				that.getMerchantDetail(that.shopList.merchantId)
				
			},

			// 请求商品详情
			getGoodsDetail(goodsId) {
				
				const that = this
				let data = {
					goodsId: goodsId
				}
				com.request('goods/getGoodsDetail', data, "GET", (res) => {

					that.goodsList = res.data.data,
						console.log(res.data.data.goodsImage)
					let arr = []

					for (let s of res.data.data.goodsImage) {
						arr.push({
							content: s.imageUrl
						})
					}


					that.info = arr
					if (that.selectIndex == 0) {
						that.getMerchantDetail(res.data.data.merchantId)
					}
				})
			},

			// 请求商家详情，商家信息
			getMerchantDetail(merchantId) {
				const that = this
				let data = {
					merchantId: merchantId
				}

				com.request('merchant/getMerchantDetail', data, "GET", (res) => {
					that.shopList = res.data.data
					if (that.shopList.merchantLogo) {
						that.merchantLogo = that.shopList.merchantLogo
					} else {
						that.merchantLogo = '../../static/images/extra.png'
					}
					if (that.selectIndex == 1) {
						let arr = []

						for (let s of res.data.data.imageList) {
							arr.push({
								content: s
							})
						}


						that.info = arr
						// that.imgUrls = res.data.data.imageList,
						that.merchantId = res.data.data.merchantId
						that.getMerchantGoods(res.data.data.merchantId)
					}
				})
			},

			// 请求商家详情，商品列表
			getMerchantGoods(merchantId) {
				const that = this
				let data = {
						merchantId: merchantId,
						pageNum: that.pageNum,
						pageSize: that.pageSize
					},
					success = function(res) {
						if (that.selectIndex == 1) {
							if (res.data.code == 200) {
								that.goodsCount = res.data.data.total,
									that.goodsList = res.data.data.list

							}
						}
					}
				com.request('goods/getMerchantGoods', data, "POST", success)
			},

			/**
			 * 生命周期函数--监听页面加载
			 */
			onLoad: function(options) {
				console.log(com)
				console.log(options)
				const that = this
				// 商品
				
				this.options=options
				
				if (options.goodsid) {
					that.selectIndex = 0
					that.Info.goodsId=that.options.goodsid
					that.getGoodsDetail(parseInt(options.goodsid))
				}
				// 商家
				else {
					that.selectIndex = 1
					that.getMerchantDetail(parseInt(options.shopid))
				}
			}
		}
	}
</script>

<style lang="less">
	@import url("../common/detail.css");
	.detail{
		padding-bottom: 60upx;
	
	}
	.baseInfo {
		// margin-top: 20upx;
		.stockBox {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 20upx;
			.linkman {
				width: 250rpx;
				text-align: center;
			}
			.stockvalue {
				flex: 1;
				padding: 10upx;
				box-sizing: border-box;
				background-color: #f6f6f6;
			}
		}
		.Btn {
			display: flex;
			justify-content: flex-end;
			margin-top: 20upx;
			padding-right: 30upx;
			.push {
				font-size: 28upx;
				padding: 10upx 30upx;
				color: #FFFFFF;
				background-color: #A52024;
			}
		}
	}
</style>
