const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, "db.json");

// --- Database Helper Functions ---
const readDB = () => {
	try {
		const data = fs.readFileSync(DB_PATH, "utf8");
		return JSON.parse(data);
	} catch (error) {
		return { users: {}, messages: {} };
	}
};

const writeDB = (data) => {
	fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
};

// --- Middleware ---
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// --- Validation Helpers ---
const validateUsername = (username) => {
	if (!username || typeof username !== "string") return false;
	if (username.trim().length < 3) return false;
	return /^[a-zA-Z0-9_-]+$/.test(username);
};

const validatePassword = (password) => {
	if (!password || typeof password !== "string") return false;
	return password.length >= 1; // Allow any non-empty password
};

// --- API Endpoints ---

// User Signup
app.post("/api/signup", (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({
				success: false,
				message: "Username and password are required.",
			});
		}

		if (!validateUsername(username)) {
			return res.status(400).json({
				success: false,
				message:
					"Username must be at least 3 characters and contain only letters, numbers, underscores, or hyphens.",
			});
		}

		if (!validatePassword(password)) {
			return res.status(400).json({
				success: false,
				message: "Password cannot be empty.",
			});
		}

		const db = readDB();
		if (db.users[username]) {
			return res.status(409).json({
				success: false,
				message: "Username already exists.",
			});
		}

		db.users[username] = { password: password, role: "user" };
		writeDB(db);
		res.status(201).json({
			success: true,
			message: "User created successfully.",
		});
	} catch (error) {
		console.error("Signup error:", error);
		res.status(500).json({
			success: false,
			message: "Server error during signup.",
		});
	}
});

// User Login
app.post("/api/login", (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({
				success: false,
				message: "Username and password are required.",
			});
		}

		const db = readDB();
		const user = db.users[username];

		if (user && user.password === password) {
			res.status(200).json({
				success: true,
				message: "Login successful.",
				user: { username: username, role: user.role },
			});
		} else {
			res.status(401).json({
				success: false,
				message: "Invalid username or password.",
			});
		}
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({
			success: false,
			message: "Server error during login.",
		});
	}
});

// Admin Login
app.post("/api/admin/login", (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({
				success: false,
				message: "Username and password are required.",
			});
		}

		const db = readDB();
		const user = db.users[username];

		if (user && user.password === password && user.role === "admin") {
			res.status(200).json({
				success: true,
				message: "Admin login successful.",
				user: { username: username, role: "admin" },
			});
		} else {
			res.status(401).json({
				success: false,
				message: "Invalid admin credentials.",
			});
		}
	} catch (error) {
		console.error("Admin login error:", error);
		res.status(500).json({
			success: false,
			message: "Server error during admin login.",
		});
	}
});

// Get all messages (for admin)
app.get("/api/messages", (req, res) => {
	try {
		const db = readDB();
		res.status(200).json({
			success: true,
			messages: db.messages,
			totalConversations: Object.keys(db.messages).length,
		});
	} catch (error) {
		console.error("Get messages error:", error);
		res.status(500).json({
			success: false,
			message: "Server error retrieving messages.",
		});
	}
});

// Get all users (admin only)
app.get("/api/users", (req, res) => {
	try {
		const db = readDB();
		// Return user info without passwords
		const users = Object.entries(db.users).map(([username, userData]) => ({
			username: username,
			role: userData.role,
		}));
		res.status(200).json({
			success: true,
			users: users,
			totalUsers: users.length,
		});
	} catch (error) {
		console.error("Get users error:", error);
		res.status(500).json({
			success: false,
			message: "Server error retrieving users.",
		});
	}
});

// --- Real-time Chat with Socket.IO ---
io.on("connection", (socket) => {
	console.log("A user connected:", socket.id);

	socket.on("sendMessage", (data) => {
		try {
			if (!data || !data.sender || !data.text) {
				console.error("Invalid message data:", data);
				return;
			}

			console.log("Message received:", data);
			const db = readDB();
			const convoId = data.convoId || `convo_${data.user}_${Date.now()}`;

			if (!db.messages[convoId]) {
				db.messages[convoId] = { user: data.user, messages: [] };
			}

			const messageObject = {
				sender: data.sender,
				text: data.text,
				timestamp: new Date().toISOString(),
			};

			// Add optional imageUrl if provided
			if (data.imageUrl) {
				messageObject.imageUrl = data.imageUrl;
			}

			db.messages[convoId].messages.push(messageObject);
			writeDB(db);

			// Broadcast the new message to all connected clients
			io.emit("newMessage", {
				convoId: convoId,
				user: data.user,
				messages: db.messages[convoId].messages,
			});
		} catch (error) {
			console.error("Error handling sendMessage:", error);
		}
	});

	socket.on("disconnect", () => {
		console.log("User disconnected:", socket.id);
	});

	socket.on("error", (error) => {
		console.error("Socket error:", error);
	});
});

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
	console.error("Server error:", err);
	res.status(500).json({
		success: false,
		message: "Internal server error.",
	});
});

// --- 404 Handler ---
app.use((req, res) => {
	res.status(404).json({
		success: false,
		message: "Endpoint not found.",
	});
});

// --- Start the Server ---
const initializeDB = () => {
	if (!fs.existsSync(DB_PATH)) {
		console.log("Database not found. Initializing with default data...");
		writeDB({
			users: {
				admin: { password: "1234", role: "admin" },
				user: { password: "1234", role: "user" },
			},
			messages: {
				user_feedback_1: {
					user: "user",
					messages: [
						{
							sender: "user",
							text: "The cleaning in coach B2 was not up to the mark.",
							timestamp: new Date().toISOString(),
						},
					],
				},
			},
		});
		console.log("Database initialized with default data.");
	} else {
		console.log("Database loaded successfully.");
	}
};

// Initialize database before starting server
initializeDB();

server.listen(PORT, () => {
	console.log(`✅ RailGuard Server is running on http://localhost:${PORT}`);
	console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin.html`);
	console.log(`👤 User Dashboard: http://localhost:${PORT}/index.html`);
	console.log(`\nDefault Credentials:`);
	console.log(`  Admin: username="admin", password="1234"`);
	console.log(`  User: username="user", password="1234"`);
});
