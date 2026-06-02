const redis = require('../config/redis');

exports.addToCart = async (req,res)=>{

  const {userId,productId,quantity} = req.body;

  const key = `cart:${userId}`;

  await redis.hset(key, productId, quantity);

  await redis.expire(key, 86400);

  res.json({ message:'Added to cart' });
};

exports.getCart = async (req,res)=>{

  const userId = req.params.userId;

  const cart = await redis.hgetall(`cart:${userId}`);

  res.json(cart);
};

exports.removeItem = async (req,res)=>{

  const {userId,productId} = req.body;

  await redis.hdel(`cart:${userId}`, productId);

  res.json({ message:'Removed' });
};
