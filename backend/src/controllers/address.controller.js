// src/controllers/address.controller.js
const db = require('../models');
const Address = db.Address;

module.exports.createAddress = async (req, res) => {
  try {
    const { address_line1, address_line2, city, state, country, zip_code, latitude, longitude, is_default } = req.body;
    const newAddress = await Address.create({
      user_id: req.user.user_id,
      address_line1,
      address_line2,
      city,
      state,
      country,
      zip_code,
      latitude,
      longitude,
      is_default: is_default || false
    });
    return res.status(201).json(newAddress);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error creating address' });
  }
};

module.exports.getMyAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll({
      where: { user_id: req.user.user_id }
    });
    return res.json(addresses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching addresses' });
  }
};

module.exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const address = await Address.findByPk(addressId);

    if (!address || address.user_id !== req.user.user_id) {
      return res.status(404).json({ error: 'Address not found or not yours' });
    }

    address.address_line1 = req.body.address_line1 ?? address.address_line1;
    address.address_line2 = req.body.address_line2 ?? address.address_line2;
    address.city = req.body.city ?? address.city;
    address.state = req.body.state ?? address.state;
    address.country = req.body.country ?? address.country;
    address.zip_code = req.body.zip_code ?? address.zip_code;
    address.latitude = req.body.latitude ?? address.latitude;
    address.longitude = req.body.longitude ?? address.longitude;
    address.is_default = req.body.is_default ?? address.is_default;

    await address.save();
    return res.json({ message: 'Address updated successfully', address });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error updating address' });
  }
};

module.exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const address = await Address.findByPk(addressId);

    if (!address || address.user_id !== req.user.user_id) {
      return res.status(404).json({ error: 'Address not found or not yours' });
    }

    await address.destroy();
    return res.json({ message: 'Address deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error deleting address' });
  }
};
