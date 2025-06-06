# Express.js RESTful API Assignment - Products API

This assignment focuses on building a RESTful API using Express.js, implementing proper routing, middleware, and error handling for a product resource.

## Assignment Overview

You will:

*   Set up an Express.js server
*   Create RESTful API routes for a product resource
*   Implement custom middleware for logging, authentication, and validation
*   Add comprehensive error handling
*   Develop advanced features like filtering, pagination, search, and statistics.

## Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm (comes with Node.js)
*   A tool for API testing like Postman, Insomnia, or curl.

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of the project by copying `.env.example`:
    ```bash
    cp .env.example .env
    ```
    Edit the `.env` file and set your desired `PORT` and a unique `API_KEY`:
    ```
    PORT=3000
    API_KEY=your-very-secret-api-key
    ```

4.  **Run the server:**
    *   For development (with auto-reload):
        ```bash
        npm run dev
        ```
    *   For production:
        ```bash
        npm start
        ```
    The server will start on `http://localhost:3000` (or the port specified in your `.env`).

## API Endpoints

All product-related endpoints are prefixed with `/api/products`.
An `x-api-key` header with the correct API Key (from your `.env` file) is required for all product endpoints.

---

### **Authentication**

*   **Header:** `x-api-key: <your-api-key>`
*   Required for all `/api/products` endpoints.

---

### 1. List All Products

*   **Endpoint:** `GET /api/products`
*   **Description:** Retrieves a list of all products. Supports filtering by category, searching by name, and pagination.
*   **Query Parameters:**
    *   `category` (string, optional): Filter products by category (e.g., `electronics`).
    *   `search` (string, optional): Filter products by name (case-insensitive partial match).
    *   `page` (number, optional, default: 1): Page number for pagination.
    *   `limit` (number, optional, default: 10): Number of items per page.
*   **Success Response (200 OK):**
    ```json
    {
      "totalItems": 5,
      "totalPages": 1,
      "currentPage": 1,
      "data": [
        {
          "id": "1",
          "name": "Laptop",
          "description": "High-performance laptop",
          "price": 1200,
          "category": "electronics",
          "inStock": true
        }
        // ... other products
      ]
    }
    ```
*   **Example Request (curl):**
    ```bash
    curl -H "x-api-key: your-very-secret-api-key" "http://localhost:3000/api/products?category=electronics&page=1&limit=5"
    ```

---

### 2. Get Specific Product by ID

*   **Endpoint:** `GET /api/products/:id`
*   **Description:** Retrieves a single product by its unique ID.
*   **Success Response (200 OK):**
    ```json
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    }
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
      "status": "fail",
      "message": "Product not found"
    }
    ```
*   **Example Request (curl):**
    ```bash
    curl -H "x-api-key: your-very-secret-api-key" http://localhost:3000/api/products/1
    ```

---

### 3. Create a New Product

*   **Endpoint:** `POST /api/products`
*   **Description:** Creates a new product.
*   **Request Body (JSON):**
    ```json
    {
      "name": "New Gadget",
      "description": "The latest and greatest gadget.",
      "price": 99.99,
      "category": "gadgets",
      "inStock": true
    }
    ```
    *   `name` (string, required)
    *   `price` (number, required, positive)
    *   `category` (string, required)
    *   `description` (string, optional)
    *   `inStock` (boolean, optional, default: true)
*   **Success Response (201 Created):**
    ```json
    {
      "id": "generated-uuid",
      "name": "New Gadget",
      "description": "The latest and greatest gadget.",
      "price": 99.99,
      "category": "gadgets",
      "inStock": true
    }
    ```
*   **Error Response (400 Bad Request - Validation Error):**
    ```json
    {
      "status": "fail",
      "message": "Validation failed",
      "errors": [
        { "field": "name", "message": "Name is required" }
      ]
    }
    ```
