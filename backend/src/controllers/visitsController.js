const { getUniqueVisitors } = require('../services/visitsService');

exports.getVisits = async (req,res) => {

  const { productId } = req.params;

  const count = await getUniqueVisitors(productId);

  res.json({
    productId,
    uniqueVisitors: count
  });
};
