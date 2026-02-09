# Assignment 4 — Web Tech 2

**Project:** QBook  
**Student:** Aibek Nurtay  
**Group:** SE-2433  
**Course:** Web Tech 2  
**Assignment:** Final Project

## 1) Overview

This project is a **Full-Stack MongoDB** application with:

- **Relational Data Model**: Links Users, Books, and Reviews
- **JWT Authentication**: Secure login/registration flow
- **Role-based access control (RBAC)**: `user` vs `admin` permissions
- **Dynamic Frontend**: A responsive interface that communicates with a Node.js API
- **Static Hosting**: The frontend is served directly from the `local/` folder on the server

## 2) Objects and Relationships

### Primary Object: `Book`

Stored in MongoDB collection: `books`. Contains:

- `title` (string, required)
- `author` (string, required)
- `price` (number, required)
- `description` (string, required)
- `rating` (number, calculated from reviews)
- `reviewsCount` (number, calculated from reviews)
- `createdAt` / `updatedAt` (timestamps)

### Secondary Object: `Review`

Stored in MongoDB collection: `reviews`. Contains:

- `bookId` (ObjectId, references `Book`)
- `userId` (ObjectId, references `User`)
- `username` (string) — reviewer name (from User, stored for convenience)
- `stars` (number, 1..5)
- `text` (string)
- `createdAt` / `updatedAt` (timestamps)

### Secondary Object: `User`

Stored in MongoDB collection: `users`. Contains:

- `name` (string, required)
- `email` (string, required, unique)
- `passwordHash` (string, required)
- `role` (`user` or `admin`)
- `createdAt` / `updatedAt` (timestamps)

### Relationship

- **One-to-Many**: One `Book` can have many `Review`s.
- **One-to-Many**: One `User` can create many `Review`s.
- **Review links Book + User** using `bookId` and `userId`.

Also implemented:
- When a review is created/deleted, the system recalculates `Book.rating` and `Book.reviewsCount` automatically.

## 3) Roles and Permissions (RBAC)

Roles are stored in `User.role` and embedded inside JWT.

### `user` role
- Can register/login and receive JWT
- Can view books (GET)
- Can create reviews (POST /api/reviews)
- Cannot create/update/delete books
- Cannot delete reviews

### `admin` role
- Can register/login and receive JWT
- Can view books (GET)
- Can create/update/delete books
- Can delete reviews (DELETE /api/reviews/:id)
- Cannot create reviews (only users can create reviews)

Expected HTTP statuses:
- `401 Unauthorized` → Missing or invalid token
- `403 Forbidden` → Token is valid, but role has no permission

## 4) Installation & Setup

### 4.1 Install dependencies

`npm install`

### 4.2 Create .env file in project root

`MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET_STRING`

### 4.3 Start the server
`node server.js`
Server runs on: http://localhost:3000

## 5) Project Structure (MVC)
`BACKASS4/
  controllers/
    authController.js
    bookController.js
    reviewController.js
  middleware/
    auth.js
    errorHandler.js
  models/
    User.js
    Book.js
    Review.js
  routes/
    authRoute.js
    bookRoute.js
    reviewRoute.js
  local/
    index.html
    auth.html
    book.html
    styles.css
    app.js
    home.js
    auth.js
    book.js
  db.js
  server.js
  package.json
  .env`

## 6) API Endpoints
Base URL: http://localhost:3000
### 6.1) Auth (/api/auth)

Register:
- POST /api/auth/register
- 
Body (JSON):
`{
  "name": "Aibek",
  "email": "user@example.com",
  "password": "123456",
  "role": "user"
}`
role can be "user" or "admin"

Response:
201 Created returns { token, user }

Login:
POST /api/auth/login

Body (JSON):
`{
  "email": "user@example.com",
  "password": "123456"
}`
Response:
200 OK returns { token, user }

Current user (requires JWT):
GET /api/auth/me

Header:
Authorization: Bearer <TOKEN>

Response:
200 OK returns { user }

## 6.2) Books (/api/books)
Get all books (public):
GET /api/books

Response:
200 OK returns array of books

Get one book by id (public):
GET /api/books/:id

Responses:
200 OK book object
404 Not Found if book doesn’t exist
400 Bad Request invalid id

Create book (admin only):
POST /api/books

Header:
Authorization: Bearer <ADMIN_TOKEN>
`{
  "title": "Harry Potter",
  "author": "J.K Rowling",
  "price": 15,
  "description": "I solemnly swear that I am up to no good"
}`

Responses:
201 Created
401 Unauthorized
403 Forbidden

Update book (admin only):
PUT /api/books/:id

Header:
Authorization: Bearer <ADMIN_TOKEN>
`{
  "title": "Harry Potter and the Order of the Phoenix",
  "author": "J.K Rowling",
  "price": 13,
  "description": "I solemnly swear that I am up to no good"
}`
Delete book (admin only):
DELETE /api/books/:id

Header:
Authorization: Bearer <ADMIN_TOKEN>
## 6.3 Reviews (/api/reviews)

Get reviews (public):
GET /api/reviews
Optional filter: GET /api/reviews?bookId=<BOOK_ID>

Create review (user only):
POST /api/reviews

Header:
Authorization: Bearer <USER_TOKEN>

Body (JSON):
`{
  "bookId": "65f0c1c2a1b2c3d4e5f67890",
  "stars": 5,
  "text": "Perfect book!"
}`
Rules:
Only authenticated users with role user can create reviews
username is taken from JWT (req.user.name), user does not type it

Delete review (admin only):
DELETE /api/reviews/:id

Header:
Authorization: Bearer <ADMIN_TOKEN>

After delete:
Book rating and reviewsCount are recalculated automatically

## 7) JWT (What it is and where it comes from)
What is JWT:
JWT (JSON Web Token) is a signed token used to prove that a user is logged in

### Where i used JWT in this project:
Receive JWT from the server when you:
Register: POST /api/auth/register
Login: POST /api/auth/login
The response returns:
`{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "user"
  }
}`

### How to use JWT
Send it in request headers:
Authorization: Bearer <TOKEN>

JWT is verified using JWT_SECRET from .env

## 8) Packages used
Installed via: `npm install`

Main packages:
  - express — server + routing
  - mongoose — MongoDB ORM
  - dotenv — environment variables from .env
  - jsonwebtoken — create/verify JWT
  - bcryptjs — password hashing

## 9) Postman Collection Requirements (User vs Admin)
