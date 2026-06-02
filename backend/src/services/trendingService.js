const redis = require('../config/redis');

exports.increaseView = async (productId)=>{

  await redis.zincrby(
    'trending:products',
    1,
    productId
  );
};

exports.getTrending = async ()=>{

  return await redis.zrevrange(
    'trending:products',
    0,
    9,
    'WITHSCORES'
  );
};
