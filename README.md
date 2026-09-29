# Express.js REST API Server

A lightweight, clean Express.js API server configured with security, logging, error handling, and test routes.

---

## 🚀 Routes

The project provides two primary endpoints:

| Route | Method | Description |
| :--- | :--- | :--- |
| `/v1/record` | `GET`, `POST` | Test endpoint for recording / sending test records |
| `/v1/response` | `GET`, `POST` | Test endpoint for responses / verifying API response delivery |

*(Note: `/api/v1/record` and `/api/v1/response` are also mapped for convenience)*

---

## 📁 Project Structure

```text
├── .env                  # Local environment configuration
├── .env.example          # Sample environment configuration template
├── .gitignore            # Git ignore file
├── package.json          # Node.js project manifest & scripts
├── README.md             # Documentation
└── src/
    ├── app.js            # Express application setup & middleware stack
    ├── server.js         # HTTP server entrypoint & graceful shutdown
    ├── config/
    │   └── env.js        # Environment configuration loader
    ├── middlewares/
    │   ├── errorHandler.js   # Centralized JSON error handler
    │   ├── notFoundHandler.js# 404 handler for undefined routes
    │   ├── rateLimiter.js    # Rate limiting middleware
    │   └── requestLogger.js  # Morgan request logger
    ├── routes/
    │   ├── index.js          # Central router mounting test routes
    │   ├── record.routes.js   # /v1/record routes (GET, POST)
    │   └── response.routes.js # /v1/response routes (GET, POST)
    └── utils/
        ├── apiError.js       # Standardized operational error class
        ├── apiResponse.js    # Standardized JSON response formatter
        └── asyncHandler.js   # Wrapper for async controller methods
```

---

## ⚙️ Prerequisites

- **Node.js**: v18.0.0 or later
- **npm**: v9.0.0 or later

---

## 📦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server** (with live reload via nodemon):
   ```bash
   npm run dev
   ```

3. **Start in Production Mode**:
   ```bash
   npm start
   ```

Default port is `5000` (can be configured via `.env`).

---

## 🧪 Testing the Endpoints

### 1. Root / Service Info
```bash
curl -X GET http://localhost:5000/
```

### 2. Record Endpoint (`/v1/record`)
- **GET**:
  ```bash
  curl -X GET http://localhost:5000/v1/record
  ```
- **POST**:
  ```bash
  curl -X POST http://localhost:5000/v1/record \
    -H "Content-Type: application/json" \
    -d '{"event": "user_action", "payload": {"id": 123}}'
  ```

### 3. Response Endpoint (`/v1/response`)
- **GET**:
  ```bash
  curl -X GET http://localhost:5000/v1/response
  ```
- **POST**:
  ```bash
  curl -X POST http://localhost:5000/v1/response \
    -H "Content-Type: application/json" \
    -d '{"query": "test query", "status": "ok"}'
  ```
