# ParkEase - Parking Management System

A full-stack parking management application with real-time slot availability tracking.

## 🚀 Features

- User authentication and registration
- Real-time parking slot availability
- Admin dashboard for slot management
- Event management system
- Responsive frontend with modern UI

## 📁 Project Structure

```
infosys-project-main/
├── Backend/          # Node.js/Express backend
│   ├── controller/   # Route controllers
│   ├── middleware/   # Authentication & authorization
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   └── server.js     # Main server file
└── Frontend/         # React/TypeScript frontend
    └── parkease-launchpad-main/
        └── src/      # React source code
```

## 🛠️ Setup Instructions

### Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the Backend directory:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   JWT_SECRET=secretKey123
   FRONTEND_URL=http://localhost:8080
   ```

4. Start the server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend/parkease-launchpad-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create a `.env` file:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `GET /api/auth/dashboard` - User dashboard (protected)

### Slots
- `GET /api/slots/all` - Get all parking slots

### Admin
- `GET /api/admin/dashboard` - Admin dashboard (admin only)
- `POST /api/admin/add-slot` - Add new parking slot (admin only)

### Events
- `GET /api/events/all` - Get all events
- `GET /api/events/advanced-events` - Get events with pagination
- `POST /api/events/create` - Create new event
- `PUT /api/events/update/:id` - Update event
- `DELETE /api/events/delete/:id` - Delete event

## 🛡️ Authentication

The API uses JWT tokens for authentication. Include the token in the request header:
```
x-auth-token: your_jwt_token
```

## 📝 Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query

## 📄 License

See LICENSE file for details.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

