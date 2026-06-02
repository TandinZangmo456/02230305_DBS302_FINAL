const Product = require('../models/Product');
const redis = require('../config/redis');
const { recordVisit } = require('../services/visitsService');

// ADD THIS (Step 2 trending service)
const { increaseView } = require('../services/trendingService');

exports.getProduct = async (req,res) => {

  const id = req.params.id;

  const cacheKey = `product:${id}`;

  const cached = await redis.get(cacheKey);

  if(cached){
    
    // 🔥 still track trending even on cache hit
    increaseView(id);

    return res.json({
      source:'redis',
      product:JSON.parse(cached)
    });
  }

  const product = await Product.findById(id);

  if(!product){
    return res.status(404).json({
      message:'Not found'
    });
  }

  // 🔥 track trending (MongoDB hit)
  await increaseView(id);

  await redis.set(
    cacheKey,
    JSON.stringify(product),
    'EX',
    3600
  );

  res.json({
    source:'mongodb',
    product
  });
};
