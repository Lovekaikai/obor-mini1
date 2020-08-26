<template>
	<view style="padding-bottom: 300rpx;">
		<view class="flex_items logo_title">
		  <image src='../../static/images/icon_logo.png' class="logo"></image>
		  “一带一路”可追溯商品数据库
		</view>
		<!-- 搜索 -->
		<view class='align_center logo_search'>
		  <!-- logo -->
		  <image src='../../static/images/logo.png' class="logo"></image>
		  <!-- 标题 -->
		  <view class="title"> “一带一路”可追溯商品数据库</view>
		  <!-- 搜索功能 -->
		  <view class='flex search'>
		    <input placeholder='请输入商品或公司名称' @input="searchInput"></input>
		    <view class="flex_center clickSearch" @click="jumpSearch">
		      <image src="../../static/images/icon_search.png" ></image>
		      查询
		    </view>
		  </view>
		</view>
		
		<!-- 商家类型 -->
		<view v-for="(item,index) in items" :key="index" @click='jump_companyList(index);' class="flex_center kinds">
		  <image :src='item.icon' style="width:59upx;height:57upx"></image>
		  {{item.text}}
		</view>
		
		<!-- 底部版权 -->
		<view class='fixed_bottom copyright'>
		  <view>{{footer.phone}}</view>
		  <view style='margin:20upx 0;'>{{footer.copyright}}</view>
		  <view>{{footer.title}}</view>
		</view>
	</view>
</template>
<script>
import com from '../common/com/com.js'
export default {
	data() {
		return {
			items: [{
				// icon: '/static/images/icon_service.png',
				icon:'../../static/images/icon_service.png',
				text: '服务类商家',
				width: 59,
				height: 57
			}, {
				icon: '/static/images/icon_product.png',
				text: '生产类商家',
				width: 59,
				height: 59
			}, {
				icon: '/static/images/state.png',
				text: '国际采购专区',
				width: 59,
				height: 59
			}],
			footer: '', //底部copyright
			key: '' //搜索关键字
		}
	},
	methods: {
		// 输入框关键字
		  searchInput(e) {
		    const that = this
		    that.key=e.detail.value
		  },
		  // 查询
		  jumpSearch(e) {
		    const that = this
		    let key = that.key.replace(/(^\s*)|(\s*$)/g, "")
		    if (key.length == 0 || key == "公司" || key == "有限公司" || key == "企业") {
		      com.showtoast('请重新输入检索词')
		      that.key=''
		    } else {
		      // 商品请求数据
		      let goodsData = {
		        goodsName: that.key,
		      },
		        // 商品请求成功
		        goodsSuccess = function (res) {
		          // 有数据(传商品名)
		          if (res.data.data.total != 0) {
		            let url = '/pages/search/search?goodsName=' + key
		            com.navigateTo(url)
		          }
		          // 无数据
		          else {
		            // 请求商家列表
		            let shopData = {
		              merchantName: that.key
		            }
		            let shopsSuccess = function (res) {
		              // 有数据(传商家名)
		              if (res.data.data.total != 0) {
		                let url1 = '/pages/search/search?shopName=' + key
		                com.navigateTo(url1)
		              }
		              // 无数据(直接跳转传值，为无数据页面)
		              else {
		                let url2 = '/pages/search/search?name=' + key
		                com.navigateTo(url2)
		              }
		            }
		            com.request('merchant/getList', shopData, 'POST', shopsSuccess)
		          }
		        }
		      //请求商品列表
		      com.request('goods/getList', goodsData, 'POST', goodsSuccess)
		    }
		  },
		
		  // 跳转到公司列表
		  jump_companyList(index) {
		    switch (index) {
		      // 服务类商家
		      case 0:
		        var url = "/pages/companyList/companyList?shopid=" + 6
		        break;
		      // 生产类商家
		      case 1:
		        var url = "/pages/companyList/companyList?shopid=" + 7
		        break;
				// 生产类商家
				case 2:
				  var url = "/pages/banner/banner"
				  break;
		    }
		    com.navigateTo(url)
		  },
		  /**
		   * 生命周期函数--监听页面加载
		   */
		  onLoad: function (options) {
		    this.footer=com.footer
		  }
	}
}

</script>

<style lang="less">
@import url("../common/index.css");
</style>
