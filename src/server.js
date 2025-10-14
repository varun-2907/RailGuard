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

// --- API Endpoints ---

// User Signup
app.post("/api/signup", (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res
			.status(400)
			.json({ message: "Username and password are required." });
	}

	const db = readDB();
	if (db.users[username]) {
		return res.status(409).json({ message: "Username already exists." });
	}

	db.users[username] = { password: password, role: "user" };
	writeDB(db);
	res.status(201).json({ message: "User created successfully." });
});

// User Login
app.post("/api/login", (req, res) => {
	const { username, password } = req.body;
	const db = readDB();
	const user = db.users[username];

	if (user && user.password === password) {
		res.status(200).json({
			message: "Login successful.",
			user: { username: username, role: user.role },
		});
	} else {
		res.status(401).json({ message: "Invalid username or password." });
	}
});

// Get all messages (for admin)
app.get("/api/messages", (req, res) => {
	const db = readDB();
	res.status(200).json(db.messages);
});

// --- Real-time Chat with Socket.IO ---
io.on("connection", (socket) => {
	console.log("A user connected:", socket.id);

	socket.on("sendMessage", (data) => {
		console.log("Message received:", data);
		const db = readDB();
		const convoId = data.convoId || `convo_${data.user}_${Date.now()}`;
		if (!db.messages[convoId]) {
			db.messages[convoId] = { user: data.user, messages: [] };
		}
		db.messages[convoId].messages.push({
			sender: data.sender,
			text: data.text,
			imageUrl: data.imageUrl, // Add imageUrl to the message object
			timestamp: new Date(),
		});
		writeDB(db);
		io.emit("newMessage", { convoId, ...db.messages[convoId] });
	});

	socket.on("disconnect", () => {
		console.log("User disconnected:", socket.id);
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
							timestamp: new Date(),
						},
					],
				},
			},
		});
		console.log("Database initialized with default data.");
	}
};

server.listen(PORT, () => {
	initializeDB();
	console.log(`Server is running on http://localhost:${PORT}`);
});
