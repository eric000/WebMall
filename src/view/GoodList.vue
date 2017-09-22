<template>
  <div>
<nav-header></nav-header>
<nav-bread>
    <span slot="bread"> GOODS</span>
</nav-bread>
<div class="accessory-result-page accessory-page">
  <div class="container">
    <div class="filter-nav">
      <span class="sortby">Sort by:</span>
      <a href="javascript:void(0)" class="default cur">Default</a>
      <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short" v-bind:class="{'sort-up':!sorFlag}"><use xlink:href="#icon-arrow-short"></use></svg></a>
      <a href="javascript:void(0)" class="filterby stopPop" >Filter by</a>
    </div>
    <div class="accessory-result">
      <!-- filter -->
      <div class="filter stopPop" id="filter" >
        <dl class="filter-price">
          <dt>Price:</dt>
          <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked=='all'}"  @click="priceChecked='all'">All</a></dd>
          <dd v-for="(price,index) in priceFilter" >
            <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}">{{price.startPrice}} - {{price.endPrice }}</a>
          </dd>
        </dl>
      </div>

      <!-- search result accessories list -->
      <div class="accessory-list-wrap">
        <div class="accessory-list col-4">
          <ul>
            <li v-for="(item,index) in goodsList">
              <div class="pic">
                <a href="#" ><img v-lazy="'/static/img/'+item.productImage" alt=""></a>
              </div>
              <div class="main">
                <div class="name">{{ item.productName}}</div>
                <div class="price">{{item.salePrice}}</div>
                <div class="btn-area">
                  <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                </div>
              </div>
            </li>
          </ul>
          <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
            <img src="./../assets/loading-bubbles.svg" alt="loading" v-show="loading">
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<nav-footer></nav-footer>
<modal  v-bind:mdShow="mdShow" v-on:close="closeModal">
  <p slot="message">
    请先登录否则无法添加到购物车中
  </p>
  <div slot="btnGroup">
    <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
  </div>
</modal>

<modal  v-bind:mdShow="mdShowCart" v-on:close="closeModal">
  <p slot="message">
    <svg class="icon-status-ok" >
      <use xlink:href="#icon-status-ok"></use>
    </svg>
    加入购物车成功!
  </p>
  <div slot="btnGroup">
    <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
    <router-link  class="btn btn--m" href="javascript:;" to="/cart">查看购物车</router-link>
  </div>
</modal>

  </div>
</template>
<script>
import './../assets/css/base.css' 
import './../assets/css/product.css'
import Navheader from '@/components/Header.vue' 
import NavFooter from '@/components/Footer.vue'
import NavBread from '@/components/Bread.vue'
import Modal from '@/components/Modal.vue'

import axios from 'axios'

export default {
    data(){
        return{
            goodsList:[],
            priceFilter:[
              {
                startPrice:'0.00',
                endPrice:'500.00'
              },
              {
                startPrice:'500.00',
                endPrice:'1000.00'
              },
              {
                startPrice:'1000.00',
                endPrice:'2000.00'
              }
            ],
            priceChecked: 'all',
            filterBy:false,
            overLayFlag:false,
            sorFlag:true,
            page :1,
            pageSize:8,
            busy:true,
            loading:false,
            mdShow:false,
            mdShowCart:false
        }
    },
    components:{
        'nav-header':Navheader,
        NavFooter,
        NavBread,
        Modal
    },
    mounted: function(){
      this.getGoodsData();
    },
    methods:{
      getGoodsData(flag){
        var param = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sorFlag?1:-1,
          priceLevel: this.priceChecked
        }
        this.loading = true;
        axios.get("/goods/list",{params:param}).then((result)=>{
          var res = result.data;
          //console.log(res);
          this.loading = false;
          console.log('res.status',res.status)
          if(res.status == "0"){
            if(flag){
              this.goodsList = this.goodsList.concat(res.result.list);
              if(res.result.count == 0){
                this.busy = true;
              }else{
                this.busy = false;
              }
            }else{
              this.goodsList = res.result.list;
              this.busy = false;
            }
          }else{
            this.goodsList = [];
          }
        })
      },
      sortGoods(){
        this.sorFlag = !this.sorFlag;
        this.page= 1;
        this.getGoodsData();
      },
      setPriceFilter(index){
        this.priceChecked = index;
        this.page = 1;
        this.getGoodsData();
      },
      loadMore: function() {
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodsData(true);
         
          this.busy = false;
        }, 1000);
      },
      addCart(productId){
        axios.post("/goods/addCart",{
          productId:productId
        }).then((res)=>{
          if(res.data.status == 0){
            this.mdShowCart = true;
            this.$store.commit("updateCartCount",1);
          }else{
            this.mdShow = true;
          }
        })
      },
      closeModal(){
        this.mdShow = false;
        this.mdShowCart = false;
      }
    }
}
</script>
