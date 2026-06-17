export default {
  routes: [
    {
      method: 'GET',
      path: '/cart-items/my',
      handler: 'cart-item.myCart',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/cart-items/sync',
      handler: 'cart-item.syncCart',
      config: {
        policies: [],
      },
    }
  ]
}
