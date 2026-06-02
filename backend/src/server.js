require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectMongo = require('./config/mongo');

const app = express();

// connect DBs
connectMongo();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api/products',
require('./routes/productRoutes'));

app.use('/api/auth',
require('./routes/authRoutes'));

app.use('/api/cart',
require('./routes/cartRoutes'));

app.use('/api/analytics',
require('./routes/analyticsRoutes'));

app.use('/api/visits',
require('./routes/visitsRoutes'));

app.use('/api/orders',
require('./routes/orderRoutes'));

// 🆕 STEP 5: Trending route (Redis Sorted Set)
app.use('/api/trending',
require('./routes/trendingRoutes'));

app.get('/', (req,res)=>{
  res.send('XYZ Shop API Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log(`Server running on ${PORT}`);
});
