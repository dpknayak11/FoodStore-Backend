# Food Delivery Backend Project

## Project Overview
This is a Node.js backend for a food delivery application. It provides RESTful APIs for user authentication, menu management, address handling, and order processing. The backend is built using Express.js, MongoDB (via Mongoose), and includes middleware for authentication, validation, and error handling.

---

## Folder Structure

```
├── Api.http                  # HTTP request samples for API testing
├── api.txt                   # API notes or documentation
├── app.js                    # Main application entry point
├── package.json              # Project dependencies and scripts
├── temp.js                   # Temporary or test scripts
├── vercel.json               # Vercel deployment configuration
├── config/
│   ├── db.js                 # Database connection logic
│   ├── menuData.json         # Sample menu data
│   └── scriptMenuFile.js     # Script for menu data
├── controllers/
│   ├── address.controller.js # Address-related logic
│   ├── menu.controller.js    # Menu-related logic
│   ├── order.controller.js   # Order-related logic
│   ├── order.controller copy.js # (Backup/old order controller)
│   ├── profile.controller.js # User profile logic
│   └── user.controller.js    # User authentication/logic
├── middleware/
│   ├── auth.middleware.js    # JWT authentication middleware
│   ├── error.middleware.js   # Error handling middleware
│   ├── joiValidator/
│   │   └── middleware.js     # Joi validation middleware
│   └── validations/
│       └── validation.js     # Joi validation schemas
├── models/
│   ├── address.model.js      # Address schema/model
│   ├── menu.model.js         # Menu schema/model
│   ├── order.model.js        # Order schema/model
│   ├── order.model copy.js   # (Backup/old order model)
│   └── user.model.js         # User schema/model
├── routes/
│   ├── address.routes.js     # Address API routes
│   ├── menu.routes.js        # Menu API routes
│   ├── order.routes.js       # Order API routes
│   └── user.routes.js        # User API routes
├── services/
│   ├── address.service.js    # Address business logic
│   ├── menu.service.js       # Menu business logic
│   ├── order.service.js      # Order business logic
│   └── user.service.js       # User business logic
└── utils/
    ├── addTimeStamp.js       # Utility for timestamps
    ├── constants.js          # Constant values
    ├── constantsMessage.js   # Constant messages
    └── globalFunction.js     # Global utility functions
```

---

## Project Flow

1. **Server Initialization**
   - `app.js` loads environment variables, sets up Express, connects to MongoDB, and configures middleware (CORS, body parsers).
   - API routes are mounted under a versioned endpoint (e.g., `/api/v1`).
   - The server listens on the specified port.

2. **Authentication**
   - User registration and login handled via `user.routes.js` and `user.controller.js`.
   - JWT-based authentication is enforced using `auth.middleware.js`.

3. **Menu Management**
   - Menu items are managed via `menu.routes.js`, `menu.controller.js`, and `menu.service.js`.
   - Menu data is stored in MongoDB and can be seeded from `menuData.json`.

4. **Address Handling**
   - Users can add, update, and delete addresses using `address.routes.js` and related files.

5. **Order Processing**
   - Orders are created, updated, and tracked via `order.routes.js`, `order.controller.js`, and `order.service.js`.
   - Order status can be updated automatically (e.g., via a cron job in `app.js`).

6. **Validation & Error Handling**
   - All incoming requests are validated using Joi schemas.
   - Errors are handled centrally by `error.middleware.js`.

7. **Utilities**
   - Common functions, constants, and timestamp utilities are in the `utils/` folder.

---

## Key Features
- User authentication (JWT)
- Menu CRUD operations
- Address management
- Order placement and status tracking
- Centralized error handling
- Request validation
- Modular and scalable folder structure

---

## How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up a `.env` file with required environment variables (e.g., `PORT`, `API_END_POINT_V1`, `MONGODB_URI`).
3. Start the server:
   ```bash
   nodemon
   ```

---

## Deployment
- Can be deployed on Vercel (see `vercel.json`).

---

## Author
- dpknayak11
