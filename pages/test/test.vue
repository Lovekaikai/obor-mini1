<template>
	<view>
		<view class="uni-padding-wrap">
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
						<swiper-item v-for="(item,index) in info" :key="index" style="height: 300px;width: 100%;">
							<view class="swiper-item uni-bg-red">
								<image :src="item.content" mode="aspectFill"></image>
							</view>
						</swiper-item>

					</swiper>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import com from '../common/com/com.js'
	export default {
		data() {
			return {

				indicatorDots: true,
				autoplay: false,
				interval: 2000,
				duration: 500,
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
				merchantLogo: ''
			}
		},
		onLoad: function(options) {
			const that = this
			// 商品
			if (options.goodsid) {
				that.selectIndex = 0
				that.getGoodsDetail(parseInt(options.goodsid))
			}
			// 商家
			else {
				that.selectIndex = 1
				that.getMerchantDetail(parseInt(options.shopid))
			}
		},
		methods:{
			// 请求商品详情
			getGoodsDetail(goodsId) {
				const that = this
				let data = {
					goodsId: goodsId
				}
				com.request('goods/getGoodsDetail', data, "GET", (res) => {
					that.goodsList = res.data.data
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
			}
		}
	}
</script>

<style>
</style>
