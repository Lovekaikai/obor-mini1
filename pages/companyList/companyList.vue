<template>
	<view class="companyList">
		<view class="flex_items logo_title">
		  <image src='../../static/images/icon_logo.png' class="logo"></image>
		  “一带一路”可追溯商品数据库
		</view>
		<!-- 搜索结果 -->
		<view class="flex_center result">中追溯为您找到
		  <span>{{count}}</span>个{{netType==6?'服务类':'生产类'}}商家</view>
		<!-- 结果列表 -->
		<scroll-view scroll-y style="height: calc(100vh - 44px - 60px);" @scrolltolower="scrollBottom">
		  <view class="resultList" v-for="(item,index) in list" :key="index" @click="jump_detail(index);">
		    <view class="shop flex_items">
		      <!-- <image :src="item.merchantLogo?item.merchantLogo:'/static/images/extra.png'"></image> -->
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
		    <!-- 老板信息 -->
		    <view class="bossInfo">
		      <view class="flex_items">
		        <image src="../../static/images/icon_user.png" class="name"></image>{{item.contact}}
		        <view>
		          <image src="../../static/images/icon_phone.png" class="phone"></image>{{item.phone | capitalize}}</view>
		      </view>
		      <view class="flex_items address">
		        <image src="../../static/images/icon_address.png"></image>
		        <view style="width:618upx;">{{item.site}}</view>
		      </view>
		    </view>
		  </view>
		</scroll-view>
		<!-- footer -->
		<view class="flex_center footer">
		  Copyright © 2017-2018 京ICP备17012074号
		</view>
	</view>
</template>

<script >
import com from '../common/com/com.js'
export default {
	data() {
		return {
			netType: '',
			list: [],
			pageNum: 1,
			pageSize: 15,
			count: '',
			bottom: false,
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
		
		// 跳转到detail页面
		jump_detail(index) {
		  const that = this
		  let url = "/pages/detail/detail?shopid=" + that.list[index].merchantId
		  com.navigateTo(url)
		},
		
		// 滚动到底部
		scrollBottom(){
		  const that = this
		  that.bottom=true
		  that.pageNum++
		  let number = that.count / that.pageSize
		  if (that.count % that.pageSize == 0) {
		    if (number >= that.pageNum) {
		      that.getListByNetType(that.netType)
		    }
		    else {
		      com.showtoast('没有更多数据')
		    }
		  }
		  else {
		    number = number + 1
		    if (number >= that.pageNum) {
		      that.getListByNetType(that.netType)
		    }
		    else {
		      com.showtoast('没有更多数据')
		    }
		  }
		},
		
		// 获取服务类/生产类商家列表
		  getListByNetType(netType) {
		    const that = this
		    let data = {
		      netType: netType,
		      pageNum: that.pageNum,
		      pageSize: that.pageSize
		    }
		    let success = function (res) {
		      if (res.data.code == 200) {
		        if(!that.bottom){
		          that.list=res.data.data.list
		          that.count=res.data.data.total
		        }
		        else{
		          let list=that.list.concat(res.data.data.list)
		          that.list=list
		        }
		      }
		    }
		    com.request('merchant/getListByNetType', data, "POST", success)
		  },
		
		  /**
		   * 生命周期函数--监听页面加载
		   */
		  onLoad: function (options) {
		    const that=this
		    if(options.shopid){
		      let netType = parseInt(options.shopid)
		      that.netType=netType
		      that.getListByNetType(netType)
		    }
		}
	}
}

</script>

<style>
@import url("../common/companyList.css");
.companyList{
	padding-bottom: 60upx;

}
</style>
