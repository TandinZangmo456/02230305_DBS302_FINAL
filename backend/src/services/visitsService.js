const redis = require('../config/redis');

// record a unique visit
exports.recordVisit = async (productId, userId) => {
  await redis.pfadd(`product:visits:${productId}`, userId);
};

// get unique visitors count
exports.getUniqueVisitors = async (productId) => {
  return await redis.pfcount(`product:visits:${productId}`);
};
