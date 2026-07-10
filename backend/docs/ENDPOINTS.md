# API Endpoints

Health
- `GET /health` - Service health

Auth
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

Products
- `GET /api/v1/products` - List products
- `GET /api/v1/products/:id` - Product details
- `POST /api/v1/products` - Create (admin)

Cart
- `GET /api/v1/cart` - Get user cart (auth)
- `POST /api/v1/cart` - Add item

Account
- `GET /api/v1/account` - User account details (auth)

Shop
- `GET /api/v1/shop/products` - Shop product listing

Admin
- `GET /api/v1/admin/...` - Admin routes (guarded)

Notes: See route files under `server/routes/` for complete parameter and payload details.
