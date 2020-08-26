<template>
	<view class="list_box">
		<view class="header">
			<uni-search-bar class="search" radius="100" placeholder="搜索" v-model="inputValue"  cancelButton="none" />
		</view>
		<view class="content">
			<view class="left">
				<scroll-view scroll-y="true">
					<view class="item-box"  :class="{ 'active':-1==leftIndex }" @tap="leftTap(-1,item)">
						<view class="item" :class="{ 'active2':-1==leftIndex }">全部</view>
					</view>
					<view class="item-box" v-for="(item,index) in list" :key="index" :class="{ 'active':index==leftIndex }" @tap="leftTap(index,item)">
						<view class="item" :class="{ 'active2':index==leftIndex }">{{item.name}}</view>
					</view>
				</scroll-view>
			</view>
			<view class="main">
				<view class="banner">
					<image src="../../static/images/banner.png" mode="widthFix"></image>
				</view>
				<view class="select">
					<view class="unfold" @tap="goodCoupon">
						<image src="../../static/images/icon_more.png" mode="" :style="'transform:rotate('+ garrowRotate+'deg)'"></image>
					</view>
					<scroll-view class="uni-slidingMenu" scroll-x :style="{background: color}">
						<view :class="['slidingMenuList',-1==countryIndex?'active':'']" @click="countryMethods(-1)" v-cloak>全部</view>
						<view :class="['slidingMenuList',key==countryIndex?'active':'']" v-for="(item, key) in countryList" :key="key"
						 @click="countryMethods(key,item.countryID)" v-cloak>{{ item.countryName }}</view>
			</scroll-view>
				</view>
				<scroll-view scroll-y="true" class="Info-list" @scrolltolower="scrolltolower">
					<view class="InfoBox" v-for="(goods,Info) in goodslist" :key="Info" @click="Jump(goods)">
						<view class="InfoBox-left">
							<image :src="goods.image" mode="widthFix"></image>
						</view>
						<view class="InfoBox-right">
							<view class="goodsName">
								{{goods.goodsName}}
							</view>
							<view class="goodsDetails">
								{{goods.areaName}}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<uni-popup ref="popup" type="top" @change="closePopup" >
			<view class="screen">
			<!-- 	<view class="header" >
					<uni-search-bar class="search" radius="100" v-model="Info.goodsName" placeholder="搜索"  cancelButton="none"/> -->
				<!-- </view> -->
				<view class="screenBox" >
					<view class="product-delcom">
						<view class="product-name">国家</view>
						<view class="product-footerlist clearfix">
							<view class="footerlist-item" :key="-1" @click="countryMethods(-1)" :class="{ 'productActive':-1==countryIndex }">全部</view>
							<view class="footerlist-item" v-for="(country,n) in countryList" :key="n" @tap="countryMethods(n,country.countryID)" 
							 :class="{ 'productActive':n==countryIndex }">{{country.countryName}}</view>
						</view>
					</view>
					<view class="product-delcom" v-if="countryIndex!==-1">
						<view class="product-name">地区</view>
						<view class="product-footerlist ">
							<view class="footerlist-item" v-for="(region,p) in provinceList" :key="p" @tap="regionMethods(p,region.provinceID)" :class="{ 'productActive':p==regionIndex }">{{region.provinceName}}</view>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import com from '../common/com/com.js'
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	import uniSection from '@/components/uni-section/uni-section.vue'
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {
			uniSearchBar,
			uniSection,
			uniPopup
		},
		data() {
			return {
				leftIndex: -1,
				activeIndex: 0,
				countryIndex: -1,
				regionIndex: -1,
				garrowRotate: 0, // 展开收起
				scrollHeight: '450',
				list: [], //导航
				color: '#ffffff',
				countryList: [],
				provinceList: [],
				goodslist: [
				],
				inputValue:'',
				isScroll:true,
				Info: {
					areaId: 0,
					goodsName: '',
					pageNum: 1,
					pageSize: 10,
					categoryId:0
				}
			}
		},
		async onLoad() {
			this.getsalesCategory()
			await this.getCategoryData(0)
			await this.getallData()
		},
		watch:{
			inputValue(){
				this.Info.pageNum=1
				this.goodslist=[]
				this.Info.goodsName=this.inputValue.value
				this.getallData()
			}
		},
		methods: {
			/* 获取列表数据 */
			 getsalesCategory() {
				com.request('category/salesCategory', "", 'Get',  (data) => {
					if (data.data.code === 200) {
						this.list = data.data.data
						console.log("	this.list ",	this.list )
						// let categoryId = this.list[0] ? this.list[0].id: 0
						// await this.getCategoryData(categoryId)
						// this.Info.categoryId = this.list[0] ? this.list[0].id : 0
						// console.log("this.Info.goodsName",this.Info.goodsName)
						// await this.getallData()
					}

				})
			},
			/* 左侧导航点击 */
			async leftTap(e,item) {
				console.log(e)
				this.leftIndex = e
				this.Info.areaId=0
				this.goodslist=[]
				this.countryIndex=-1
				this.Info.pageNum=1
				if(e!==-1){
					this.Info.categoryId=item.id
					await this.getCategoryData(item.id)
				}else{
					this.Info.categoryId=0
				}
					
				
				await this.getallData()
			},
			
			getCategoryData(categoryId) {
				return new Promise((resolve, reject) => {
					com.request('area/salesArea/' + categoryId, {}, 'Get', (data) => {
						console.log(data)
						if (data.data.code === 200) {
							this.countryList = data.data.data
							resolve(true)
						}

					})
				})
			},

			getallData() {
				console.log(this.Info)
				return new Promise((resolve, reject) => {
					com.request('goods/getSalesList', this.Info, 'Post', (data) => {
						console.log(data)
						if (data.data.code === 200) {
							if(data.data.data.list.length>0){
								if(data.data.data.total>this.goodslist.length){
									this.goodslist = this.goodslist.concat(data.data.data.list)
								}
								this.isScroll=true
							}else{
								this.isScroll=false
							}
						
							
							resolve(true)
						}
					})
				})
			},
			//点击展开更多
			goodCoupon() {
				this.$refs.popup.open()
			},
			
			search (data){
				console.log("确定",data)
			
			},
			// 国家筛选
			countryMethods(p, countryId) {
				console.log("年后", p)
				this.countryIndex = p
				this.Info.pageNum=1
				if (countryId) {
					for (let s of this.countryList) {
						if (s.countryID === countryId) {
							this.provinceList = s.province
						}
					}
					this.Info.areaId=countryId
					this.getallData()
				} else {
					this.provinceLis = []
					this.Info.areaId=0
					
					this.getallData()
				}
				this.goodslist=[]
			},
			scrolltolower(){
				console.log(this.isScroll)
				if(this.isScroll){
						this.Info.pageNum++
						this.getallData()
				}
			
			},
			// 地区筛选
			regionMethods(p,id) {
				this.garrowRotate = 0
				this.$refs.popup.close()
				this.regionIndex = p
				this.Info.areaId=id
				this.Info.pageNum=1
				this.goodslist=[]
				this.getallData()
			
			},
			Jump(item){
				uni.navigateTo({
					url:'../detail/detail?goodsid='+item.goodsId
				})
			},
			// 弹窗关闭
			closePopup(e) {
				console.log(e)
				if (e.show) {
					this.garrowRotate = 180
					// console.log('打开')
				} else {
					this.garrowRotate = 0
					// console.log('关闭')
				}
			}
		}
	}
