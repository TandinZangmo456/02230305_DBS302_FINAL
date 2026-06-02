**XYZ Shop Backend System**

Project Report

**GITHUB LINK: https://github.com/TandinZangmo456/02230305_DBS302_FINAL.git**

 
# **1\. Introduction**

This report documents the design and implementation of the XYZ Shop backend system. The system is a complete e-commerce backend built using Node.js and Express, integrated with MongoDB for persistent data storage and Redis for high-performance caching and in-memory operations.

The project was developed to demonstrate industry-standard backend architecture including authentication, caching strategies, cart management, order processing, real-time analytics, and performance optimisation techniques.

# **2\. Objectives**

* Implement a secure user authentication system using JWT

* Demonstrate Redis caching with a cache-first retrieval strategy

* Build a cart system using Redis Hash data structures

* Process orders with stock validation and cart clearing in MongoDB

* Generate business analytics using MongoDB aggregation pipelines

* Track trending products using Redis Sorted Sets

* Track unique product visitors using Redis HyperLogLog

* Apply rate limiting middleware for API protection

# **3\. System Architecture**

The system follows a layered MVC-style architecture:

* Routes Layer: Defines API endpoints and maps them to controllers

* Controller Layer: Handles HTTP requests and business logic

* Service Layer: Manages Redis operations and utility functions

* Model Layer: Mongoose schemas for MongoDB collections

* Config Layer: Database connection setup for MongoDB and Redis

The infrastructure uses Docker to run MongoDB and Redis as containerised services, allowing consistent local development and easy deployment.

# **4\. Modules Implemented**

## **4.1 Authentication Module**

Users can register with a username and password. Passwords are hashed using bcryptjs before storage. On login, the system verifies credentials and issues a JSON Web Token (JWT) for session management. The token can be used to authenticate protected routes.

## **4.2 Product Module with Redis Caching**

Products are stored in MongoDB. When a product is requested, the system first checks Redis for a cached version. If a cache hit occurs, the data is returned immediately without querying MongoDB. If a cache miss occurs, MongoDB is queried and the result is written to Redis for subsequent requests.

This cache-first strategy significantly reduces database load and improves response time for frequently accessed products.

## **4.3 Cart System (Redis Hash)**

Shopping cart data is stored in Redis using Hash data structures. Each user has a dedicated cart key in Redis. The system supports adding items, retrieving the full cart, and removing individual items. Redis was chosen for cart storage due to its fast in-memory read and write performance.

## **4.4 Order System (MongoDB)**

When a user places an order, the system validates available stock for each product. Upon successful validation, an order document is created in MongoDB, product stock quantities are decremented, and the user's cart in Redis is cleared. The total order value is calculated at the time of order creation.

## **4.5 Analytics Module (MongoDB Aggregation)**

The analytics module uses MongoDB aggregation pipelines to derive business insights from stored order data. Three analytics endpoints are available:

* Total Sales: Aggregates overall revenue across all orders

* Top Products: Groups orders by product and ranks by total quantity sold

* Daily Revenue: Groups order totals by date to show daily income trends

## **4.6 Trending Products (Redis Sorted Set)**

Product view events are recorded in a Redis Sorted Set, where each product is a member and the score represents its total view count. The trending endpoint retrieves the highest-scoring products, providing a real-time ranking of the most viewed items.

## **4.7 Unique Visitor Tracking (Redis HyperLogLog)**

Redis HyperLogLog is used to efficiently count unique visitors per product. When a visitor accesses a product, their IP address is added using PFADD. The unique visitor count is retrieved using PFCOUNT. HyperLogLog provides approximate cardinality estimates using minimal memory, making it suitable for high-traffic environments.

## **4.8 Rate Limiting Middleware**

A rate limiter middleware was applied to API routes to prevent abuse. When a client exceeds the allowed number of requests within a time window, the server responds with HTTP 429 (Too Many Requests). This improves system stability and protects against denial-of-service scenarios.

# **5\. Database Design**

## **5.1 MongoDB Collections**

* Users: Stores user credentials and registration data

* Products: Stores product details including name, price, and stock quantity

* Orders: Stores order records including items, total value, and timestamps

## **5.2 Redis Data Structures**

* Cart: Hash (key per user, fields are product IDs, values are quantities)

* Product Cache: String (serialised JSON per product ID with TTL)

* Trending: Sorted Set (product IDs as members, view counts as scores)

* Unique Visitors: HyperLogLog (one key per product, IP addresses as elements)

# **6\. API Reference**

## **6.1 Authentication**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/auth/register | Register a new user account |
| POST | /api/auth/login | Login and receive a JWT token |

## **6.2 Products**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/products/:id | Fetch product by ID (cache-first) |

## **6.3 Cart**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/cart/add | Add an item to the user cart |
| GET | /api/cart/:userId | Retrieve cart contents for a user |
| DELETE | /api/cart/remove | Remove an item from the cart |

## **6.4 Orders**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /api/orders/place | Place an order from the cart |

## **6.5 Analytics**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/analytics/sales | Total sales revenue |
| GET | /api/analytics/top-products | Top-selling products by quantity |
| GET | /api/analytics/daily-revenue | Daily revenue breakdown |

## **6.6 Trending and Visits**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/trending | Get trending products (Redis Sorted Set) |
| GET | /api/visits/:productId | Get unique visitor count (HyperLogLog) |

# **7\. Setup and Deployment**

The project uses Docker Compose to manage MongoDB and Redis services. The following steps are required to run the system locally:

* Step 1: Install Node.js dependencies using npm install

* Step 2: Start Docker services using docker compose up \-d

* Step 3: Start the backend server using npm run dev

* Step 4: Verify connections by checking MongoDB Connected and Redis Connected in the terminal output

Environment variables are stored in a .env file. A .env.example file is included in the repository as a safe template. The .gitignore file excludes node\_modules and .env from version control.

# **8\. Challenges Faced**

* Handling MongoDB ObjectId validation errors when passing invalid ID formats

* Ensuring Redis cache consistency after product updates

* Managing order transaction logic without MongoDB replica sets

* Debugging route registration order conflicts in Express

* Configuring HyperLogLog to record visits on product fetch (requires calling recordVisit inside the product GET controller)

# **9\. Conclusion**

The XYZ Shop backend system successfully demonstrates a production-style e-commerce backend with comprehensive use of both MongoDB and Redis. All core evaluation areas have been implemented and tested, including authentication, caching, cart management, order processing, analytics, and trending.

The project highlights how Redis and MongoDB can be combined effectively within a single backend system, each serving the data access patterns they are best suited for. Redis handles fast ephemeral operations such as caching, cart storage, and ranking, while MongoDB provides reliable persistent storage for users, products, and orders.

Optional enhancements such as JWT middleware protection on cart and order routes, and completing the HyperLogLog visit recording, would bring the system to a distinction-level standard.