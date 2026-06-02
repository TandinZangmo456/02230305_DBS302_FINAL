const Order = require('../models/Order');
const mongoose = require('mongoose');

// 1. Total sales
exports.totalSales = async (req,res)=>{

  const result = await Order.aggregate([
    {
      $group:{
        _id:null,
        totalRevenue:{ $sum:"$total" },
        totalOrders:{ $sum:1 }
      }
    }
  ]);

  res.json(result[0] || {
    totalRevenue:0,
    totalOrders:0
  });
};

// 2. Top selling products
exports.topProducts = async (req,res)=>{

  const result = await Order.aggregate([
    { $unwind:"$items" },
    {
      $group:{
        _id:"$items.productId",
        totalSold:{ $sum:"$items.quantity" }
      }
    },
    { $sort:{ totalSold:-1 } },
    { $limit:10 }
  ]);

  res.json(result);
};

// 3. Daily revenue report
exports.dailyRevenue = async (req,res)=>{

  const result = await Order.aggregate([
    {
      $group:{
        _id:{
          $dateToString:{
            format:"%Y-%m-%d",
            date:"$createdAt"
          }
        },
        revenue:{ $sum:"$total" },
        orders:{ $sum:1 }
      }
    },
    { $sort:{ _id:1 } }
  ]);

  res.json(result);
};
