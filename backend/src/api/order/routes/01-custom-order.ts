export default {
  routes: [
    {
      method: 'GET',
      path: '/orders/my',
      handler: 'custom-order.myOrders',
      config: {
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/orders/:documentId/cancel',
      handler: 'custom-order.cancelOrder',
      config: {
        policies: [],
      },
    }
  ]
}
