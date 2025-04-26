const db = require('../models');
const MenuItemLike = db.MenuItemLike;

/**
 * Like a menu item
 */
exports.likeItem = async (req, res) => {
  try {
    const { item_id } = req.body;
    const user_id = req.user.user_id;

    const [like, created] = await MenuItemLike.findOrCreate({
      where: { user_id, item_id }
    });

    return res.status(201).json({ message: created ? 'Liked' : 'Already liked', like });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error liking item' });
  }
};

/**
 * Unlike a menu item
 */
exports.unlikeItem = async (req, res) => {
  try {
    const { item_id } = req.params;
    const user_id = req.user.user_id;

    const deleted = await MenuItemLike.destroy({
      where: { user_id, item_id }
    });

    return res.json({ message: deleted ? 'Unliked' : 'Not previously liked' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error unliking item' });
  }
};

/**
 * Get liked items for logged-in user
 */
exports.getMyLikedItems = async (req, res) => {
  try {
    const likes = await MenuItemLike.findAll({
      where: { user_id: req.user.user_id },
      include: ['MenuItem']
    });

    return res.json(likes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error fetching liked items' });
  }
};

/**
 * Count likes for a menu item (public/stat view)
 */
exports.getItemLikeCount = async (req, res) => {
  try {
    const { item_id } = req.params;
    const count = await MenuItemLike.count({ where: { item_id } });
    return res.json({ item_id, like_count: count });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error getting like count' });
  }
};