*   **Example Request (curl):**
    ```bash
    curl -X POST \
      -H "Content-Type: application/json" \
      -H "x-api-key: your-very-secret-api-key" \
      -d '{ "name": "Wireless Mouse", "price": 25.99, "category": "electronics", "description": "Ergonomic wireless mouse" }' \
      http://localhost:3000/api/products
    ```

---

### 4. Update an Existing Product

*   **Endpoint:** `PUT /api/products/:id`
*   **Description:** Updates an existing product by its ID. Only provided fields are updated.
*   **Request Body (JSON):** (Provide only fields to update)
    ```json
    {
      "price": 109.99,
      "inStock": false
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "id": "existing-id",
      "name": "Updated Gadget Name",
      "description": "Updated description.",
      "price": 109.99,
      "category": "gadgets",
      "inStock": false
    }
    ```
*   **Error Response (404 Not Found):** If product ID doesn't exist.
*   **Example Request (curl):**
    ```bash
    curl -X PUT \
      -H "Content-Type: application/json" \
      -H "x-api-key: your-very-secret-api-key" \
      -d '{ "price": 1299.00 }' \
      http://localhost:3000/api/products/1
    ```

---

### 5. Delete a Product

*   **Endpoint:** `DELETE /api/products/:id`
*   **Description:** Deletes a product by its ID.
*   **Success Response (204 No Content):** (No body content)
*   **Error Response (404 Not Found):** If product ID doesn't exist.
*   **Example Request (curl):**
    ```bash
    curl -X DELETE \
      -H "x-api-key: your-very-secret-api-key" \
      http://localhost:3000/api/products/1
    ```

---

### 6. Search Products by Name (Dedicated Endpoint)

*   **Endpoint:** `GET /api/products/search`
*   **Description:** Allows searching for products by name.
*   **Query Parameters:**
    *   `name` (string, required): The search term for product names (case-insensitive partial match).
*   **Success Response (200 OK):**
    ```json
    [
      {
        "id": "some-id",
        "name": "Awesome Laptop Pro",
        "description": "A pro laptop.",
        "price": 1500,
        "category": "electronics",
        "inStock": true
      }
      // ... other matching products
    ]
    ```
*   **Error Response (400 Bad Request):** If `name` query parameter is missing.
*   **Example Request (curl):**
    ```bash
    curl -H "x-api-key: your-very-secret-api-key" "http://localhost:3000/api/products/search?name=Lap"
    ```
    *(Note: The main `GET /api/products` endpoint also supports a `search` query parameter for name searching.)*

---

### 7. Get Product Statistics

*   **Endpoint:** `GET /api/products/stats`
*   **Description:** Retrieves statistics about the products.
*   **Success Response (200 OK):**
    ```json
    {
      "totalProducts": 5,
      "categories": {
        "electronics": 3,
        "books": 1,
        "kitchen": 1
      },
      "inStockCount": 4,
      "outOfStockCount": 1
    }
    ```
*   **Example Request (curl):**
    ```bash
    curl -H "x-api-key: your-very-secret-api-key" http://localhost:3000/api/products/stats
    ```

---

## Error Responses

The API uses standard HTTP status codes for errors.

*   **400 Bad Request:** Malformed request, validation errors.
    ```json
    {
      "status": "fail",
      "message": "Validation failed",
      "errors": [{ "field": "name", "message": "Name is required" }]
    }
    ```
*   **401 Unauthorized:** API key missing.
    ```json
    {
        "status": "fail",
        "message": "API Key missing"
    }
    ```
*   **403 Forbidden:** Invalid API key.
    ```json
    {
        "status": "fail",
        "message": "Invalid API Key"
    }
    ```
*   **404 Not Found:** Resource or endpoint not found.
    ```json
    {
      "status": "fail",
      "message": "Product not found"
    }
    ```
*   **500 Internal Server Error:** Unexpected server error.
    ```json
    {
      "status": "error",
      "message": "Something went very wrong!"
    }
    ```