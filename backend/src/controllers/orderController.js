const Order = require('../models/Order');
const Product = require('../models/Product');
const redis = require('../config/redis');

exports.placeOrder = async (req,res)=>{

  try {

    const {userId,items} = req.body;

    let total = 0;

    for(let item of items){

      const product = await Product.findById(item.productId);

      if(!product){
        throw new Error('Product not found');
      }

      if(product.stock < item.quantity){
        throw new Error('Out of stock');
      }

      product.stock -= item.quantity;
      await product.save();

      total += product.price * item.quantity;
    }

    const order = await Order.create({
      userId,
      items,
      total
    });

    await redis.del(`cart:${userId}`);

    res.json({
      message:"Order placed",
      order
    });

  } catch(err){
    res.status(500).json({
      message:err.message
    });
  }
};
