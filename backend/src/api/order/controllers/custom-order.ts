/**
 * Custom order controller for user-facing order actions
 */
export default {
  // GET /api/orders/my — fetch all orders for the logged-in user
  async myOrders(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Bạn phải đăng nhập để xem đơn hàng.');
    }

    const orders = await strapi.db.query('api::order.order').findMany({
      where: { user: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return { data: orders };
  },

  // PUT /api/orders/:documentId/cancel — cancel an order and restore stock
  async cancelOrder(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('Bạn phải đăng nhập.');
    }

    const { documentId } = ctx.params;

    // Find the order using Document Service
    const order = await strapi.documents('api::order.order').findOne({
      documentId,
    });

    if (!order) {
      return ctx.notFound('Không tìm thấy đơn hàng.');
    }

    // Verify ownership: check that this order belongs to the current user
    const orderWithUser = await strapi.db.query('api::order.order').findOne({
      where: { documentId },
      populate: ['user'],
    });

    if (!orderWithUser || !orderWithUser.user || orderWithUser.user.id !== user.id) {
      return ctx.forbidden('Bạn không có quyền hủy đơn hàng này.');
    }

    // Only allow cancel if status is pending or processing
    if (order.orderStatus !== 'pending' && order.orderStatus !== 'processing') {
      return ctx.badRequest('Chỉ có thể hủy đơn hàng ở trạng thái Chờ xử lý hoặc Đang xử lý.');
    }

    // Restore stock for each item
    const items = (order.items as any[]) || [];
    for (const item of items) {
      if (!item.productId) continue;
      try {
        const product = await strapi.documents('api::product.product').findOne({
          documentId: item.productId,
          populate: ['variants'],
        });

        if (!product || !product.variants) continue;

        let variantsUpdated = false;
        const updatedVariants = product.variants.map((variant: any) => {
          if (variant.variantName === item.variantName || (!item.variantName && product.variants.length === 1)) {
            variant.stock += item.quantity;
            variantsUpdated = true;
          }
          return variant;
        });

        if (variantsUpdated) {
          await strapi.documents('api::product.product').update({
            documentId: item.productId,
            data: { variants: updatedVariants },
          });
          strapi.log.info(`[Order Cancel] Restored ${item.quantity} stock for ${product.productName} (${item.variantName || 'default'})`);
        }
      } catch (err) {
        strapi.log.error(`[Order Cancel] Error restoring stock for ${item.productId}: ${err}`);
      }
    }

    // Update order status to cancelled
    const updatedOrder = await strapi.documents('api::order.order').update({
      documentId,
      data: { orderStatus: 'cancelled' },
    });

    return { data: updatedOrder };
  },
};
