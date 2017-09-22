// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import vueInfiniteScroll from 'vue-infinite-scroll'
//import {currency} from './util/currency'

Vue.config.productionTip = false
Vue.use(VueLazyLoad,{
  loading:"/static/loading/loading-bars.svg",
  error: '/static/loading/loading-balls.svg',
});
Vue.use(vueInfiniteScroll);
Vue.use(Vuex);

const store = new Vuex.Store({
  state:{
    nickName:'',
    cartCount:0
  },
  mutations:{
    updateUserInfo(state,nickName){
      state.nickName =nickName;
    },
    updateCartCount(state, cartCount){
      state.cartCount += cartCount;
    },
    initCartCount(state, cartCount){
      state.cartCount = cartCount;
    }
  }
})
//Vue.filter("currency",currency);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