</script>

<style lang="scss">
	::-webkit-scrollbar {
		display: none;
	}

	page {
		background: #f6f6f6 !important;
	}


	.screen {
		// display: flex;
		flex-direction: column;
		// justify-content: flex-end;
		background: #FFFFFF;
		z-index: 10000;
		// align-items: flex-end;
		
		.header {
			width: 100%;
			box-sizing: border-box;
			background-color: #FFFFFF;
			padding: 20upx 30upx;
		}

		/deep/.screenBox {
			// width: calc(100% - 200rpx);
			background-color: #FFFFFF;
			box-sizing: border-box;
			padding-left: 20upx;
			padding-bottom: 30upx;

			.product-delcom {
				color: #323232;
				font-size: 26upx;
				border-bottom: 1px solid #f0f0f0;

				.product-name {
					width: 100%;
					height: 80upx;
					line-height: 80upx;
				}

				.product-footerlist {
					margin-top: 1upx;
					width: 100%;
					display: flex;
					flex-wrap: wrap;

					.footerlist-item {
						border: 1px solid #cecece;
						border-radius: 8upx;
						color: #000000;
						text-align: center;
						padding: 4upx 16upx;
						margin: 10upx;
						min-width: 96upx;
						margin-bottom: 16upx;
							
						&.productActive {
							background-color: #ffffff;
							color: #000000;
							border: 1px solid #a52024;
						}

					}
				}
			}
		}
	}

	.list_box {
		height: 100%;

		.header {
			background-color: #FFFFFF;
			padding: 20upx 30upx;
		}

		.content {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: flex-start;
			align-content: flex-start;
			font-size: 28rpx;

			.left {
				width: 200rpx;
				background-color: #f6f6f6;
				box-sizing: border-box;
				color: #838383;
				z-index: 99;

				.item-box {
					box-sizing: border-box;
					padding: 20upx 0;

					&.active {
						background-color: #fff;
					}

					.item {
						box-sizing: border-box;
						padding-left: 20upx;
						font-size: 32rpx;

						&.active2 {
							font-weight: 600;
							color: #000000;
							background-color: #fff;
							border-left: 3px solid #a52024;
						}
					}
				}

				.fill-last {
					height: 0;
					width: 100%;
					background: none;
				}
			}

			.main {
				background-color: #fff;
				padding-left: 20rpx;
				width: 0;
				flex-grow: 1;
				box-sizing: border-box;
				background-color: #FFFFFF;
				// overflow: hidden;
				.banner {
					width: 515upx;

					image {
						width: 100%;
					}
				}

				.select {
					// margin-top: 10upx;
					position: relative;

					.unfold {
						position: absolute;
						right: 0;
						top: 0;
						width: 70upx;
						height: 80upx;
						background-color: #FFFFFF;
						z-index: 99;
						display: flex;
						justify-content: center;
						align-items: center;

						image {
							width: 30upx;
							height: 30upx;
						}
					}

					/* 滑动菜单栏的总内容区域 */
					.uni-slidingMenu {
						width: 100%;
						white-space: nowrap;
						height: 80rpx;
						background-color: #FFFFFF;
						padding-top: 10upx;
					}

					/* 循环显示的菜单栏 */
					.slidingMenuList {
						// height: 80rpx;
						// line-height: 80rpx;
						padding: 10upx 20upx;
						display: inline-block;
						font-size: 24rpx;
						margin-left: 20rpx;
						border: 3rpx solid #989898;
						border-radius: 10rpx;
					}

					.slidingMenuList:last-child {
						margin-right: 80upx;
					}

					/* 点击选中菜单栏时的样式 */
					.active {
						color: #000000;
						font-size: 24rpx;
						// margin-left: 80rpx;
						border: 3rpx solid #a52024;
						box-sizing: border-box;
					}
				}

				.Info-list {
					width: 515upx;

					height: calc(100vh - 300upx);
					.InfoBox {
						display: flex;
						padding: 20upx 5upx;
						border-bottom: 1rpx solid #bababa;

						.InfoBox-left {

							// flex: 1;
							image {
								width: 150upx;
								height: 150upx;
							}
						}

						.InfoBox-right {
							// flex: 1;
							margin-left: 20upx;

							.goodsName {
								font-size: 30upx;
								color: #000000;
							}

							.goodsDetails {
								margin-top: 20upx;
								font-size: 26upx;
								color: #848484;
							}
						}
					}
				}
			}
		}
	}
</style>
