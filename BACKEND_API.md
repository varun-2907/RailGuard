# RailGuard Backend API Documentation

## Overview
The RailGuard backend is a Node.js/Express server with real-time chat capabilities using Socket.IO. It manages user authentication, conversations, and provides an admin dashboard.

## Getting Started

### Installation
```bash
npm install
```

### Running the Server

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

The server will start on `http://localhost:3001` by default.

### Default Credentials
- **Admin**: username = `admin`, password = `1234`
- **User**: username = `user`, password = `1234`

## API Endpoints

### Authentication

#### User Signup
- **Method**: `POST`
- **Endpoint**: `/api/signup`
- **Request Body**:
```json
{
  "username": "newuser",
  "password": "password123"
}
```
- **Response** (201):
```json
{
  "success": true,
  "message": "User created successfully."
}
```
- **Errors**:
  - 400: Missing username or password
  - 400: Invalid username format (must be 3+ chars, alphanumeric with `_` or `-`)
  - 409: Username already exists

#### User Login
- **Method**: `POST`
- **Endpoint**: `/api/login`
- **Request Body**:
```json
{
  "username": "user",
  "password": "1234"
}
```
- **Response** (200):
```json
{
  "success": true,
  "message": "Login successful.",
  "user": {
    "username": "user",
    "role": "user"
  }
}
```
- **Errors**:
  - 400: Missing credentials
  - 401: Invalid username or password

#### Admin Login
- **Method**: `POST`
- **Endpoint**: `/api/admin/login`
- **Request Body**:
```json
{
  "username": "admin",
  "password": "1234"
}
```
- **Response** (200):
```json
{
  "success": true,
  "message": "Admin login successful.",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```
- **Errors**:
  - 400: Missing credentials
  - 401: Invalid admin credentials (user must have admin role)

### Messages & Conversations

#### Get All Messages
- **Method**: `GET`
- **Endpoint**: `/api/messages`
- **Response** (200):
```json
{
  "success": true,
  "messages": {
    "user_feedback_1": {
      "user": "user",
      "messages": [
        {
          "sender": "user",
          "text": "Message content",
          "timestamp": "2026-04-15T10:30:00.000Z"
        }
      ]
    }
  },
  "totalConversations": 1
}
```
- **Errors**:
  - 500: Server error

#### Get All Users
- **Method**: `GET`
- **Endpoint**: `/api/users`
- **Response** (200):
```json
{
  "success": true,
  "users": [
    {
      "username": "admin",
      "role": "admin"
    },
    {
      "username": "user",
      "role": "user"
    }
  ],
  "totalUsers": 2
}
```
- **Errors**:
  - 500: Server error

## Socket.IO Real-Time Events

### Connection
When a client connects to the Socket.IO server:
```javascript
const socket = io();
```

### Sending Messages

**Emit Event**: `sendMessage`
```javascript
socket.emit("sendMessage", {
  convoId: "user_feedback_1",      // Optional - auto-generated if not provided
  user: "user",                     // Username of the sender
  sender: "user",                   // Display name for the message
  text: "Message content",          // The message text
  imageUrl: "url/to/image"          // Optional - image URL if applicable
});
```

### Receiving Messages

**Listen Event**: `newMessage`
```javascript
socket.on("newMessage", (data) => {
  console.log("New message received:", data);
  // data structure:
  // {
  //   convoId: "user_feedback_1",
  //   user: "user",
  //   messages: [
  //     {
  //       sender: "user",
  //       text: "Message content",
  //       timestamp: "2026-04-15T10:30:00.000Z",
  //       imageUrl: "url/to/image" (optional)
  //     }
  //   ]
  // }
});
```

## Database Structure

The application uses a JSON file (`db.json`) for storage:

```json
{
  "users": {
    "username": {
      "password": "hashed_or_plain",
      "role": "user|admin"
    }
  },
  "messages": {
    "convoId": {
      "user": "username",
      "messages": [
        {
          "sender": "username",
          "text": "message content",
          "timestamp": "ISO timestamp",
          "imageUrl": "optional"
        }
      ]
    }
  }
}
```

## Features

✅ User Authentication (Signup/Login)
✅ Admin-only Login Portal
✅ Real-time Chat with Socket.IO
✅ Conversation Management
✅ Image Support in Messages
✅ User Management (Admin)
✅ Message Retrieval (Admin)
✅ Error Handling & Validation
✅ Automatic Database Initialization

## Frontend Integration

### Access Points
- **User Dashboard**: `http://localhost:3001/index.html`
- **Admin Dashboard**: `http://localhost:3001/admin.html`

### Key Frontend Files
- [index.html](public/index.html) - User interface
- [admin.html](public/admin.html) - Admin interface

## Environment Variables

- `PORT` (default: 3001) - Server port

## Error Handling

All errors follow this standard format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Notes

⚠️ **Important**: This is a demo application. For production:
- Never store passwords in plain text
- Implement proper JWT authentication
- Use HTTPS
- Add rate limiting
- Implement CORS properly
- Add input sanitization
- Use environment variables for sensitive data

## Troubleshooting

### Server won't start
- Check if port 3001 is already in use: `lsof -i :3001`
- Ensure `node_modules` is installed: `npm install`

### Can't connect to Socket.IO
- Verify the server is running
- Check browser console for connection errors
- Ensure WebSocket is enabled in your environment

### Messages not persisting
- Verify `db.json` exists and is writable
- Check file permissions: `chmod 644 db.json`

## Development

### Project Structure
```
RailGuard/
├── server.js           # Main backend server
├── db.json            # JSON database
├── package.json       # Dependencies
├── public/
│   ├── index.html     # User dashboard
│   └── admin.html     # Admin dashboard
└── BACKEND_API.md     # This file
```

### Adding New Endpoints

To add a new API endpoint:
```javascript
app.post("/api/new-endpoint", (req, res) => {
  try {
    // Your logic here
    res.status(200).json({
      success: true,
      message: "Operation successful."
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error."
    });
  }
});
```

## Support

For issues or questions, please check:
1. Console logs in the terminal running the server
2. Browser developer console for client-side errors
3. Verify the database file exists: `ls -la db.json`
