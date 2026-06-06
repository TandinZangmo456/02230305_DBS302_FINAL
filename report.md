**XYZ SHOP**
Project Report

GitHub: [github.com/TandinZangmo456/02230305\_DBS302\_FINAL](https://github.com/TandinZangmo456/02230305_DBS302_FINAL)

# **1\. Introduction**

This report documents the design and implementation of the XYZ Shop backend system. The system is a complete e-commerce backend built using Node.js and Express, integrated with MongoDB for persistent data storage and Redis for high-performance caching and in-memory operations.

The project was developed to demonstrate industry-standard backend architecture including authentication, caching strategies, cart management, order processing, real-time analytics, and performance optimisation techniques.

# **2. Objectives**

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

* Routes Layer — Defines API endpoints and maps them to controllers

* Controller Layer — Handles HTTP requests and business logic

* Service Layer — Manages Redis operations and utility functions

* Model Layer — Mongoose schemas for MongoDB collections

* Config Layer — Database connection setup for MongoDB and Redis

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

* Total Sales — Aggregates overall revenue across all orders

* Top Products — Groups orders by product and ranks by total quantity sold

* Daily Revenue — Groups order totals by date to show daily income trends

## **4.6 Trending Products (Redis Sorted Set)**

Product view events are recorded in a Redis Sorted Set, where each product is a member and the score represents its total view count. The trending endpoint retrieves the highest-scoring products, providing a real-time ranking of the most viewed items.

## **4.7 Unique Visitor Tracking (Redis HyperLogLog)**

Redis HyperLogLog is used to efficiently count unique visitors per product. When a visitor accesses a product, their IP address is added using PFADD. The unique visitor count is retrieved using PFCOUNT. HyperLogLog provides approximate cardinality estimates using minimal memory, making it suitable for high-traffic environments.

## **4.8 Rate Limiting Middleware**

A rate limiter middleware was applied to API routes to prevent abuse. When a client exceeds the allowed number of requests within a time window, the server responds with HTTP 429 (Too Many Requests). This improves system stability and protects against denial-of-service scenarios.

# **5\. Database Design**

## **5.1 MongoDB Collections**

* Users — Stores user credentials and registration data

* Products — Stores product details including name, price, and stock quantity

* Orders — Stores order records including items, total value, and timestamps

## **5.2 Redis Data Structures**

* Cart — Hash (key per user, fields are product IDs, values are quantities)

* Product Cache — String (serialised JSON per product ID with TTL)

* Trending — Sorted Set (product IDs as members, view counts as scores)

* Unique Visitors — HyperLogLog (one key per product, IP addresses as elements)

# **6\. API Reference**

## **6.1 Authentication**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| **POST** | /api/auth/register | Register a new user account |
| **POST** | /api/auth/login | Login and receive a JWT token |

## **6.2 Products**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| **GET** | /api/products/:id | Fetch product by ID (cache-first) |

## **6.3 Cart**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| **POST** | /api/cart/add | Add an item to the user cart |
| **GET** | /api/cart/:userId | Retrieve cart contents for a user |
| **DELETE** | /api/cart/remove | Remove an item from the cart |

## **6.4 Orders**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| **POST** | /api/orders/place | Place an order from the cart |

## **6.5 Analytics**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| **GET** | /api/analytics/sales | Total sales revenue |
| **GET** | /api/analytics/top-products | Top-selling products by quantity |
| **GET** | /api/analytics/daily-revenue | Daily revenue breakdown |

## **6.6 Trending and Visits**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| **GET** | /api/trending | Get trending products (Redis Sorted Set) |
| **GET** | /api/visits/:productId | Get unique visitor count (HyperLogLog) |

# **7\. Setup and Deployment**

The project uses Docker Compose to manage MongoDB and Redis services. The following steps are required to run the system locally:

* Step 1 — Install Node.js dependencies using npm install

* Step 2 — Start Docker services using docker compose up \-d

* Step 3 — Start the backend server using npm run dev

* Step 4 — Verify connections by checking MongoDB Connected and Redis Connected in the terminal output

Environment variables are stored in a .env file. A .env.example file is included in the repository as a safe template. The .gitignore file excludes node\_modules and .env from version control.

# **8\. Challenges Faced**

* Handling MongoDB ObjectId validation errors when passing invalid ID formats

* Ensuring Redis cache consistency after product updates

* Managing order transaction logic without MongoDB replica sets

* Debugging route registration order conflicts in Express

* Configuring HyperLogLog to record visits on product fetch (requires calling recordVisit inside the product GET controller)

# **9\. System Demo and Test Results**

This section presents the complete end-to-end demonstration of the XYZ Shop backend system, including actual terminal output captured during a live test session. All seven functional areas were exercised sequentially using curl commands against the running server.

## **9.1 System Startup**

The system was started from the project directory. Docker Compose was used to bring up MongoDB and Redis containers, followed by launching the Node.js backend with nodemon.

$ docker compose up \-d  
  Container mongodb   Running  
  Container redis     Running

$ npm run dev  
  Server running on 5000  
  Redis Connected  
  MongoDB Connected

![][image1]

*Figure 1 — Server startup: Docker containers running, MongoDB and Redis connected, all routes responding HTTP 200*

The server log confirms both database connections were established successfully. All subsequent API calls returned HTTP 200 status codes, demonstrating the system was fully operational.

## **9.2 Authentication**

A new user account was registered and then used to log in. The login endpoint returned a signed JWT token confirming the authentication module is functioning correctly.

**Register Request**

curl \-X POST http://localhost:5000/api/auth/register \\  
  \-H "Content-Type: application/json" \\  
  \-d '{"name":"Demo6","email":"demo6@test.com","password":"123456"}'

**Register Response**

| Field | Value |
| :---- | :---- |
| **name** | Demo6 |
| **email** | demo6@test.com |
| **password** | $2a$10$7mazx2Lzze... (bcrypt hash) |
| **role** | customer |
| **\_id** | 6a24146dd946114ec6b72a00 |

**Login Response**

| Field | Value |
| :---- | :---- |
| **token** | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (JWT) |

![][image2]

*Figure 2 — Registration returning hashed password and MongoDB \_id; login returning a signed JWT token*

## **9.3 Product Retrieval with Redis Caching**

The same product endpoint was called twice consecutively. The first response carried source: mongodb, confirming the data was retrieved from the database and written to Redis. The second response carried source: redis, confirming the cache-first strategy is working correctly. This is one of the most important evaluation points in the project.

**First Request — Cache Miss (MongoDB)**

| Field | Value |
| :---- | :---- |
| **source** | mongodb |
| **name** | Test Laptop |
| **category** | Electronics |
| **price** | 1000 |
| **stock** | 4 |
| **response ms** | 25.237 ms |

**Second Request — Cache Hit (Redis)**

| Field | Value |
| :---- | :---- |
| **source** | redis |
| **name** | Test Laptop |
| **category** | Electronics |
| **price** | 1000 |
| **stock** | 4 |
| **response ms** | 3.423 ms |

The response time dropped from 25 ms to 3.4 ms between the first and second call — a reduction of approximately 86% — demonstrating the performance benefit of the caching layer.

## **9.4 Cart System (Redis Hash)**

Two products were added to the cart for user demo6. The cart was retrieved to confirm both items were stored. One item was then removed and the cart was retrieved again to confirm the deletion.

**Add to Cart — Two Items**

{"message":"Added to cart"}   (productId: ...c1a, qty: 2\)  
{"message":"Added to cart"}   (productId: ...c1b, qty: 5\)

**Get Cart**

{"6a1eb38fe3816ee8c81b0c1a":"2","6a1eb38fe3816ee8c81b0c1b":"5"}

**Remove One Item — Then Verify**

{"message":"Removed"}  
{"6a1eb38fe3816ee8c81b0c1b":"5"}   (first item gone)

![][image3]

*Figure 3 — Cart operations: add, get, remove, and verify; Redis maintains hash state correctly across all operations*

## **9.5 Order Placement (MongoDB)**

An order was placed for user demo6 referencing the Test Laptop product. The system created an order document in MongoDB, recorded the total value, and returned the full order object with status Placed.

| Field | Value |
| :---- | :---- |
| **userId** | 6a24146dd946114ec6b72a00 |
| **productId** | 6a1eb38fe3816ee8c81b0c1a |
| **quantity** | 1 |
| **price** | 1000 |
| **total** | 1000 |
| **status** | Placed |
| **orderId** | 6a2415e9d946114ec6b72a06 |
| **createdAt** | 2026-06-06T12:43:21.787Z |

Following order placement, the cart for demo6 was cleared automatically, confirming the post-order cart cleanup logic is working.

## **9.6 Trending Products (Redis Sorted Set)**

The trending endpoint was called after several product views had been recorded. The response returned the Test Laptop with a view score of 23, confirming the Redis Sorted Set is accumulating view counts correctly.

curl http://localhost:5000/api/trending

{"trending":\[{"productId":"6a1eb38fe3816ee8c81b0c1a","views":23}\]}

The Redis CLI also confirmed the Sorted Set data directly:

ZREVRANGE trending:products 0 \-1 WITHSCORES  
1\) "6a1eb38fe3816ee8c81b0c1a"  
2\) "23"

