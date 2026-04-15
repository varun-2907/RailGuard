# RailGuard - Railway Maintenance Management System

A comprehensive backend server for managing railway maintenance requests, escalations, and real-time communications between users and administrators.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Server runs on http://localhost:3001
```

## 📋 Backend Features

### ✅ Authentication & Authorization
- User registration with validation
- Secure login system
- Role-based access (user/admin)
- Admin-only access portal

### ✅ Real-Time Communication
- Socket.IO for instant messaging
- Support for text and image attachments
- Message history persistence
- Multi-user conversation support

### ✅ Admin Dashboard
- View all user conversations
- Manage user communications
- User statistics and monitoring
- Real-time response capability

### ✅ Data Management
- JSON-based database
- Persistent message storage
- User account management
- Automatic data initialization

## 📁 Project Structure

```
RailGuard/
├── server.js                    # Express.js backend server
├── db.json                      # JSON database
├── package.json                 # Dependencies and scripts
│
├── SETUP_GUIDE.md              # Setup instructions
├── BACKEND_API.md              # API documentation
├── README.md                   # This file
│
└── public/                      # Frontend (served by Express)
    ├── index.html              # User dashboard
    ├── admin.html              # Admin dashboard
    └── [other assets]
```

## 🔑 Default Credentials

| Role | Username | Password |
|------|----------|----------|
| User | `user` | `1234` |
| Admin | `admin` | `1234` |

## 🌐 Access Points

| Dashboard | URL |
|-----------|-----|
| User | `http://localhost:3001/index.html` |
| Admin | `http://localhost:3001/admin.html` |

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/signup` | Create new user account |
| POST | `/api/login` | User authentication |
| POST | `/api/admin/login` | Admin authentication |
| GET | `/api/messages` | Retrieve all conversations |
| GET | `/api/users` | List all users |

## 🔌 Socket.IO Events

**Send Message**:
```javascript
socket.emit("sendMessage", {
  user: "username",
  sender: "display_name",
  text: "message content",
  convoId: "conversation_id"      // optional
});
```

**Receive Message**:
```javascript
socket.on("newMessage", (data) => {
  // Handle incoming message
});
```

## 📖 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Installation and quickstart
- **[BACKEND_API.md](BACKEND_API.md)** - Complete API reference

## 🛠 Development

### Available Commands

```bash
npm start              # Run production server
npm run dev           # Run with auto-reload (development)
npm test              # Run tests (not configured)
```

### Add New API Endpoint

```javascript
app.get("/api/endpoint", (req, res) => {
  try {
    // Your logic
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

## 🔒 Security Features

✅ Input validation on all endpoints
✅ Error handling with try-catch blocks
✅ Request body validation
✅ Standardized error responses
✅ Role-based access control

⚠️ **Note**: This is a demo application. For production deployment:
- Implement password hashing (bcrypt)
- Add JWT token authentication
- Enable HTTPS/SSL
- Implement rate limiting
- Add CORS configuration
- Use environment variables for secrets
- Store passwords securely (never plain text)

## 🗄 Database

The application uses `db.json` for storage:

```json
{
  "users": {
    "username": {
      "password": "plain_text_or_hashed",
      "role": "user|admin"
    }
  },
  "messages": {
    "convoId": {
      "user": "username",
      "messages": [
        {
          "sender": "username",
          "text": "message",
          "timestamp": "ISO_timestamp",
          "imageUrl": "optional_url"
        }
      ]
    }
  }
}
```

## 🐛 Troubleshooting

### Server Won't Start
```bash
# Check if dependencies are installed
npm install

# Check if port 3001 is available
lsof -i :3001
```

### Can't Login
- Verify `db.json` exists
- Check default credentials: admin/1234 or user/1234
- Ensure JSON file is valid (no syntax errors)

### Messages Not Persisting
- Verify `db.json` has write permissions
- Check that the directory is writable
- Restart the server

## 📊 Technology Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Socket.IO** - Real-time communication
- **JSON** - Simple database

## 📞 Support

For API details and advanced features, refer to:
- [BACKEND_API.md](BACKEND_API.md) - Full API documentation
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Setup and troubleshooting

## 📝 License

ISC

---

**Version**: 1.0.0
**Last Updated**: April 2026

Happy building! 🚀
