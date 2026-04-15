# RailGuard Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

This will install:
- `express` - Web server framework
- `socket.io` - Real-time bidirectional communication
- `nodemon` - Development tool for auto-reloading

### 2. Start the Server

**For Development** (recommended during development):
```bash
npm run dev
```

**For Production**:
```bash
npm start
```

### 3. Access the Application

Once the server is running:
- **User Dashboard**: Open `http://localhost:3001/index.html` in your browser
- **Admin Dashboard**: Open `http://localhost:3001/admin.html` in your browser

### 4. Login with Default Credentials

**Regular User**:
- Username: `user`
- Password: `1234`

**Admin**:
- Username: `admin`
- Password: `1234`

## Backend Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/signup` | Create new user |
| POST | `/api/login` | User login |
| POST | `/api/admin/login` | Admin login |
| GET | `/api/messages` | Get all conversations |
| GET | `/api/users` | Get all users |
| - | Socket.IO: `sendMessage` | Send real-time message |
| - | Socket.IO: `newMessage` | Receive real-time message |

## Project Structure

```
RailGuard/
├── server.js              # Main Node.js/Express backend server
├── db.json               # JSON database with users and messages
├── package.json          # NPM dependencies and scripts
├── BACKEND_API.md        # Full API documentation
│
└── public/               # Frontend files (served by Express)
    ├── index.html        # User dashboard
    ├── admin.html        # Admin dashboard
    └── [other assets]    # CSS, images, etc.
```

## What's Included in the Backend

✅ **Express Server**
- Static file serving for frontend (index.html, admin.html)
- JSON request/response handling
- RESTful API endpoints

✅ **Authentication System**
- User signup with validation
- User login
- Admin-specific login endpoint
- Role-based access (user/admin)

✅ **Real-time Chat (Socket.IO)**
- Live message broadcasting
- Conversation management
- Message storage

✅ **Admin Features**
- View all conversations
- View all users
- Real-time chat with users

✅ **Database (JSON)**
- User accounts and roles
- Message conversations
- Persistent storage

✅ **Error Handling**
- Input validation
- Try-catch blocks
- Standardized error responses
- 404 handler

## Key Features

### User Management
- Secure user registration
- Email-free login (username/password)
- Role-based authentication (user/admin)
- User listing (admin only)

### Real-Time Messaging
- Socket.IO for bidirectional communication
- Multiple conversations support
- Optional image attachments in messages
- Timestamp tracking

### Admin Dashboard
- View all user conversations
- Respond to messages
- Monitor all communications
- User statistics

### Data Persistence
- JSON file-based database
- Auto-initialization with sample data
- Data preservation across server restarts

## Common Tasks

### Create a New User Programmatically

This will happen automatically when users signup through the frontend, but you can also manually edit `db.json`:

```json
{
  "users": {
    "newuser": {
      "password": "pass123",
      "role": "user"
    }
  }
}
```

### Verify Server is Running

Check if you see this output in terminal:
```
✅ RailGuard Server is running on http://localhost:3001
📊 Admin Dashboard: http://localhost:3001/admin.html
👤 User Dashboard: http://localhost:3001/index.html

Default Credentials:
  Admin: username="admin", password="1234"
  User: username="user", password="1234"
```

### Access the Database

The database is stored in `db.json` - it's plain JSON, so you can open it in any text editor to view or manually edit data.

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Start the server: `npm run dev`
3. ✅ Open browser to `http://localhost:3001`
4. ✅ Login with default credentials
5. ✅ Test the application

## Troubleshooting

### Port Already in Use
```bash
# Kill the process on port 3001 (macOS/Linux)
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9

# On Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Can't Connect to Database
```bash
# Verify db.json exists
ls -la db.json

# Reset database by deleting it (will auto-recreate on server start)
rm db.json
# Then restart the server
```

## For More Information

See [BACKEND_API.md](BACKEND_API.md) for detailed API documentation.