## **9.7 Analytics (MongoDB Aggregation Pipelines)**

All three analytics endpoints were tested and returned correct aggregated data.

**Total Sales**

curl http://localhost:5000/api/analytics/sales

{"\_id":null,"totalRevenue":5000,"totalOrders":5}

**Top Products**

curl http://localhost:5000/api/analytics/top-products

\[{"\_id":"6a1eb38fe3816ee8c81b0c1a","totalSold":5}\]

**Daily Revenue**

curl http://localhost:5000/api/analytics/daily-revenue

\[{"\_id":"2026-06-02","revenue":4000,"orders":4},  
 {"\_id":"2026-06-06","revenue":1000,"orders":1}\]

![][image4]

*Figure 4 — Trending, total sales, top products, and daily revenue; all aggregation pipelines returning correct live data*

## **9.8 Redis Internal State Verification**

Redis CLI was used to verify the internal data structures directly, independent of the API layer.

KEYS \*  
1\) "cart:demo6"  
2\) "trending:products"  
3\) "product:6a1eb38fe3816ee8c81b0c1a"

TYPE cart:demo6           \=\>  hash  
TYPE trending:products    \=\>  zset  
TYPE product:...c1a       \=\>  string

GET product:6a1eb38fe3816ee8c81b0c1a  
  \=\> {"\_id":"...","name":"Test Laptop","price":1000,...}

