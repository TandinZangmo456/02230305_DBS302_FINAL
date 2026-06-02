# XYZ Shop Backend System

## Project Overview

XYZ Shop is a complete backend system for an e-commerce platform built with Node.js, Express, MongoDB, and Redis. The project demonstrates real-world backend engineering practices including JWT authentication, Redis-based caching and cart management, MongoDB aggregation analytics, trending product tracking using Redis Sorted Sets, and unique visitor tracking using HyperLogLog.


## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- Redis
- JWT (jsonwebtoken)
- bcryptjs
- Docker (for MongoDB and Redis services)


## Project Structure

```
xyz-shop-backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
├── docker-compose.yml
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

## Features

### Authentication
- User registration with password hashing via bcrypt
- User login with JWT token generation
- Token-based access for protected routes

### Product System
- Products stored in MongoDB
- Redis caching with cache-first strategy
- First request fetches from MongoDB and caches in Redis
- Subsequent requests served directly from Redis cache

### Cart System (Redis Hash)
- Add items to cart per user
- Retrieve cart contents
- Remove individual items from cart
- Cart data stored in Redis for fast read/write operations

### Order System (MongoDB)
- Place orders with stock validation
- Stock quantity reduction on order placement
- Cart clearing after successful order
- Total order value calculation

### Analytics (MongoDB Aggregation Pipeline)
- Total sales revenue
- Top-selling products
- Daily revenue breakdown

### Trending Products (Redis Sorted Set)
- Track product view counts
- Retrieve ranked trending products list

### Unique Visitor Tracking (Redis HyperLogLog)
- Track unique visitors per product using PFADD
- Retrieve unique visitor count using PFCOUNT

### Performance and Security
- Redis caching layer reduces MongoDB load
- Rate limiting middleware to prevent abuse
- Environment variables for secrets management


## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd xyz-shop-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### 4. Start MongoDB and Redis using Docker

```bash
docker compose up -d
```

### 5. Start the backend server

```bash
npm run dev
```

You should see:

```
MongoDB Connected
Redis Connected
Server running on port 5000
```


## Environment Variables

Create a `.env` file based on `.env.example`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/xyzshop
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key_here
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and receive JWT token |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products/:id | Fetch product (Redis cache or MongoDB) |

### Cart

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/cart/add | Add item to cart |
| GET | /api/cart/:userId | Get cart for user |
| DELETE | /api/cart/remove | Remove item from cart |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/orders/place | Place an order |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/analytics/sales | Total sales revenue |
| GET | /api/analytics/top-products | Top-selling products |
| GET | /api/analytics/daily-revenue | Daily revenue report |

### Trending

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/trending | Get trending products (Redis Sorted Set) |

### Visits

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/visits/:productId | Get unique visitor count (HyperLogLog) |


## Ignoring node_modules

This project includes a `.gitignore` file. Never commit `node_modules` or `.env`.

`.gitignore` contents:

```
node_modules/
.env
npm-debug.log
.DS_Store
dist/
coverage/
```

To create a clean zip for submission without node_modules:

```bash
zip -r xyz-shop-backend.zip . -x "node_modules/*"
```


## Key Concepts Demonstrated

- REST API design with Express.js
- JWT-based stateless authentication
- Redis caching strategies (cache-first, write-through)
- Redis data structures: Hash (cart), Sorted Set (trending), HyperLogLog (visitors)
- MongoDB aggregation pipelines for analytics
- Dockerized infrastructure for local development
- Middleware for rate limiting and authentication


## Notes

- Redis is used for caching, cart storage, trending, and visitor tracking
- MongoDB is used for persistent storage of users, products, and orders
- Docker manages both database services locally
- The `.env` file must never be committed to version control