import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // 1. Grant permissions to Public role for Product API
    try {
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });

      if (publicRole) {
        const productPermissions = [
          { action: 'api::product.product.find', target: 'api::product.product' },
          { action: 'api::product.product.findOne', target: 'api::product.product' },
          { action: 'api::product.product.create', target: 'api::product.product' },
          { action: 'api::product.product.update', target: 'api::product.product' },
        ];

        for (const perm of productPermissions) {
          const exists = await strapi.query('plugin::users-permissions.permission').findOne({
            where: { action: perm.action, role: publicRole.id },
          });

          if (!exists) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: {
                action: perm.action,
                role: publicRole.id,
              },
            });
          }
        }
        console.log('Public permissions for Product API granted.');
      }
    } catch (err) {
      console.error('Failed to grant public permissions:', err);
    }

    // 2. Seed initial product if none exists
    try {
      const products = await strapi.documents('api::product.product').findMany();

      if (!products || products.length === 0) {
        console.log('Seeding initial product...');
        await strapi.documents('api::product.product').create({
          data: {
            productName: 'iPhone 15 Pro Max 256GB - Chính hãng VN/A',
            description: 'iPhone 15 Pro Max. Thiết kế titan cực nhẹ. Chip A17 Pro mạnh mẽ nhất.',
            basePrice: 30990000,
            slug: 'iphone-15-pro-max-256gb',
            status: 'published',
            variants: [
              { variantName: 'Titan Tự Nhiên', extraPrice: 0, stock: 50 },
              { variantName: 'Titan Xanh', extraPrice: 0, stock: 30 },
              { variantName: 'Titan Đen', extraPrice: 0, stock: 20 }
            ]
          }
        });
        console.log('Seed completed!');
      }
    } catch (err) {
      console.error('Failed to seed product:', err);
    }
  },
};
