# Mini User Authentication System

Simple Express + MongoDB backend for user registration and login with password hashing.

## Features

- ✅ Express setup
- ✅ Routing
- ✅ Controllers
- ✅ MongoDB connection
- ✅ User registration + login
- ✅ Password hashing with bcrypt

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `env.example` to `.env` and set your MongoDB URI:
```bash
cp .env.example .env
```

Edit `.env` and set:
- `MONGODB_URI` - Your MongoDB connection string
- `PORT` - Server port (default: 4000)

3. Start the development server:
```bash
npm run dev
```

Or start the production server:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /health` → Returns service status

### Authentication
- `POST /api/auth/register` → Register a new user
  - Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
  
- `POST /api/auth/login` → Login user
  - Body: `{ "email": "john@example.com", "password": "password123" }`

## Project Structure

```
mini-auth-system/
├── src/
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── controllers/
│   │   └── authController.js  # Register & login logic
│   ├── middleware/
│   │   ├── asyncHandler.js    # Async error wrapper
│   │   └── errorHandler.js    # Global error handler
│   ├── models/
│   │   └── User.js            # User schema with password hashing
│   ├── routes/
│   │   └── authRoutes.js      # Auth route definitions
│   └── index.js               # Express app setup
├── .env.example
├── package.json
└── README.md
```

## Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing
- **morgan** - HTTP request logger

