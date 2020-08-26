<template>
	<view class="search">
		<view class='flex logo_search' id="top">
		  <!-- logo -->
		  <image src='/static/images/icon_logo.png' class="logo"></image>
		  <!-- 搜索功能 -->
		  <view class="flex border searchFun">
		    <picker class='flex_center select' mode="selector" :value="selectIndex" :range="selectArray" @change="changeSelect">
		      {{selectArray[selectIndex]}}
		      <image src="/static/images/icon_bottom.png" class="icon_bottom"></image>
		    </picker>
		    <!-- 搜索输入框 -->
		    <input class="border_left border_right" :value='searchValue' @input="getValue"></input>
		    <!-- 搜索图标 -->
		    <view class="flex_center" style='width:72upx;' @click="clickSearch">
		      <image src="/static/images/icon_Rsearch.png" class="icon_search"></image>
		    </view>
		  </view>
		  <!-- 筛选 -->
		  <view class="flex_center selectMany" @click='changeShow'>
		    筛选
		    <image src="/static/images/icon_select.png" class="icon_select"></image>
		  </view>
		</view>
		
		<!-- 无数据 -->
		<view v-if="noData" class='fixed_X nowrap noData'>
		  <image src='/static/images/noData.png'></image>
		  <view class="tip">暂无查询结果，请修改检索内容</view>
		  若有疑问，请致电：020-31420284
		</view>
		
		<!-- 有数据 -->
		<view v-else>
		  <view class="flex_center tips" id="tip"> 中追溯为您找到 <span>{{count}}</span>个符合条件的{{selectIndex==0?'商品':'商家'}}</view>
		  <!-- 商品 -->
		  <block v-if="selectIndex==0">
		    <scroll-view style="height:calc(100vh - 196.8upx);padding-bottom: 60upx;" scroll-y lower-threshold="50" @scrolltolower="scrollBottom">
		      <view class="goods flex_items" v-for="(item,index) in list" :key="index" @click="jump_detail(index)">
				 
		        <image v-if="item.goodsPicture" :src="item.goodsPicture" ></image>
				 <image v-if="!item.goodsPicture" src="../../static/images/extra.png" ></image>
		        <view>
		          <!-- 商品名 -->
		          <view class="flex_items">
		            <view class="goodsName ellipsis">{{item.goodsName}}</view>
		            <view class="brandName ellipsis" v-if="item.brandName">{{item.brandName}}</view>
		          </view>
		          <!-- 类别 -->
		          <view class="kinds">商品类别：{{item.categoryName}}</view>
		          <!-- 入库时间 -->
		          <view>入库时间：{{item.enterTime}}</view>
		        </view>
		      </view>
		    </scroll-view>
		  </block>
		  
		  <!-- 商家 -->
		  <block v-if="selectIndex==1">
		    <scroll-view style="height:calc(100vh - 196.8upx);" scroll-y lower-threshold="50" @scrolltolower="scrollBottom">
		      <view class="shop flex_items" v-for="(item,index) in list" :key="index" @click="jump_detail(index)">
		
				
				<image v-if="item.merchantLogo" :src="item.merchantLogo" ></image>
				 <image v-if="!item.merchantLogo" src="../../static/images/extra.png" ></image>
		        <view class="shopInfo">
		          <!-- 商家名 -->
		          <view class="flex_items">
		            <view class="shopName ellipsis">{{item.merchantName}}</view>
		            <view class="brandName">
		              <view class="tags">{{item.enterprise}}</view>
		              <view class="tags">{{item.approve?'已认证':'未认证'}}</view>
		            </view>
		          </view>
		          <!-- 商家类别 -->
		          <view class="tag">
		            <view class="blue">{{item.merchantType}}</view>
		            <view class="red">{{item.netType}}</view>
		            <view class="green ellipsis">{{item.businessLines}}</view>
		          </view>
		          <!-- 入库时间 -->
		          <view>入库时间: {{item.enterTime}}</view>
		        </view>
		      </view>
		    </scroll-view>
		  </block>
		  
		  <!-- footer -->
		  <view class="flex_center footer" id="bottom">
		    Copyright © 2017-2018 京ICP备17012074号
		  </view>
		</view>
		
		<!-- 筛选 -->
		<view class="shade" v-if="selectShow" @click="changeShow"></view>
		<view v-if="selectShow" class="fixed_top selectTotast">
		  <view class="selectBox">
		    <!-- 商品 -->
		    <block v-if="selectIndex==0">
		      <view class="typeTitle">商品类别</view>
		      <view class="flex_wrap typeItem">
		        <view v-for="(item,index) in goodsType" :key="index" :class="[goods_typeIndex==index?'active_item':'']" @click="change_goodsType(index)">{{item.name}}</view>
		      </view>
		    </block>
		    <!-- 商家 -->
		    <block v-else>
		      <view class="typeTitle">入网类型</view>
		      <view class="flex_wrap typeItem">
		        <view v-for="(item,index) in netTypes" :key="index" :class="[netType_id==index?'active_item':'']" @click="change_netType(index)">{{item.name}}</view>
		      </view>
		      <view class="typeTitle">是否企业</view>
		      <view class="flex_wrap typeItem">
		        <view v-for="(item,index) in isCompany" :key="index" :class="[isIndex==index?'active_item':'']" @click="change_isCompany(index)">{{item}}</view>
		      </view>
		      <view class="typeTitle">商家类型</view>
		      <view class="flex_wrap typeItem">
		        <view v-for="(item,index) in shopType" :key="index" :class="[shop_typeIndex==index?'active_item':'']" @click="change_shopType(index)">{{item.name}}</view>
		      </view>
		    </block>
		
		    <!-- 商家所在地 -->
		    <view class="typeTitle">商家所在地</view>
		    <view class="flex_wrap typeItem">
		      <picker mode="selector" class="flex_center" :range="countries" @change="changeCountry">
		        {{countries[country]?countries[country]:'国家'}}
		        <image src='/static/images/icon_bottom.png' class="icon_bottom"></image>
		      </picker>
		      <picker mode="selector" class="flex_center" :range="provinces" @change="changeProvince">
		        {{provinces[province]?provinces[province]:'省份'}}
		        <image src='/static/images/icon_bottom.png' class="icon_bottom"></image>
		      </picker>
		      <picker mode="selector" class="flex_center" :range="cities" @change="changeCity">
		        {{cities[city]?cities[city]:'城市'}}
		        <image src='/static/images/icon_bottom.png' class="icon_bottom"></image>
		      </picker>
		      <picker mode="selector" class="flex_center" :range="areas" @change="changeArea">
		        {{areas[area]?areas[area]:'地区'}}
		        <image src='/static/images/icon_bottom.png' class="icon_bottom"></image>
		      </picker>
		    </view>
		    <!-- 入库时间 -->
		    <view class="typeTitle">入库时间</view>
		    <view class='typeItem1 flex'>
		      <picker class="flex_center" mode="date" :value="startDate" @change="changeStartDate" end="2037-12-31">{{startDate}}</picker>
		      <view class="flex_center line">
		        <view></view>
		      </view>
		      <picker class="flex_center" mode="date" :value="endDate" @change="changeEndDate" end="2037-12-31">{{endDate}}</picker>
		    </view>
		  </view>
		  <!-- 重置确定按钮 -->
		  <view class="absolute_bottom buttons">
		    <view class="flex_center" @click="reset">重置</view>
		    <view class="flex_center" @click="confirm">确定</view>
		  </view>
		</view>
	</view>
