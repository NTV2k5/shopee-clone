export default {
  // Deduct stock when a new order is created
  async afterCreate(event: any) {
    const { result } = event;
    const items = (result.items as any[]) || [];

    for (const item of items) {
      if (!item.productId) continue;

      try {
        const product = await strapi.documents('api::product.product').findOne({
          documentId: item.productId,
          populate: ['variants']
        });

        if (!product || !product.variants) continue;

        let variantsUpdated = false;
        const updatedVariants = product.variants.map((variant: any) => {
          if ((variant.variantName === item.variantName || (!item.variantName && product.variants.length === 1)) && variant.stock >= item.quantity) {
            variant.stock -= item.quantity;
            variantsUpdated = true;
          }
          return variant;
        });

        if (variantsUpdated) {
          await strapi.documents('api::product.product').update({
            documentId: item.productId,
            data: { variants: updatedVariants }
          });
          strapi.log.info(`[Order Lifecycle] Deducted ${item.quantity} stock from ${product.productName} (${item.variantName || 'default'})`);
        }
      } catch (err) {
        strapi.log.error(`[Order Lifecycle] Error deducting stock for ${item.productId}: ${err}`);
      }
    }
  },

  // Restore stock when order status is changed to "cancelled" via Strapi Admin
  async beforeUpdate(event: any) {
    const { data, where } = event.params;
    
    // Only proceed if orderStatus is being changed to "cancelled"
    if (data?.orderStatus !== 'cancelled') return;

    try {
      // Find the current order to check its previous status
      const existingOrder = await strapi.db.query('api::order.order').findOne({
        where,
      });

      if (!existingOrder) return;

      // Only restore stock if the order wasn't already cancelled
      if (existingOrder.orderStatus === 'cancelled') return;

      const items = (existingOrder.items as any[]) || [];

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
            strapi.log.info(`[Order Cancel - Admin] Restored ${item.quantity} stock for ${product.productName} (${item.variantName || 'default'})`);
          }
        } catch (err) {
          strapi.log.error(`[Order Cancel - Admin] Error restoring stock for ${item.productId}: ${err}`);
        }
      }
    } catch (err) {
      strapi.log.error(`[Order Lifecycle] beforeUpdate error: ${err}`);
    }
  }
};