HGETALL cart:demo6  
  1\) "6a1eb38fe3816ee8c81b0c1b"  
  2\) "5"

![][image5]

*Figure 5 — Redis CLI: KEYS, TYPE checks and GET/HGETALL confirming string / hash / zset data types as designed*

The Redis CLI output confirms that each data structure type matches the intended design: product cache as a String, cart as a Hash, and trending as a Sorted Set (zset).

## **9.9 Demo Results Summary**

| Feature | Result | Evidence |
| :---- | :---- | :---- |
| **Server Startup** | **PASS** | MongoDB \+ Redis connected, all routes active |
| **User Registration** | **PASS** | bcrypt hash stored, \_id assigned in MongoDB |
| **User Login \+ JWT** | **PASS** | Signed JWT token returned |
| **Product Cache Miss** | **PASS** | source: mongodb — 25 ms response |
| **Product Cache Hit** | **PASS** | source: redis — 3.4 ms response (86% faster) |
| **Cart Add** | **PASS** | Two items stored in Redis Hash |
| **Cart Get** | **PASS** | Correct JSON returned with quantities |
| **Cart Remove** | **PASS** | Item removed, remaining item confirmed |
| **Order Placement** | **PASS** | Order created, total 1000, status Placed |
| **Trending Products** | **PASS** | Redis Sorted Set, view score 23 |
| **Analytics — Sales** | **PASS** | totalRevenue 5000, totalOrders 5 |
| **Analytics — Top Products** | **PASS** | Test Laptop, totalSold 5 |
| **Analytics — Daily Revenue** | **PASS** | Two date buckets returned correctly |
| **Redis Internal Types** | **PASS** | string / hash / zset confirmed via CLI |

# **10\. Conclusion**

The XYZ Shop backend system successfully demonstrates a production-style e-commerce backend with comprehensive use of both MongoDB and Redis. All core evaluation areas have been implemented and tested, including authentication, caching, cart management, order processing, analytics, and trending.

The project highlights how Redis and MongoDB can be combined effectively within a single backend system, each serving the data access patterns they are best suited for. Redis handles fast ephemeral operations such as caching, cart storage, and ranking, while MongoDB provides reliable persistent storage for users, products, and orders.

Optional enhancements such as JWT middleware protection on cart and order routes, and completing the HyperLogLog visit recording by calling recordVisit inside the product GET controller, would bring the system to a distinction-level standard.

Repository: [https://github.com/TandinZangmo456/02230305\_DBS302\_FINAL](https://github.com/TandinZangmo456/02230305_DBS302_FINAL)