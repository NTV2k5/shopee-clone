import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::cart-item.cart-item', ({ strapi }) => ({
  async myCart(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to fetch your cart');
    }

    const items = await strapi.db.query('api::cart-item.cart-item').findMany({
      where: { user: user.id },
      populate: { product: { populate: ['image', 'variants'] } },
    });

    return { data: items };
  },

  async syncCart(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to sync your cart');
    }

    const { items } = ctx.request.body;
    if (!Array.isArray(items)) {
      return ctx.badRequest('Items must be an array');
    }

    // 1. Delete all existing cart items for this user
    await strapi.db.query('api::cart-item.cart-item').deleteMany({
      where: { user: user.id },
    });

    // 2. Insert new ones
    const createdItems = [];
    for (const item of items) {
      const created = await strapi.entityService.create('api::cart-item.cart-item', {
        data: {
          user: user.id,
          product: item.product,
          variantName: item.variantName || null,
          quantity: item.quantity,
          publishedAt: new Date(),
        },
        populate: { product: { populate: ['image', 'variants'] } }
      });
      createdItems.push(created);
    }

    return { data: createdItems };
  }
}));