</template>

<script >
import com from '../common/com/com.js'
export default {
	data() {
		return {
			noData: false, //有无数据
			selectArray: ['商品', '商家'], // 商品商家选择
			selectIndex: 0, // 商品商家选择id
			searchValue: '', //搜索值
			selectShow: false, //筛选弹窗
			pageSize: 15, //每页数据量
			pageNum: 1, // 页数
			goodsType: [], //商品类别
			goods_typeIndex: null, //商品类别ID
			isCompany: ['是', '否'], //是否企业
			isIndex: null,
			shopType: [], // 商家类型
			shop_typeIndex: null, //商家类型ID
			netTypes: [], //商家入网类型
			netType_id: null, //商家入网类型ID
			list: [], //数据列表
			count: '',
			// 选择地区
			countryData: '', //国家
			countries: [],
			country: '',
			countryId: '',
			provinceData: '', //省
			provinces: [],
			province: '',
			provinceId: '',
			cityData: '', //市
			cities: [],
			city: '',
			cityId: '',
			areaData: '', //地区
			areas: [],
			area: '',
			areaId: '',
			countyId: '',
			// 入库时间
			startDate: '1970-10-10', //开始时间
			endDate: '2037-12-31', //结束时间
			startEnterTime: 24336000, //入库开始时间
			endEnterTime: 2145887940, //入库结束时间
			// scrollHeight: '', //滚动高度
			bottom: false, //滚动到底部
		}
	},

	methods: {
		// 商品商家选择
		changeSelect(e) {
			const that = this
			that.selectIndex = e.detail.value
			that.bottom = false
			that.pageNum = 1
			// 商品
			if (that.selectIndex == 0) {
				that.goods_getList(that.searchValue, null, null)
			}
			// 商家
			else {
				that.merchant_getList(that.searchValue, null, null, null)
			}
		},
		// 获取输入框的值
		getValue(e) {
			const that = this
			that.searchValue = e.detail.value
		},

		// 点击搜索
		clickSearch() {
			const that = this
			that.pageNum = 1
			that.bottom = false
			//商品
			if (that.selectIndex == 0) {
				that.goods_getList(that.searchValue, null, null)
			}
			// 商家
			else {
				that.merchant_getList(that.searchValue, null, null, null)
			}
		},

		// 跳转到详情页
		jump_detail(index) {
			const that = this
			let list = that.list[index]
			// 商品
			if (that.selectIndex == 0) {
				var url = '/pages/detail/detail?goodsid=' + list.goodsId
			}
			// 商家
			else {
				var url = '/pages/detail/detail?shopid=' + list.merchantId
			}
			com.navigateTo(url)
		},

		// 控制筛选出现
		changeShow() {
			const that = this
			that.selectShow = !that.selectShow
			// 显示
			if (that.selectShow) {
				// 国家列表
				let success = function(res) {
					that.countryData = res.data.data
					let countries = []
					for (let i in res.data.data) {
						countries.push(res.data.data[i].name)
					}
					that.countries = countries
				}
				that.area_getList('', 1, success)
				// 商品
				if (that.selectIndex == 0) {
					that.category_getSimpleList()
				}
				// 商家
				else {
					that.merchantType_getNetType()
					that.merchantType_getMerchantType()
				}
			}
		},

		// 选择商品类型
		change_goodsType(index) {
			const that = this
			that.goods_typeIndex = index
		},

		// 选择商家入网类型
		change_netType(index) {
			const that = this
			that.netType_id = index
		},

		// 选择是否企业
		change_isCompany(index) {
			const that = this
			that.isIndex = index
			that.merchantType_getMerchantType()
		},

		// 选择商家类型
		change_shopType(index) {
			const that = this
			that.shop_typeIndex = index
		},

		// 选择国家
		changeCountry(e) {
			const that = this
			that.country = e.detail.value
			that.countryId = that.countryData[e.detail.value].id
			let success = function(res) {
				that.provinceData = res.data.data
				let provinces = []
				for (let i in res.data.data) {
					provinces.push(res.data.data[i].name)
				}
				that.provinces = provinces
			}
			that.area_getList(that.countryData[e.detail.value].id, 2, success)
		},
		// 选择省份
		changeProvince(e) {
			const that = this
			that.province = e.detail.value
			that.provinceId = that.provinceData[e.detail.value].id
			let success = function(res) {
				that.cityData = res.data.data
				let cities = []
				for (let i in res.data.data) {
					cities.push(res.data.data[i].name)
				}
				that.cities = cities
			}
			that.area_getList(that.provinceData[e.detail.value].id, 3, success)
		},
		// 选择城市
		changeCity(e) {
			const that = this
			that.city = e.detail.value,
				that.cityId = that.cityData[e.detail.value].id
			let success = function(res) {
				that.areaData = res.data.data
				let areas = []
				for (let i in res.data.data) {
					areas.push(res.data.data[i].name)
				}
				that.areas = areas
			}
			that.area_getList(that.cityData[e.detail.value].id, 4, success)
		},
		// 选择地区
		changeArea(e) {
			const that = this
			that.area = e.detail.value
			that.areaId = that.areaData[e.detail.value].id
		},

		// 入库时间：改变开始日期
		changeStartDate(e) {
			const that = this
			let startEnterTime = Date.parse(new Date(that.startDate + ' ' + '00:00'))
			that.startDate = e.detail.value
		},

		// 入库时间：改变结束日期
		changeEndDate(e) {
			const that = this
			let endEnterTime = Date.parse(new Date(that.startDate + ' ' + '23:59'))
			that.endDate = e.detail.value
		},

		// 重置（筛选）
		 reset() {
		   const that = this
		   that.startDate = '1970-10-10'
		   that.endDate = '2037-12-31'
		   that.startEnterTime = null
		   that.endEnterTime = null
		   that.countyId = null
		   that.countryId=''
		   that.provinceId=''
		   that.cityId=''
		   that.areaId=''
		   that.country=''
		   that.province=''
		   that.city=''
		   that.area=''
		   that.provinces=''
		   that.cities=''
		   that.areas=''
		   // 商品
		   if (that.selectIndex == 0) {
		    that.goods_typeIndex = null
		   }
		   // 商家
		   else {
		    that.isIndex = null
		    that.netType_id = null
		    that.shop_typeIndex = null
		   }
		  },

		// 确定（筛选）
		confirm() {
			const that = this
			let startEnterTime = Date.parse(new Date(that.startDate + ' ' + '00:00:00')) / 1000
			let endEnterTime = Date.parse(new Date(that.endDate + ' ' + '23:59:59')) / 1000
			let countyId = that.areaId ? that.areaId : that.cityId ? that.cityId : that.provinceId ?
				that.provinceId : that.countryId ? that.countryId : null
			that.startEnterTime = startEnterTime
			that.endEnterTime = endEnterTime
			that.countyId = countyId
			that.pageNum = 1
			that.bottom = false
			console.log('countyId',countyId)
			// 商品
			if (that.selectIndex == 0) {
				if (that.goods_typeIndex != null) {
					var categoryId = that.goodsType[that.goods_typeIndex].id
				} else {
					var categoryId = null
				}
				that.goods_getList(that.searchValue, categoryId, countyId)
			}
			// 商家
			else {
				if (that.netType_id != null) {
					var netType = that.netTypes[that.netType_id].id
				} else {
					var netType = null
				}
				if (that.shop_typeIndex != null) {
					var merchantType = that.shopType[that.shop_typeIndex].id
				} else {
					var merchantType = null
				}
				that.merchant_getList(that.searchValue, netType, merchantType, countyId)
			}
			that.selectShow = !that.selectShow
		},

		// 滚动到底部
		scrollBottom() {
			console.log(1)
			const that = this
			that.bottom = true
			that.pageNum++
			let number = that.count / that.pageSize
			if (that.count % that.pageSize == 0) {
				if (number >= that.pageNum) {
					that.scrollFun()
				} else {
					com.showtoast('没有更多数据')
				}
			} else {
				number = number + 1
				if (number >= that.pageNum) {
					that.scrollFun()
				} else {
					com.showtoast('没有更多数据')
				}
			}
		},

		scrollFun() {
			const that = this
			let countyId = that.areaId ? that.areaId : that.cityId ? that.cityId : that.provinceId ?
				that.provinceId : that.countryId ? that.countryId : null
			// 商品
			if (that.selectIndex == 0) {
				if (that.goods_typeIndex) {
					var categoryId = that.goodsType[that.goods_typeIndex].id
				} else {
					var categoryId = null
				}
				that.goods_getList(that.searchValue, categoryId, countyId)
			}
			// 商家
			else {
				if (that.netType_id) {
					var netType = that.netTypes[that.netType_id].id
				} else {
					var netType = null
				}
				if (that.shop_typeIndex) {
					var merchantType = that.shopType[that.shop_typeIndex].id
				} else {
					var merchantType = null
				}
				that.merchant_getList(that.searchValue, netType, merchantType, countyId)
			}
		},

		//请求商家所在地
		area_getList(areaId, level, success) {
			let data = {
				areaId: areaId,
				level: level
			}
			com.request('area/getList', data, "GET", success)
		},
		//请求商品列表(商品名称,商品分类ID,地区ID)
		goods_getList(goodsName, categoryId, countyId) {
			const that = this
			let data = {
				goodsName: goodsName,
				categoryId: categoryId,
				countyId: countyId,
				startEnterTime: that.startEnterTime,
				endEnterTime: that.endEnterTime,
				pageNum: that.pageNum,
				pageSize: that.pageSize
			}
			let success = function(res) {
				if (res.data.code == 200) {
					if (res.data.data.total == 0) {
						that.noData = true
					} else {
						if (!that.bottom) {
							that.list = res.data.data.list
							that.count = res.data.data.total
							that.noData = false
						} else {
							let list = that.list.concat(res.data.data.list)
							that.list = list
						}
					}
				}
			}
			com.request('goods/getList', data, "POST", success)
		},

		// 请求商品类别列表
		category_getSimpleList() {
			const that = this
			// let goodsName=that.searchValue?that.searchValue:''
			let data = {
				goodsName: ''
			}
			let success = function(res) {
				if (res.data.code == 200) {
					that.goodsType = res.data.data
				}
			}
			com.request('category/getSimpleList', data, "GET", success)
		},
		// 请求商家列表(商家名称,入网类型,商家类型,地区ID)
		merchant_getList(merchantName, netType, merchantType, countyId) {
			const that = this
			let data = {
				merchantName: merchantName,
				netType: netType,
				merchantType: merchantType,
				countyId: countyId,
				startEnterTime: that.startEnterTime,
				endEnterTime: that.endEnterTime,
				pageNum: that.pageNum,
				pageSize: that.pageSize
			}
			let success = function(res) {
				if (res.data.code == 200) {
					if (res.data.data.total == 0) {
						that.noData = true
					} else {
						if (!that.bottom) {
							that.list = res.data.data.list
							that.count = res.data.data.total
							that.noData = false
						} else {
							let list = that.list.concat(res.data.data.list)
							that.list = list
						}
					}
				}
			}
			com.request('merchant/getList', data, "POST", success)
		},

		// 请求商家入网类型
		merchantType_getNetType() {
			const that = this
			let data = {}
			let success = function(res) {
				that.netTypes = res.data.data
			}
			com.request('merchantType/getNetType', data, "GET", success)
		},

		// 请求商家类型
		merchantType_getMerchantType() {
			const that = this
			if (that.isIndex == null) {
				var data = {}
			} else {
				var enterprise = that.isIndex ? false : true
				var data = {
					enterprise: enterprise
				}
			}
			let success = function(res) {
				if (res.data.code == 200) {
					that.shopType = res.data.data
				}
			}
			com.request('merchantType/getMerchantType', data, "GET", success)
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			const that = this
			// 无数据
			if (options.name) {
				that.noData = true
			}
			// 有数据
			else {
				that.noData = false
				// 商品
				if (options.goodsName) {
					that.searchValue = options.goodsName
					that.selectIndex = 0
					that.goods_getList(options.goodsName, null, null)
				}
				// 商家
				else {
					that.searchValue = options.shopName,
						that.selectIndex = 1
					that.merchant_getList(options.shopName, null, null, null)
				}
			}
		}
	}
}

</script>

<style>
	@import url("../common/search.css");
	.search{

	
	}
</style>
