const { getTrending } = require('../services/trendingService');

exports.getTrendingProducts = async (req,res)=>{

  const data = await getTrending();

  // convert flat array -> structured response
  const formatted = [];

  for(let i = 0; i < data.length; i += 2){
    formatted.push({
      productId: data[i],
      views: parseInt(data[i+1])
    });
  }

  res.json({
    trending: formatted
  });
};
