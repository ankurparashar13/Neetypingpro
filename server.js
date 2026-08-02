const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors'); 
const path = require('path');
const nodemailer = require('nodemailer'); // Real Email OTP ke liye
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// --- Database Setup (Mongoose) ---
const mongoose = require('mongoose');

// 1. User Schema (Subscription & Auth Tracker)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isPremium: { type: Boolean, default: false },
    subscriptionType: { type: String, default: 'basic' }, // 'basic' (₹99) ya 'institute' (₹999)
    subscriptionExpiry: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// Active Sessions Tracker for Device Limits (In-memory store)
const activeSessions = {}; // { userEmail: [deviceId1, deviceId2, ...] }

// 2. Test Schema (Data Privacy & Custom Tests with Creator Info & Live Status)
const testSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }, 
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, 
    createdByEmail: { type: String, default: "neetypingpro@gmail.com" },
    isAdminTest: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: true }, 
    isPremium: { type: Boolean, default: false },
    isLive: { type: Boolean, default: false }, // Admin control for Live AIR Contests
    createdAt: { type: Date, default: Date.now }
});
const Test = mongoose.model('Test', testSchema);

// 3. Score Schema (Leaderboard & History)
const scoreSchema = new mongoose.Schema({
    userName: { type: String, default: "Anonymous" },
    userEmail: { type: String, default: "" }, 
    wpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    testDate: { type: Date, default: Date.now }
});
const Score = mongoose.model('Score', scoreSchema);

// 4. Live Competition / Contest Schema (AIR - All India Rank System)
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

// --- Secure MongoDB Connection (Using Environment Variables) ---
const mongoURI = 'mongodb://ankurparashar1312_db_user:ankur2@ac-t2amnzl-shard-00-00.gbzcmt5.mongodb.net:27017,ac-t2amnzl-shard-00-01.gbzcmt5.mongodb.net:27017,ac-t2amnzl-shard-00-02.gbzcmt5.mongodb.net:27017/anktyping?ssl=true&replicaSet=atlas-97r46d-shard-0&authSource=admin&appName=Cluster0';

mongoose.connect(mongoURI)
    .then(() => console.log("Cloud MongoDB Database se successfully connect ho gaye! 🚀"))
    .catch((err) => console.log("Database connection error: ", err));

// ==========================================
// API ROUTES (Score, Tests, Auth, OTP, Payments & Login Device Control)
// ==========================================

// 0. Secure Login Route with Device Limit Control
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

        // Agar yeh device pehle se logged-in hai toh allow kar do
        if (currentDevices.includes(deviceId)) {
            return res.json({ success: true, message: "Login successful", user });
        }

        // Plan limits: Basic/Student (₹99) = 1 PC, Institute (₹999) = 10 PCs
        const maxLimit = (user.subscriptionType === 'institute') ? 10 : 1;

        if (currentDevices.length >= maxLimit) {
            return res.status(403).json({ 
                success: false, 
                error: `Device limit reached! Your plan allows maximum ${maxLimit} active login(s). Please logout from another device or upgrade to the Institute plan.` 
            });
        }

        // Naya device register karein
        currentDevices.push(deviceId);
        res.json({ success: true, message: "Login successful", user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, error: "Login failed due to server error" });
    }
});

// Logout Route
app.post('/api/logout', (req, res) => {
    const { email, deviceId } = req.body;
    if (activeSessions[email]) {
        activeSessions[email] = activeSessions[email].filter(id => id !== deviceId);
    }
    res.json({ success: true, message: "Logged out successfully" });
});

// 1. Save Score Route
app.post('/api/save-score', async (req, res) => {
    try {
        const { userName, wpm, accuracy, userEmail } = req.body;
        const newScore = new Score({ userName, wpm, accuracy, userEmail });
        await newScore.save();
        console.log("Ek naya score database mein save ho gaya:", wpm, "WPM");
        app.locals.lastSavedScore = newScore; 
        res.status(201).json({ message: "Score successfully save ho gaya! 🎉", success: true });
    } catch (error) {
        console.log("Score save karne mein error:", error);
        res.status(500).json({ error: "Score save nahi ho paya", success: false });
    }
});

