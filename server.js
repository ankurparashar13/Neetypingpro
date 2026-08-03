const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors'); 
const path = require('path');
const nodemailer = require('nodemailer'); 
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isPremium: { type: Boolean, default: false },
    subscriptionType: { type: String, default: 'basic' }, 
    subscriptionExpiry: { type: Date, default: null },
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
    wpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    testDate: { type: Date, default: Date.now }
});
const Score = mongoose.model('Score', scoreSchema);

const competitionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    startTime: { type: Date, required: true },
    durationMinutes: { type: Number, default: 10 },
    participants: [{
        userEmail: String,
        userName: String,
        wpm: Number,
        accuracy: Number,
        submittedAt: { type: Date, default: Date.now }
    }],
    isActive: { type: Boolean, default: true }
});
const Competition = mongoose.model('Competition', competitionSchema);

const mongoURI = 'mongodb://ankurparashar1312_db_user:ankur2@ac-t2amnzl-shard-00-00.gbzcmt5.mongodb.net:27017,ac-t2amnzl-shard-00-01.gbzcmt5.mongodb.net:27017,ac-t2amnzl-shard-00-02.gbzcmt5.mongodb.net:27017/anktyping?ssl=true&replicaSet=atlas-97r46d-shard-0&authSource=admin&appName=Cluster0';

mongoose.connect(mongoURI)
    .then(() => console.log("Cloud MongoDB Database se successfully connect ho gaye! 🚀"))
    .catch((err) => console.log("Database connection error: ", err));

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

        if (currentDevices.includes(deviceId)) {
            return res.json({ success: true, message: "Login successful", user });
        }

        const maxLimit = (user.subscriptionType === 'institute') ? 10 : 1;

        if (currentDevices.length >= maxLimit) {
            return res.status(403).json({ 
                success: false, 
                error: `Device limit reached! Your plan allows maximum ${maxLimit} active login(s).` 
            });
        }

        currentDevices.push(deviceId);
        res.json({ success: true, message: "Login successful", user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, error: "Login failed due to server error" });
    }
});

app.post('/api/logout', (req, res) => {
    const { email, deviceId } = req.body;
    if (activeSessions[email]) {
        activeSessions[email] = activeSessions[email].filter(id => id !== deviceId);
    }
    res.json({ success: true, message: "Logged out successfully" });
});

app.post('/api/save-score', async (req, res) => {
    try {
        const { userName, wpm, accuracy, userEmail } = req.body;
        const newScore = new Score({ userName, wpm, accuracy, userEmail });
        await newScore.save();
        res.status(201).json({ message: "Score successfully save ho gaya! 🎉", success: true });
    } catch (error) {
        res.status(500).json({ error: "Score save nahi ho paya", success: false });
    }
});

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

const razorpay = new Razorpay({
    key_id: 'rzp_live_TKQs9AFoc6XT89',    
    key_secret: 'mN6KOt3iF15YWccr0MClL5ww'   
});

app.post('/create-order', async (req, res) => {
    try {
        const options = {
            amount: req.body.amount, 
            currency: "INR",
            receipt: "receipt_order_" + Math.random().toString(36).substring(7)
        };
        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error: "Order create nahi ho paya" });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Backend Server badhiya se chal raha hai Port ${PORT} par!`);
});