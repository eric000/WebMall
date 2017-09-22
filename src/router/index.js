import Vue from 'vue'
import Router from 'vue-router'
import GoodList from './../view/GoodList'
import Cart from './../view/Cart'
import Address from './../view/Address'
import OrderSuccess from './../view/OrderSuccess'
import orderConfirm from './../view/orderConfirm'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodList',
      component: GoodList
    },
    {
      path: '/cart',
      name: 'GoodList',
      component: Cart
    },
    {
      path: '/OrderSuccess',
      name: 'OrderSuccess',
      component: OrderSuccess
    },
    {
      path: '/orderConfirm',
      name: 'orderConfirm',
      component: orderConfirm
    }

  ]
})
 