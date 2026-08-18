const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors'); 
const path = require('path');
const nodemailer = require('nodemailer'); 
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const mongoose = require('mongoose');

// BUG 1 FIXED: User Schema ab "name" ko properly handle karega
const userSchema = new mongoose.Schema({
    name: { type: String, required: false, default: "User" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isPremium: { type: Boolean, default: false }, // Default hamesha FREE
    subscriptionType: { type: String, default: 'free' }, 
    subscriptionExpiry: { type: Date, default: null },
    resetOtp: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const activeSessions = {}; 

const testSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }, 
    category: { type: String, default: 'delhi-hc' }, 
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, 
    createdByEmail: { type: String, default: "neetypingpro@gmail.com" },
    isAdminTest: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: true }, 
    isPremium: { type: Boolean, default: false },
    isFreeDemo: { type: Boolean, default: false },
    isLive: { type: Boolean, default: false }, 
    createdAt: { type: Date, default: Date.now }
});
const Test = mongoose.model('Test', testSchema);

const scoreSchema = new mongoose.Schema({
    userName: { type: String, default: "Anonymous" },
    userEmail: { type: String, default: "" }, 
    testName: { type: String, default: "Practice Test" },
    wpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    testDate: { type: Date, default: Date.now }
});
const Score = mongoose.model('Score', scoreSchema);

// Database Connection
const mongoURI = 'mongodb://ankurparashar1312_db_user:ankur2@ac-t2amnzl-shard-00-00.gbzcmt5.mongodb.net:27017,ac-t2amnzl-shard-00-01.gbzcmt5.mongodb.net:27017,ac-t2amnzl-shard-00-02.gbzcmt5.mongodb.net:27017/anktyping?ssl=true&replicaSet=atlas-97r46d-shard-0&authSource=admin&appName=Cluster0';

mongoose.connect(mongoURI)
    .then(() => console.log("Cloud MongoDB Database se successfully connect ho gaye! 🚀"))
    .catch((err) => console.log("Database connection error: ", err));

// BUG 2 FIXED: SIGNUP ENDPOINT (Ab user ka original naam DB me save hoga)
app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).json({ success: false, error: "Yeh email pehle se registered hai! Kripya Login karein." });
        }

        const newUser = new User({
            name: name || email.split('@')[0], // Agar naam nahi aaya toh email ka shuru ka hissa banayega
            email,
            password,
            isPremium: (email === "neetypingpro@gmail.com"), // Sirf Developer ki email Premium hogi
            subscriptionType: (email === "neetypingpro@gmail.com") ? 'admin' : 'free'
        });
        
        await newUser.save();
        res.status(201).json({ success: true, message: "Account successfully create ho gaya!" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ success: false, error: "Registration failed due to server error" });
    }
});

// BUG 3 FIXED: LOGIN ENDPOINT (Frontend ko Name aur isPremium status theek se bhejna)
app.post('/api/login', async (req, res) => {
    try {
        const { email, password, deviceId } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(400).json({ success: false, error: "Invalid email or password" });
        }

        if (!activeSessions[email]) {
            activeSessions[email] = [];
        }

        const currentDevices = activeSessions[email];
        
        // Agar pehle se same device par login hai
        if (currentDevices.includes(deviceId)) {
            return res.json({ 
                success: true, 
                message: "Login successful", 
                name: user.name, 
                isPremium: user.isPremium,
                user 
            });
        }

        // Device limit check
        const maxLimit = (user.subscriptionType === 'institute') ? 10 : 2;
        if (currentDevices.length >= maxLimit && email !== "neetypingpro@gmail.com") {
            return res.status(403).json({ 
                success: false, 
                error: `Device limit reached! Your plan allows maximum ${maxLimit} active login(s).` 
            });
        }

        currentDevices.push(deviceId);
        
        // Success par saara zaroori data bhejna
        res.json({ 
            success: true, 
            message: "Login successful", 
            name: user.name,
            isPremium: user.isPremium, // Yeh important hai UI badge ke liye
            user 
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, error: "Login failed due to server error" });
    }
});

// FORGOT PASSWORD ENDPOINTS
app.post('/api/forgot-password-request', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: "Yeh email database mein registered nahi hai." });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.resetOtp = otp;
        await user.save();

        res.status(200).json({ success: true, otp, message: "OTP generated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: "OTP request failed" });
    }
});