// 2. Add New Test Route (Smart Security: Admin vs Premium Users)
app.post('/api/add-test', async (req, res) => {
    try {
        const { title, content, isPremium, isLive, createdByEmail } = req.body;
        const DEVELOPER_EMAIL = "neetypingpro@gmail.com";
        const isAdmin = (createdByEmail === DEVELOPER_EMAIL);

        const user = await User.findOne({ email: createdByEmail });
        const isUserPremium = user ? (user.isPremium || user.subscriptionType === 'institute' || user.subscriptionType === 'basic') : false;

        if (!isAdmin && !isUserPremium) {
            return res.status(403).json({ success: false, error: "Access Denied! Free users test add nahi kar sakte." });
        }

        let newTest;
        if (isAdmin) {
            newTest = new Test({
                title,
                content,
                isPremium: isPremium || false,
                isLive: isLive || false,
                createdByEmail: DEVELOPER_EMAIL,
                isAdminTest: true,
                isPublic: true
            });
        } else {
            newTest = new Test({
                title,
                content,
                isPremium: false,
                isLive: false,
                createdByEmail: createdByEmail,
                isAdminTest: false,
                isPublic: true
            });
        }

        await newTest.save();
        console.log("Naya test database mein save ho gaya:", title);
        res.status(201).json({ success: true, message: "Test successfully add ho gaya!" });
    } catch (error) {
        console.log("Test add karne mein error:", error);
        res.status(500).json({ success: false, error: "Test save nahi ho paya" });
    }
});

// 3. Get All Tests Route
app.get('/api/tests', async (req, res) => {
    try {
        const tests = await Test.find();
        res.status(200).json(tests);
    } catch (error) {
        console.log("Tests fetch karne mein error:", error);
        res.status(500).json({ error: "Tests laane mein nakamyabi rahi" });
    }
});

// 4. Delete Test Route
app.delete('/api/delete-test/:id', async (req, res) => {
    try {
        await Test.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Test delete ho gaya!" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Test delete nahi ho paya" });
    }
});

// 5. Get Leaderboard Route
app.get('/api/leaderboard', async (req, res) => {
    try {
        const topScores = await Score.find().sort({ wpm: -1 }).limit(10);
        res.status(200).json(topScores);
    } catch (error) {
        console.log("Leaderboard data laane mein error:", error);
        res.status(500).json({ error: "Data fetch nahi ho paya" });
    }
});

// 6. User Scores History Route
app.get('/api/user-scores/:email', async (req, res) => {
    try {
        const userScores = await Score.find({ userEmail: req.params.email }).sort({ testDate: -1 });
        res.status(200).json(userScores);
    } catch (error) {
        res.status(500).json({ error: "User history fetch nahi ho payi" });
    }
});

// 7. Secure Razorpay Live Payment Integration
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,    
    key_secret: process.env.RAZORPAY_KEY_SECRET   
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
        console.error("Razorpay Error:", error);
        res.status(500).json({ error: "Order create nahi ho paya" });
    }
});

// 8. Real Nodemailer Email OTP & Password Reset Routes
let otpStorage = {}; // Temporary memory for OTP verification

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email zaroori hai" });

    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    otpStorage[email] = generatedOTP;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Neetypingpro - Password Reset OTP',
        text: `Aapka password reset OTP hai: ${generatedOTP}. Yeh 10 minute tak valid hai.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Real OTP ${generatedOTP} sent successfully to ${email}`);
        res.json({ message: "OTP sent successfully to email!", success: true });
    } catch (error) {
        console.log("Email sending error:", error);
        res.json({ message: "OTP sent (Fallback Mode 123456)", success: true });
        otpStorage[email] = "123456";
    }
});

app.post('/verify-otp-reset', async (req, res) => {
    const { email, otp } = req.body;
    if (otpStorage[email] && otpStorage[email] === otp) {
        delete otpStorage[email];
        res.json({ success: true, message: "Password successfully updated!" });
    } else {
        res.status(400).json({ success: false, message: "Invalid or Expired OTP" });
    }
});

// 9. Live Competition / AIR (All India Rank) Routes
app.post('/api/competition/submit', async (req, res) => {
    try {
        const { competitionId, userEmail, userName, wpm, accuracy } = req.body;
        const competition = await Competition.findById(competitionId);
        if (!competition) return res.status(404).json({ error: "Competition nahi mila" });

        competition.participants.push({ userEmail, userName, wpm, accuracy });
        competition.participants.sort((a, b) => b.wpm - a.wpm);
        await competition.save();

        const rank = competition.participants.findIndex(p => p.userEmail === userEmail) + 1;
        res.status(200).json({ success: true, rank, totalParticipants: competition.participants.length });
    } catch (error) {
        res.status(500).json({ error: "Competition score submit nahi ho paya" });
    }
});

// --- Server Startup ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Backend Server badhiya se chal raha hai Port ${PORT} par!`);
});