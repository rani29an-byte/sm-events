const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Static files (HTML, CSS, JS) serve karne ke liye
app.use(express.static(__dirname)); 

// --- STABLE DATABASE CONNECTION ---
// Aapka Username: sanjali | Password: merishab
const mongoURI = "mongodb+srv://sanjali:merishab@cluster0.67eunrp.mongodb.net/sm_events?retryWrites=true&w=majority";

mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 5000, // 5 second mein connection fail ho jayega agar internet slow hai
})
.then(() => console.log("✅ SM Events Database Connected (Cloud - MongoDB Atlas)!"))
.catch(err => {
    console.log("❌ CONNECTION ERROR DETECTED!");
    console.log("Dhyan Dein: " + err.message);
});

// --- USER SCHEMA ---
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Signup API
app.post('/api/signup', async (req, res) => {
    try {
        const { name, mobile, password } = req.body;
        
        // Data check
        if(!name || !mobile || !password) {
            return res.status(400).send({ message: "Sari details bhariye!" });
        }

        const newUser = new User({ name, mobile, password });
        await newUser.save();
        res.status(201).send({ message: "User Registered Successfully!" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(400).send({ message: "Mobile Number pehle se hai ya error aa raha hai!" });
    }
});

// Login API
app.post('/api/login', async (req, res) => {
    try {
        const { mobile, password } = req.body;
        const user = await User.findOne({ mobile, password });
        if (user) {
            res.send({ message: "Login Success", userName: user.name });
        } else {
            res.status(401).send({ message: "Invalid Mobile or Password!" });
        }
    } catch (error) {
        res.status(500).send({ message: "Server Error" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));