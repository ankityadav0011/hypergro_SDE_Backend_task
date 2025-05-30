# HyperGro Real Estate API

**To import properties from a CSV file into MongoDB, run:**
```sh
npx ts-node src/import.ts
```
This command will transfer 1000+ properties data from the CSV file to MongoDB using the importCSV utility.

**To start the development server, run:**
```sh
npm run dev
```

Deployed live link - https://hypergro-sde-backend-task.onrender.com/

A Node.js/Express REST API for property listings, user authentication, favorites, recommendations, and more.  
Built with TypeScript, MongoDB (Mongoose), Bcrypt, JWT authentication, and Redis caching.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Auth](#auth)
  - [Properties](#properties)
  - [Favorites](#favorites)
  - [Recommendations](#recommendations)
- [Caching](#caching)
- [Error Handling](#error-handling)
- [Notes](#notes)

---

## Getting Started

1. **Install dependencies**
   ```sh
   npm install
   ```

2. **Set up environment variables**  
   Create a `.env` file in the root:
   ```
   MONGO_URI=mongodb://localhost:27017/hypergro
   JWT_SECRET=your_jwt_secret
   REDIS_URL=redis://localhost:6379
   PORT=5000
   ```

3. **Start MongoDB and Redis**  
   Make sure both services are running.

4. **Run the server**
   ```sh
   npm run dev
   ```

---

## Environment Variables

| Variable     | Description                        |
|--------------|------------------------------------|
| MONGO_URI    | MongoDB connection string          |
| JWT_SECRET   | Secret for JWT signing             |
| REDIS_URL    | Redis connection string            |
| PORT         | Port for the API server (default: 5000) |

---

## API Endpoints

### Auth

#### Register
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  - `201 Created` with user object and JWT token

#### Login
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  - `200 OK` with JWT token

---

### Properties

#### Get All Properties (with filtering)
- **GET** `/api/properties`
- **Query Params:** (optional) Any property field, e.g. `city`, `price`, etc.
- **Response:** Array of property objects

#### Create Property
- **POST** `/api/properties`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "id": "PROP1953",
    "title": "Luxury Apartment",
    "type": "Penthouse",
    "price": 8954321,
    "state": "Delhi",
    "city": "New Delhi",
    "areaSqFt": 593,
    "bedrooms": 1,
    "bathrooms": 3,
    "amenities": ["pool", "gym", "clubhouse"],
    "furnished": "Furnished",
    "availableFrom": "2025-08-08",
    "listedBy": "Builder",
    "tags": ["family-friendly", "lake-view"],
    "colorTheme": "#adccb7",
    "rating": 3.3,
    "isVerified": false,
    "listingType": "rent",
    "createdBy": "{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }"
  }
  ```
- **Response:** Created property object

#### Update Property
- **PUT** `/api/properties/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Any updatable property fields
- **Response:** Updated property object

#### Delete Property
- **DELETE** `/api/properties/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ "message": "Deleted successfully" }`

---

### Favorites

#### Get Favorites
- **GET** `/api/favorites`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of favorite property objects

#### Add Favorite
- **POST** `/api/favorites`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "propertyId": "PROP1953"
  }
  ```
- **Response:** Created favorite object

#### Delete Favorite
- **DELETE** `/api/favorites/:propertyId`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ "message": "Favorite removed" }`

#### Update Favorite (if implemented)
- **PUT** `/api/favorites/:propertyId`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Fields to update (e.g. notes, priority)
- **Response:** Updated favorite object

---

### Recommendations

#### Recommend a Property to Another User
- **POST** `/api/properties/:propertyId/recommend`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "recipientEmail": "recipient@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Property recommended successfully",
    "recommendationsReceived": [ /* array of recommended property objects for the recipient */ ]
  }
  ```

#### View Properties Recommended to You
- **GET** `/api/properties/recommendations`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of property objects that have been recommended to the authenticated user.

---

## Caching

- Property listing endpoints use Redis for caching.
- Cache is cleared on property create, update, or delete.
- You can clear all cache by calling `clearCache()` with no arguments.

---

## Error Handling

- All endpoints return JSON error messages with appropriate HTTP status codes.
- Common errors:
  - `401 Unauthorized` – Missing or invalid JWT token
  - `403 Forbidden` – Not allowed to modify resource
  - `404 Not Found` – Resource does not exist
  - `500 Server Error` – Internal server error

---



---

## License

MIT

---