app.post('/api/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.resetOtp !== otp) {
            return res.status(400).json({ success: false, error: "Galat OTP! Kripya sahi OTP daalein." });
        }

        user.password = newPassword;
        user.resetOtp = null;
        await user.save();

        res.status(200).json({ success: true, message: "Password reset successful!" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Password reset failed" });
    }
});

app.post('/api/logout', (req, res) => {
    const { email, deviceId } = req.body;
    if (activeSessions[email]) {
        activeSessions[email] = activeSessions[email].filter(id => id !== deviceId);
    }
    res.json({ success: true, message: "Logged out successfully" });
});

// TEST SCORES ENDPOINTS
app.post('/api/save-score', async (req, res) => {
    try {
        const { userName, wpm, accuracy, userEmail, testName } = req.body;
        const newScore = new Score({ userName, wpm, accuracy, userEmail, testName: testName || "Practice Test" });
        await newScore.save();
        res.status(201).json({ message: "Score successfully save ho gaya! 🎉", success: true });
    } catch (error) {
        res.status(500).json({ error: "Score save nahi ho paya", success: false });
    }
});

app.get('/api/user-scores/:email', async (req, res) => {
    try {
        const scores = await Score.find({ userEmail: req.params.email }).sort({ testDate: -1 });
        res.status(200).json(scores);
    } catch (error) {
        res.status(500).json({ error: "User history fetch nahi ho payi" });
    }
});

// TESTS ENDPOINTS
app.post('/api/add-test', async (req, res) => {
    try {
        const { title, content, category, isPremium, isLive, isFreeDemo, createdByEmail } = req.body;
        const DEVELOPER_EMAIL = "neetypingpro@gmail.com";
        const isAdmin = (createdByEmail === DEVELOPER_EMAIL);

        const newTest = new Test({
            title,
            content,
            category: category || 'delhi-hc',
            isPremium: isPremium || false,
            isLive: isLive || false,
            isFreeDemo: isFreeDemo || false,
            createdByEmail: createdByEmail || DEVELOPER_EMAIL,
            isAdminTest: isAdmin,
            isPublic: true
        });

        await newTest.save();
        res.status(201).json({ success: true, message: "Test successfully add ho gaya!" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Test save nahi ho paya" });
    }
});

app.get('/api/tests', async (req, res) => {
    try {
        const tests = await Test.find().sort({ createdAt: -1 });
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ error: "Tests laane mein nakamyabi rahi" });
    }
});

app.delete('/api/delete-test/:id', async (req, res) => {
    try {
        await Test.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Test delete ho gaya!" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Test delete nahi ho paya" });
    }
});

app.get('/api/leaderboard', async (req, res) => {
    try {
        const topScores = await Score.find().sort({ wpm: -1 }).limit(10);
        res.status(200).json(topScores);
    } catch (error) {
        res.status(500).json({ error: "Data fetch nahi ho paya" });
    }
});

// RAZORPAY INTEGRATION
const razorpay = new Razorpay({
    key_id: 'rzp_live_TMKCGdGF9bJQp9',    
    key_secret: 'YeZ1MRq6AXWnjOKxUH3baRXz'   
});

app.post('/api/create-order', async (req, res) => {
    try {
        const options = {
            amount: req.body.amount || 10000, 
            currency: "INR",
            receipt: "receipt_order_" + Math.random().toString(36).substring(7)
        };
        const order = await razorpay.orders.create(options);
        res.status(200).json({ success: true, orderId: order.id, amount: order.amount, keyId: razorpay.key_id });
    } catch (error) {
        console.error("Razorpay order error:", error);
        res.status(500).json({ success: false, error: "Order create nahi ho paya" });
    }
});

app.post('/api/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userEmail } = req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto.createHmac("sha256", razorpay.key_secret).update(sign.toString()).digest("hex");

        if (expectedSign === razorpay_signature) {
            // PAYMENT SUCCESS: User ko premium bana do
            await User.findOneAndUpdate(
                { email: userEmail }, 
                { isPremium: true, subscriptionType: 'buddy' }
            );
            return res.status(200).json({ success: true, message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ success: false, error: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: "Internal Server Error during verification" });
    }
});

// Frontend Serving
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Backend Server badhiya se chal raha hai Port ${PORT} par!`);
});