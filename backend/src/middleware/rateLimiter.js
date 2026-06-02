const redis = require('../config/redis');

const rateLimiter = (limit, windowInSeconds) => {

  return async (req,res,next) => {

    try {

      const key = `rate:${req.ip}`;

      const current = await redis.incr(key);

      if(current === 1){
        await redis.expire(key, windowInSeconds);
      }

      if(current > limit){
        return res.status(429).json({
          message: 'Too many requests. Try again later.'
        });
      }

      next();

    } catch(err){
      console.error(err);
      next();
    }
  };
};

module.exports = rateLimiter;
