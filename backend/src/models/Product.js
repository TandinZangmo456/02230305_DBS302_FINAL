const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  name:{
    type:String,
    required:true
  },

  description:String,

  category:{
    type:String,
    required:true
  },

  price:{
    type:Number,
    required:true
  },

  stock:{
    type:Number,
    default:0
  },

  tags:[String],

  attributes:{
    type:Object
  }

},{
  timestamps:true
});

productSchema.index({
  name:'text',
  description:'text',
  tags:'text'
});

module.exports = mongoose.model('Product', productSchema);
