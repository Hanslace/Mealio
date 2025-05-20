// seeders/20250521-seed-all.js
'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1) Users
    const users = [];
    for (let i = 0; i < 100; i++) {
      users.push({
        full_name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password_hash: faker.internet.password(),
        phone: faker.phone
          .number('03#########')
          .slice(0, 15),                    // ← cap at 15 chars
        role: faker.helpers.arrayElement(['customer','restaurant_owner','delivery_personnel','admin']),
        is_verified: faker.datatype.boolean(),
        is_deleted: false,
        last_seen: faker.date.recent({ days: 10 }),
        password_reset_token: null,
        password_reset_expires: null,
        password_reset_sent_at: null,
        verification_token: null,
        verification_token_expires: null,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    await queryInterface.bulkInsert('users', users);

    // 2) Addresses
    const addresses = [];
    for (let i = 0; i < 100; i++) {
      addresses.push({
        user_id: null,
        address_line1: faker.location.streetAddress(),
        address_line2: faker.location.secondaryAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
        zip_code: faker.location.zipCode().slice(0, 20),  // zip_code VARCHAR(20)
        latitude: parseFloat(faker.location.latitude()),
        longitude: parseFloat(faker.location.longitude()),
        created_at: new Date()
      });
    }
    await queryInterface.bulkInsert('addresses', addresses);

    // 3) Restaurants
    const cuisines = ['Italian','Chinese','Indian','Mexican','Thai','Japanese','French'];
    const statuses = ['open','closed','suspended'];
    const verifications = ['pending','approved','rejected'];
    const restaurants = [];
    for (let i = 0; i < 100; i++) {
      restaurants.push({
        owner_id: faker.number.int({ min: 1, max: 100 }),
        address_id: i + 1,
        restaurant_name: faker.company.name(),
        license_number: faker.string.uuid().slice(0, 8),
        contact_phone: faker.phone
          .number('03#########')
          .slice(0, 15),                    // ← cap at 15 chars
        cuisine_type: faker.helpers.arrayElement(cuisines),
        opening_time: `${faker.number.int({ min: 6, max: 11 })}:00:00`,
        closing_time: `${faker.number.int({ min: 18, max: 23 })}:00:00`,
        description: faker.lorem.sentence(),
        website_url: faker.internet.url(),
        social_links: JSON.stringify({
          facebook: faker.internet.url(),
          instagram: faker.internet.url(),
          twitter: faker.internet.url()
        }),
        logo_url: faker.image.urlPicsumPhotos({ width: 200, height: 200, category: 'food' }),
        cover_photo_url: faker.image.urlPicsumPhotos({ width: 800, height: 600, category: 'food' }),
        rating: faker.number.float({ min: 0, max: 5, precision: 0.1 }),
        status: faker.helpers.arrayElement(statuses),
        verification_status: faker.helpers.arrayElement(verifications),
        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    await queryInterface.bulkInsert('restaurants', restaurants);

    // 4) MenuItems
    const categories = ['Appetizer','Main Course','Dessert','Drink','Snack'];
    const menuItems = [];
    for (let i = 0; i < 100; i++) {
      menuItems.push({
        restaurant_id: faker.number.int({ min: 1, max: 100 }),
        item_name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 100, max: 1000, dec: 2 }),
        category: faker.helpers.arrayElement(categories),
        is_available: faker.datatype.boolean(),
        image_url: faker.image.urlPicsumPhotos({ width: 400, height: 300, category: 'food' }),
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    await queryInterface.bulkInsert('menu_items', menuItems);

    // 5) Coupons
    const coupons = [];
    for (let i = 0; i < 100; i++) {
      const isPct = faker.datatype.boolean();
      const validFrom = faker.date.past({ years: 1 });
      const validUntil = faker.date.soon({ days: 90, refDate: validFrom });
      const usageLimit = faker.number.int({ min: 1, max: 100 });
      const discountValue = isPct
        ? faker.number.int({ min: 5, max: 50 })
        : faker.number.int({ min: 50, max: 500 });

      coupons.push({
        restaurant_id: faker.number.int({ min: 1, max: 100 }),
        code: faker.string.alphanumeric({ length: 8 }).toUpperCase(),
        discount_type: isPct ? 'percentage' : 'fixed',
        discount_value: discountValue,
        valid_from: validFrom.toISOString().split('T')[0],
        valid_until: validUntil.toISOString().split('T')[0],
        usage_limit: usageLimit,
        times_used: faker.number.int({ min: 0, max: usageLimit }),
        created_at: new Date()
      });
    }
    await queryInterface.bulkInsert('coupons', coupons);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('coupons', null, {});
    await queryInterface.bulkDelete('menu_items', null, {});
    await queryInterface.bulkDelete('restaurants', null, {});
    await queryInterface.bulkDelete('addresses', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
