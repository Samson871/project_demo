const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const users = [];

app.use(express.static(path.join(__dirname, '../public')));

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/signup.html"));
});

app.post("/signup", (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
    }

    users.push({ username, email, password });
    return res.status(201).json({ message: "Signup successful! Please login." });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
    }

    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    req.session.user = user;
    return res.status(200).json({ message: "Login successful", user });
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    return res.status(200).json({ message: "Logged out successfully" });
});

const port =3000;
// module.exports = app;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`)); 
