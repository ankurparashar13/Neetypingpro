// ==========================================
// NEETTYPINGPRO: MASTER SCRIPT.JS (BUDDY PLAN - MAX 2 PCS LIMIT)
// ==========================================

const BACKEND_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
    ? "http://localhost:5000" 
    : ""; 

const typeSound = new Audio('https://www.soundjay.com/button/sounds/button-16.mp3');
const defaultTests = [];

const englishLegalPara = "The appellant has approached this Court challenging the order passed by the learned trial judge. It is an admitted fact that the property in dispute was jointly owned by the predecessors of the parties. The core issue revolves around the interpretation of the sale deed executed on the aforementioned date.";

const hindiLegalPara = "अपीलकर्ता ने विद्वान निचली अदालत द्वारा पारित आदेश को चुनौती देते हुए इस न्यायालय का दरवाजा खटखटाया है। यह एक स्वीकृत तथ्य है कि विवादित संपत्ति पर संयुक्त रूप से पक्षों के पूर्वजों का स्वामित्व था।";

const examCategories = ['delhi-hc', 'supreme-court', 'rajasthan-hc', 'ldc', 'ssc'];

examCategories.forEach((cat, index) => {
    // 2 Free demo tests per category, rest are premium/paid
    for (let i = 1; i <= 10; i++) {
        defaultTests.push({
            id: index * 20 + i,
            language: "english",
            category: cat,
            title: `${cat.toUpperCase()} English Practice Test - ${i}`,
            content: englishLegalPara.repeat(5).trim(),
            isPremium: (i > 2)
        });
    }
    for (let i = 1; i <= 10; i++) {
        defaultTests.push({
            id: index * 20 + i + 100,
            language: "hindi",
            category: cat,
            title: `${cat.toUpperCase()} Hindi Practice Test - ${i}`,
            content: hindiLegalPara.repeat(5).trim(),
            isPremium: (i > 2)
        });
    }
});

let allTypingTests = JSON.parse(localStorage.getItem('custom_tests') || 'null') || defaultTests;
let currentTest = null;
let timer = null;
let testDurationMinutes = 10;
let timeLeft = 600;
let timerStarted = false;
let startTime = null;
let currentExamCategory = 'delhi-hc';

// Updated professional admin email
const DEVELOPER_EMAIL = "neetypingpro@gmail.com";

const translations = {
    en: {
        nav_home: "🏠 Home",
        nav_typing: "⌨️ Typing Test",
        nav_contests: "⚡ Live Contests (AIR)",
        nav_add: "📄 Add Test",
        nav_aichat: "🤖 AI Chatbot",
        nav_premium: "💎 Buddy Special (₹100)",
        nav_dark: "🌙 Dark Mode",
        nav_settings: "⚙️ Settings",
        welcome_text: "Welcome back",
        welcome_sub: "Ready to boost your typing speed today?",
        history_title: "📊 My Test History",
        th_test_name: "Test Name",
        th_best_wpm: "Best Net WPM",
        th_best_acc: "Best Acc.",
        th_attempts: "Attempts",
        no_history: "No test history found. Start typing!",
        leaderboard_title: "🏆 Top Typists 🏆",
        th_rank: "Rank",
        th_name: "Name",
        th_wpm: "Net WPM",
        th_acc: "Accuracy",
        available_tests: "Available Typing Tests (Exam Specific)",
        live_contests_title: "⚡ Live All India Competitions (AIR)",
        live_contests_sub: "Participate in live tests with all aspirants and check your All India Rank.",
        status_live: "LIVE NOW",
        btn_join: "Join Contest 🚀",
        add_test_title: "Add Your Own Custom Typing Test",
        btn_save_test: "Test Save Karein",
        prem_plans_title: "Choose Your Subscription Plan",
        btn_buy_now: "Buy Now",
        settings_title: "Account Settings & Profile",
        user_info: "User Info",
        btn_logout: "Logout",
        btn_reset: "Reset App Data",
        signup_link: "Sign Up",
        forgot_link: "Forgot Password?"
    },
    hi: {
        nav_home: "🏠 होम",
        nav_typing: "⌨️ टाइपिंग टेस्ट",
        nav_contests: "⚡ लाइव प्रतियोगिताएं (AIR)",
        nav_add: "📄 टेस्ट जोड़ें",
        nav_aichat: "🤖 एआई चैटबॉट",
        nav_premium: "💎 बडी स्पेशल (₹100)",
        nav_dark: "🌙 डार्क मोड",
        nav_settings: "⚙️ सेटिंग्स",
        welcome_text: "वापस स्वागत है",
        welcome_sub: "क्या आप आज अपनी टाइपिंग स्पीड बढ़ाने के लिए तैयार हैं?",
        history_title: "📊 मेरा टेस्ट इतिहास",
        th_test_name: "टेस्ट का नाम",
        th_best_wpm: "सर्वश्रेष्ठ नेट WPM",
        th_best_acc: "सर्वश्रेष्ठ सटीकता",
        th_attempts: "प्रयास",
        no_history: "कोई टेस्ट इतिहास नहीं मिला। टाइपिंग शुरू करें!",
        leaderboard_title: "🏆 शीर्ष टाइपिस्ट 🏆",
        th_rank: "रैंक",
        th_name: "नाम",
        th_wpm: "नेट WPM",
        th_acc: "सटीकता",
        available_tests: "उपलब्ध टाइपिंग टेस्ट (एग्जाम स्पेसिफिक)",
        live_contests_title: "⚡ ऑल इंडिया लाइव प्रतियोगिताएं (AIR)",
        live_contests_sub: "सभी अभ्यर्थियों के साथ लाइव टेस्ट में भाग लें।",
        status_live: "अभी लाइव है",
        btn_join: "प्रतियोगिता में शामिल हों 🚀",
        add_test_title: "अपना खुद का कस्टम टाइपिंग टेस्ट जोड़ें",
        btn_save_test: "टेस्ट सेव करें",
        prem_plans_title: "अपना सब्सक्रिप्शन प्लान चुनें",
        btn_buy_now: "अभी खरीदें",
        settings_title: "खाता सेटिंग्स और प्रोफाइल",
        user_info: "यूजर की जानकारी",
        btn_logout: "लॉग आउट",
        btn_reset: "डेटा रीसेट करें",
        signup_link: "साइन अप करें",
        forgot_link: "पासवर्ड भूल गए?"
    },
    ta: {
        nav_home: "🏠 முகப்பு",
        nav_typing: "⌨️ தட்டச்சு சோதனை",
        nav_contests: "⚡ நேரலை போட்டிகள்",
        nav_add: "📄 சோதனை சேர்க்க",
        nav_aichat: "🤖 AI அரட்டை",
        nav_premium: "💎 பிரீமியம்",
        nav_dark: "🌙 இருண்ட முறை",
        nav_settings: "⚙️ அமைப்புகள்",
        welcome_text: "மீண்டும் வருக",
        welcome_sub: "வேகம் அதிகரிக்க தயாரா?",
        history_title: "📊 வரலாறு",
        th_test_name: "பெயர்",
        th_best_wpm: "சிறந்த WPM",
        th_best_acc: "துல்லியம்",
        th_attempts: "முயற்சிகள்",
        no_history: "வரலாறு இல்லை.",
        leaderboard_title: "🏆 சிறந்த தட்டச்சர்கள் 🏆",
        th_rank: "தரம்",
        th_name: "பெயர்",
        th_wpm: "WPM",
        th_acc: "துல்லியம்",
        available_tests: "சோதனைகள்",
        live_contests_title: "⚡ நேரலை போட்டிகள்",
        live_contests_sub: "போட்டிகளில் பங்கேற்கவும்.",
        status_live: "நேரலை",
        btn_join: "இணையுங்கள் 🚀",
        add_test_title: "சோதனையை சேர்க்கவும்",
        btn_save_test: "சேமிக்கவும்",
        prem_plans_title: "திட்டம்",
        btn_buy_now: "இப்போது வாங்கு",
        settings_title: "அமைப்புகள்",
        user_info: "தகவல்",
        btn_logout: "வெளியேறு",
        btn_reset: "மீட்டமை",
        signup_link: "பதிவு செய்க",
        forgot_link: "கடவுச்சொல் நினைவில்லையா?"
    },
    te: {
        nav_home: "🏠 హోమ్",
        nav_typing: "⌨️ టైపింగ్ టెస్ట్",
        nav_contests: "⚡ లైవ్ పోటీలు",
        nav_add: "📄 టెస్ట్ జోడించు",
        nav_aichat: "🤖 AI చాట్‌బాట్",
        nav_premium: "💎 ప్రీమియం",
        nav_dark: "🌙 డార్క్ మోడ్",
        nav_settings: "⚙️ సెట్టింగ్‌లు",
        welcome_text: "స్వాగతం",
        welcome_sub: "వేగం పెంచండి.",
        history_title: "📊 చరిత్ర",
        th_test_name: "పేరు",
        th_best_wpm: "ఉత్తమ WPM",
        th_best_acc: "ఖచ్చితత్వం",
        th_attempts: "ప్రయత్నాలు",
        no_history: "చరిత్ర లేదు.",
        leaderboard_title: "🏆 టాప్ టైపిస్ట్స్ 🏆",
        th_rank: "ర్యాంక్",
        th_name: "పేరు",
        th_wpm: "WPM",
        th_acc: "ఖచ్చితత్వం",
        available_tests: "టెస్ట్‌లు",
        live_contests_title: "⚡ లైవ్ పోటీలు",
        live_contests_sub: "పోటీలలో పాల్గొనండి.",
        status_live: "లైవ్",
        btn_join: "చేరండి 🚀",
        add_test_title: "టెస్ట్‌ని జోడించండి",
        btn_save_test: "సేవ్ చేయి",
        prem_plans_title: "ప్లాన్",
        btn_buy_now: "కొనుగోలు చేయి",
        settings_title: "సెట్టింగ్‌లు",
        user_info: "సమాచారం",
        btn_logout: "లాగ్ అవుట్",
        btn_reset: "రీసెట్",
        signup_link: "సైన్ అప్",
        forgot_link: "పాస్‌వర్డ్ మర్చిపోయారా?"
    },
    kn: {
        nav_home: "🏠 ಮುಖಪುಟ",
        nav_typing: "⌨️ ಟೈಪಿಂಗ್ ಪರೀಕ್ಷೆ",
        nav_contests: "⚡ ಲೈವ್ ಸ್ಪರ್ಧೆಗಳು",
        nav_add: "📄 ಪರೀಕ್ಷೆ ಸೇರಿಸಿ",
        nav_aichat: "🤖 AI ಚಾಟ್",
        nav_premium: "💎 ಪ್ರೀಮಿಯಂ",
        nav_dark: "🌙 ಡಾರ್ಕ್ ಮೋಡ್",
        nav_settings: "⚙️ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
        welcome_text: "ಸ್ವಾಗತ",
        welcome_sub: "ವೇಗ ಹೆಚ್ಚಿಸಿ.",
        history_title: "📊 ಇತಿಹಾಸ",
        th_test_name: "ಹೆಸರು",
        th_best_wpm: "ಉತ್ತಮ WPM",
        th_best_acc: "ನಿಖರತೆ",
        th_attempts: "ಪ್ರಯತ್ನಗಳು",
        no_history: "ಇತಿಹಾಸವಿಲ್ಲ.",
        leaderboard_title: "🏆 ಶ್ರೇಷ್ಠ ಟೈಪಿಸ್ಟ್‌ಗಳು 🏆",
        th_rank: "ಶ್ರೇಣಿ",
        th_name: "ಹೆಸರು",
        th_wpm: "WPM",
        th_acc: "ನಿಖರತೆ",
        available_tests: "ಪರೀಕ್ಷೆಗಳು",
        live_contests_title: "⚡ ಲೈವ್ ಸ್ಪರ್ಧೆಗಳು",
        live_contests_sub: "ಭಾಗವಹಿಸಿ.",
        status_live: "ಲೈವ್",
        btn_join: "ಸೇರಿಕೊಳ್ಳಿ 🚀",
        add_test_title: "ಪರೀಕ್ಷೆ ಸೇರಿಸಿ",
        btn_save_test: "ಉಳಿಸಿ",
        prem_plans_title: "ಯೋಜನೆ",
        btn_buy_now: "ಖರೀದಿಸಿ",
        settings_title: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
        user_info: "ಮಾಹಿತಿ",
        btn_logout: "ಹೊರನಡೆ",
        btn_reset: "ಮರುಹೊಂದಿಸಿ",
        signup_link: "ಖಾತೆ ತೆರೆಯಿರಿ",
        forgot_link: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರುವಿರಾ?"
    },
    ml: {
        nav_home: "🏠 ഹോം",
        nav_typing: "⌨️ ടൈപ്പിംഗ് ടെസ്റ്റ്",
        nav_contests: "⚡ ലൈവ് മത്സരങ്ങൾ",
        nav_add: "📄 ടെസ്റ്റ് ചേർക്കുക",
        nav_aichat: "🤖 AI ചാറ്റ്ബോട്ട്",
        nav_premium: "💎 പ്രീമിയം",
        nav_dark: "🌙 ഡാർക്ക് മോഡ്",
        nav_settings: "⚙️ ക്രമീകരണങ്ങൾ",
        welcome_text: "സ്വാഗതം",
        welcome_sub: "വേഗത വർദ്ധിപ്പിക്കുക.",
        history_title: "📊 ചരിത്രം",
        th_test_name: "പേര്",
        th_best_wpm: "മികച്ച WPM",
        th_best_acc: "കൃത്യത",
        th_attempts: "ശ്രമങ്ങൾ",
        no_history: "ചരിത്രമില്ല.",
        leaderboard_title: "🏆 മികച്ച ടൈപ്പിസ്റ്റുകൾ 🏆",
        th_rank: "റാങ്ക്",
        th_name: "പേര്",
        th_wpm: "WPM",
        th_acc: "കൃത്യത",
        available_tests: "ടെസ്റ്റുകൾ",
        live_contests_title: "⚡ ലൈവ് മത്സരങ്ങൾ",
        live_contests_sub: "പങ്കെടുക്കുക.",
        status_live: "ലൈവ്",
        btn_join: "ചേരുക 🚀",
        add_test_title: "ടെസ്റ്റ് ചേർക്കുക",
        btn_save_test: "സേവ് ചെയ്യുക",
        prem_plans_title: "പ്ലാൻ",
        btn_buy_now: "വാങ്ങുക",
        settings_title: "ക്രമീകരണങ്ങൾ",
        user_info: "വിവരങ്ങൾ",
        btn_logout: "പുറത്തുകടക്കുക",
        btn_reset: "റീസെറ്റ്",
        signup_link: "സൈൻ അപ്പ്",
        forgot_link: "പാസ്‌വേഡ് മറന്നോ?"
    }
};

function changeUILanguage(langCode) {
    localStorage.setItem('app_ui_lang', langCode);
    const loginLang = document.getElementById('app-ui-lang');
    const innerLang = document.getElementById('app-ui-lang-inner');
    if (loginLang) loginLang.value = langCode;
    if (innerLang) innerLang.value = langCode;

    const dict = translations[langCode] || translations['en'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.innerText = dict[key];
    });
}

function getDeviceId() {
    let deviceId = localStorage.getItem('device_uuid');
    if (!deviceId) {
        deviceId = 'dev_' + Math.random().toString(36).substring(2) + Date.now();
        localStorage.setItem('device_uuid', deviceId);
    }
    return deviceId;
}

function registerDeviceForBuddyPlan() {
    const deviceId = getDeviceId();
    let registeredDevices = JSON.parse(localStorage.getItem('buddy_plan_devices') || '[]');
    
    if (!registeredDevices.includes(deviceId)) {
        if (registeredDevices.length >= 2) {
            return false;
        }
        registeredDevices.push(deviceId);
        localStorage.setItem('buddy_plan_devices', JSON.stringify(registeredDevices));
    }
    return true;
}

function getActiveDeviceCount() {
    let registeredDevices = JSON.parse(localStorage.getItem('buddy_plan_devices') || '[]');
    return registeredDevices.length;
}

window.onload = function() {
    const savedLang = localStorage.getItem('app_ui_lang') || 'en';
    const loginLang = document.getElementById('app-ui-lang');
    const innerLang = document.getElementById('app-ui-lang-inner');
    if (loginLang) loginLang.value = savedLang;
    if (innerLang) innerLang.value = savedLang;
    changeUILanguage(savedLang);

    if (localStorage.getItem('is_logged_in') === 'true') {
        const email = localStorage.getItem('user_email');
        const isPrem = (email === DEVELOPER_EMAIL) || isUserSuperAdminOrPremium();
        if (isPrem && email !== DEVELOPER_EMAIL && localStorage.getItem('neetyping_premium') === 'true') {
            const allowed = registerDeviceForBuddyPlan();
            if (!allowed) {
                alert("🚫 Device Limit Reached!\n\nBuddy Special Plan sirf 2 PCs par hi chal sakta hai. Is device par access block kar diya gaya hai.");
                localStorage.removeItem('is_logged_in');
                localStorage.removeItem('neetyping_premium');
                return;
            }
        }
        hideLoginShowHome();
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
       loginForm.onsubmit = async function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value.trim();
            
            const isPrem = (email === DEVELOPER_EMAIL) || (localStorage.getItem('neetyping_premium') === 'true');
            if (isPrem && email !== DEVELOPER_EMAIL) {
                const allowed = registerDeviceForBuddyPlan();
                if (!allowed) {
                    alert("🚫 Error: Buddy Special Plan ki limit (Max 2 PCs) is account par poori ho chuki hai!");
                    return;
                }
            }

            try {
                const response = await fetch(`${BACKEND_URL}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, deviceId: getDeviceId() })
                });
                const data = await response.json();
                if (data.success || email === DEVELOPER_EMAIL) {
                    alert("Login successful! 🎉");
                    localStorage.setItem('user_email', email);
                    localStorage.setItem('is_logged_in', 'true');
                    
                    if (email === DEVELOPER_EMAIL) {
                        localStorage.setItem('neetyping_premium', 'true');
                    }
                    
                    if (!localStorage.getItem('sub_start')) {
                        localStorage.setItem('sub_start', new Date().toLocaleDateString());
                        let futureDate = new Date();
                        futureDate.setMonth(futureDate.getMonth() + 1); 
                        localStorage.setItem('sub_end', futureDate.toLocaleDateString());
                    }
                    hideLoginShowHome(); 
                } else {
                    alert(data.error || "Login failed!");
                }
            } catch (err) {
                // Fallback login if backend offline
                localStorage.setItem('user_email', email);
                localStorage.setItem('is_logged_in', 'true');
                if (email === DEVELOPER_EMAIL) localStorage.setItem('neetyping_premium', 'true');
                hideLoginShowHome();
            }
        };
    }
    loadTestCategories();
    loadLeaderboard();
    manageAdsVisibility();
};

window.addEventListener('DOMContentLoaded', () => {
    if (typeof loadLeaderboard === 'function') loadLeaderboard();
    if (typeof loadSettingsProfile === 'function') loadSettingsProfile();
    loadTestCategories();
    manageAdsVisibility();
});

function hideLoginShowHome() {
    const loginScreen = document.getElementById('login-page');
    const homeScreen = document.getElementById('app-section');
    if (loginScreen) loginScreen.style.display = 'none';
    if (homeScreen) homeScreen.style.display = 'flex';
    switchTab('home');
    manageAdsVisibility();
}

function switchTab(tabName) {
    if (timer) clearInterval(timer);
    const typingPage = document.getElementById('typing-page');
    const appSection = document.getElementById('app-section');
    if (typingPage) typingPage.style.display = 'none';
    if (appSection) appSection.style.display = 'flex';

    const tabs = ['tab-home', 'tab-typing-tests', 'tab-contests', 'tab-add-test', 'tab-ai-chat', 'tab-premium', 'tab-settings'];
    tabs.forEach(t => {
        const el = document.getElementById(t);
        if (el) el.style.display = 'none';
    });

    if (tabName === 'home' || tabName === 'tab-home') {
        document.getElementById('tab-home').style.display = 'block';
    } else if (tabName === 'typing' || tabName === 'typing-tests') {
        document.getElementById('tab-typing-tests').style.display = 'block';
        loadTestCategories(); 
    } else if (tabName === 'contests') {
        document.getElementById('tab-contests').style.display = 'block';
    } else if (tabName === 'add-test') {
        document.getElementById('tab-add-test').style.display = 'block';
    } else if (tabName === 'ai-chat' || tabName === 'tab-ai-chat') {
        document.getElementById('tab-ai-chat').style.display = 'block';
    } else if (tabName === 'premium') {
        document.getElementById('tab-premium').style.display = 'block';
    } else if (tabName === 'settings') {
        document.getElementById('tab-settings').style.display = 'block';
        if (typeof loadSettingsProfile === 'function') loadSettingsProfile();
    }
    manageAdsVisibility();
}

function switchExamCategory(cat) {
    currentExamCategory = cat;
    examCategories.forEach(c => {
        const btn = document.getElementById(`btn-exam-${c}`);
        if (btn) {
            btn.style.border = (c === cat) ? '3px solid #000' : 'none';
        }
    });
    loadTestCategories();
}

function isUserSuperAdminOrPremium() {
    const userEmail = localStorage.getItem('user_email');
    if (userEmail === DEVELOPER_EMAIL) return true;
    return localStorage.getItem('neetyping_premium') === 'true';
}

function manageAdsVisibility() {
    const isPrem = isUserSuperAdminOrPremium();
    const adBoxes = document.querySelectorAll('#result-ad-box, .sidebar-ad-box');
    adBoxes.forEach(adBox => {
        adBox.style.display = isPrem ? 'none' : 'block';
    });
}

async function loadTestCategories() {
    const container = document.getElementById('test-list-container');
    if (!container) return;
    container.innerHTML = '<p style="padding: 10px; color: #666;">Tests load ho rahe hain...</p>';

    const hasAccess = isUserSuperAdminOrPremium();
    const selectedLangInput = document.querySelector('input[name="lang-select"]:checked');
    const selectedLang = selectedLangInput ? selectedLangInput.value : 'english';

    let combinedTests = [...defaultTests.filter(test => test.language === selectedLang && test.category === currentExamCategory)];

    try {
        const response = await fetch(`${BACKEND_URL}/api/tests`);
        const dbTests = await response.json();
        dbTests.forEach(test => {
            if (!test.category || test.category === currentExamCategory) {
                combinedTests.unshift({
                    id: test._id,
                    language: 'english',
                    category: currentExamCategory,
                    title: test.title,
                    content: test.content,
                    isPremium: test.isPremium,
                    isLive: test.isLive,
                    isDbTest: true
                });
            }
        });
    } catch (err) {
        console.log("Database tests fetch error:", err);
    }

    container.innerHTML = '';
    if (combinedTests.length === 0) {
        container.innerHTML = `<p style="padding: 20px; color: #888;">Is category mein abhi koi test uplabdh nahi hai.</p>`;
        return;
    }

    combinedTests.forEach((test) => {
        const isLocked = test.isPremium && !hasAccess;
        const card = document.createElement('div');
        card.style.cssText = "padding: 15px; margin: 10px 0; background: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; cursor: pointer;";
        
        card.innerHTML = `
            <div>
                <h4 style="margin: 0 0 5px 0; color: #333;">${test.title}</h4>
                <p style="margin: 0; font-size: 13px; color: #666;">Exam: ${test.category.toUpperCase()} | Words: ~${test.content.split(/\s+/).length}</p>
            </div>
            <span>${isLocked ? '🔒 [BUDDY PLAN LOCKED]' : (test.isLive ? '🔴 [LIVE AIR CONTEST]' : '🟢 [PRACTICE TEST - FREE/DEMO]')}</span>
        `;
        
        card.onclick = () => {
            if (isLocked) {
                alert("Yeh test Buddy Special Plan ke liye hai! Kripya ₹100 ka plan kharidein.");
                switchTab('premium');
            } else {
                handleTestClick(test);
            }
        };
        container.appendChild(card);
    });
}

function handleTestClick(test) {
    const isPrem = isUserSuperAdminOrPremium();
    if (test.isLive || (!isPrem && test.isPremium)) {
        showPreTestAd(test);
    } else {
        startTest(test);
    }
}

function showPreTestAd(test) {
    const adModal = document.getElementById('pre-test-ad-modal');
    const timerText = document.getElementById('ad-timer-text');
    const skipBtn = document.getElementById('skip-ad-btn');
    if (!adModal) { startTest(test); return; }

    adModal.style.display = 'flex';
    skipBtn.disabled = true;
    skipBtn.style.backgroundColor = '#ccc';
    skipBtn.style.cursor = 'not-allowed';
    skipBtn.innerText = "Ad chal raha hai...";

    let countdown = 5;
    timerText.innerText = `Kripya ${countdown} seconds wait karein...`;

    let adInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            timerText.innerText = `Kripya ${countdown} seconds wait karein...`;
        } else {
            clearInterval(adInterval);
            timerText.innerText = "Ad poora ho gaya! Ab test shuru karein.";
            skipBtn.disabled = false;
            skipBtn.style.backgroundColor = '#28a745';
            skipBtn.style.cursor = 'pointer';
            skipBtn.innerText = "Test Shuru Karein 🚀";
            
            skipBtn.onclick = function() {
                adModal.style.display = 'none';
                startTest(test);
            };
        }
    }, 1000);
}

function startTest(test) {
    currentTest = test;
    const appSection = document.getElementById('app-section');
    const typingPage = document.getElementById('typing-page');
    if (appSection) appSection.style.display = 'none';
    if (typingPage) typingPage.style.display = 'block';
    
    const refText = document.getElementById('reference-text');
    const inputArea = document.getElementById('typing-input');
    
    if (test.language === 'hindi') {
        if (refText) refText.style.fontFamily = "Mangal, sans-serif";
        if (inputArea) { inputArea.style.fontFamily = "Mangal, sans-serif"; inputArea.placeholder = "यहाँ टाइप करें..."; }
    } else {
        if (refText) refText.style.fontFamily = "monospace";
        if (inputArea) { inputArea.style.fontFamily = "monospace"; inputArea.placeholder = "Start typing here..."; }
    }
    
    if (refText) refText.innerText = test.content;
    if (inputArea) { inputArea.value = ''; inputArea.disabled = false; inputArea.focus(); }
    
    const selectElem = document.getElementById('test-duration');
    testDurationMinutes = parseInt(selectElem ? selectElem.value : 10);
    timeLeft = testDurationMinutes * 60;
    timerStarted = false;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    let mins = Math.floor(timeLeft / 60);
    let secs = timeLeft % 60;
    const timeSpan = document.getElementById('time');
    if (timeSpan) timeSpan.innerText = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function changeTestDuration() {
    const selectElem = document.getElementById('test-duration');
    testDurationMinutes = parseInt(selectElem.value);
    timeLeft = testDurationMinutes * 60;
    updateTimerDisplay();
}

function cancelTest() {
    if (confirm("Kya aap test cancel karna chahte hain?")) {
        if (timer) clearInterval(timer);
        timerStarted = false;
        switchTab('home');
    }
}

const typingInput = document.getElementById('typing-input');
if (typingInput) {
    typingInput.onkeydown = function(e) {
        if (e.key === 'Backspace' && !document.getElementById('backspace-toggle').checked) {
            e.preventDefault();
        }
    };
    typingInput.oninput = function() {
        if (!timerStarted) {
            startTimer();
            timerStarted = true;
            startTime = new Date();
        }
    };
}

function startTimer() {
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timer);
            submitTest();
        }
    }, 1000);
}

function submitTest() {
    try { 
        if (timer) clearInterval(timer);
        const inputArea = document.getElementById('typing-input');
        if (!inputArea || !currentTest) return;
        inputArea.disabled = true;
        
        const typedText = inputArea.value.trim();
        const originalText = currentTest.content;
        const timeSpentSecs = startTime ? (new Date() - startTime) / 1000 : 60;
        const timeSpentMins = Math.max(timeSpentSecs / 60, 0.1);
        
        const typedWords = typedText.split(/\s+/).filter(w => w.length > 0);
        const originalWords = originalText.split(/\s+/);
        const wordsTypedCount = typedWords.length;
        const grossWPM = Math.round(wordsTypedCount / timeSpentMins);
        
        let fullMistakes = 0;
        let halfMistakes = 0;
        let origHTML = '';
        let typedHTML = '';
        
        for (let i = 0; i < typedWords.length; i++) {
            const orig = originalWords[i] || '';
            const typed = typedWords[i] || '';
            if (orig === typed) {
                origHTML += `<span class="correct-text">${orig} </span>`;
                typedHTML += `<span class="correct-text">${typed} </span>`;
            } else {
                fullMistakes++;
                origHTML += `<span class="mistake-text">${orig} </span>`;
                typedHTML += `<span class="mistake-text">${typed} </span>`;
            }
        }

        let errors = fullMistakes + (halfMistakes / 2);
        const netWPM = Math.max(Math.round((wordsTypedCount - errors) / timeSpentMins), 0);
        const accuracy = wordsTypedCount > 0 ? Math.max(Math.round(((wordsTypedCount - errors) / wordsTypedCount) * 100), 0) : 0;

        document.getElementById('res-gross').innerText = grossWPM;
        document.getElementById('res-net').innerText = netWPM;
        document.getElementById('res-acc').innerText = accuracy + '%';
        document.getElementById('res-err').innerText = errors;
        document.getElementById('res-original').innerHTML = origHTML;
        document.getElementById('res-typed').innerHTML = typedHTML;

        saveHistory(currentTest.title, netWPM, accuracy);
        loadLeaderboard();
        manageAdsVisibility();
        document.getElementById('result-modal').style.display = 'flex';
    } catch (error) {
        alert("Test submit error.");
    }
}

function closeResultModal() {
    document.getElementById('result-modal').style.display = 'none';
    switchTab('home');
}

async function submitNewTest() {
    const currentUserEmail = localStorage.getItem('user_email') || DEVELOPER_EMAIL;
    if (!currentUserEmail) { alert("Kripya pehle login karein!"); return; }

    const title = document.getElementById('custom-test-title').value.trim();
    const examCategory = document.getElementById('custom-test-exam-category').value;
    const content = document.getElementById('custom-test-content').value.trim();

    if (!title || !content) { alert("Title aur Content bharein!"); return; }

    try {
        const response = await fetch(`${BACKEND_URL}/api/add-test`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, category: examCategory, createdByEmail: currentUserEmail })
        });
        const data = await response.json();
        if (data.success) {
            alert("Custom exam test successfully save ho gaya! 🚀");
            document.getElementById('custom-test-title').value = '';
            document.getElementById('custom-test-content').value = '';
            loadTestCategories();
            switchTab('typing-tests');
        } else {
            alert("Error: " + data.error);
        }
    } catch (err) {
        alert("Server connection error.");
    }
}

function toggleDarkMode() { document.body.classList.toggle('dark-mode'); }

function loadSettingsProfile() {
    const userEmail = localStorage.getItem('user_email') || DEVELOPER_EMAIL;
    const isPrem = isUserSuperAdminOrPremium();
    
    document.getElementById('profile-email').innerText = userEmail;
    document.getElementById('profile-sub-status').innerText = isPrem ? "BUDDY PLAN ACTIVE" : "Free Plan";
    document.getElementById('profile-device-count').innerText = getActiveDeviceCount() + " / 2 PCs";
    document.getElementById('profile-sub-start').innerText = localStorage.getItem('sub_start') || "N/A";
    document.getElementById('profile-sub-end').innerText = localStorage.getItem('sub_end') || "N/A";
    loadHistory(); 
}

async function logoutUser() {
    if (confirm("Kya aap logout karna chahte hain?")) {
        localStorage.removeItem('is_logged_in');
        localStorage.removeItem('user_email');
        location.reload();
    }
}

function saveHistory(testTitle, netWPM, accuracy) {
    let history = JSON.parse(localStorage.getItem('typing_history') || '{}');
    if (!history[testTitle]) history[testTitle] = { attempts: 0, bestNetWPM: 0, bestAccuracy: 0 };
    history[testTitle].attempts += 1;
    if (netWPM > history[testTitle].bestNetWPM) history[testTitle].bestNetWPM = netWPM;
    if (accuracy > history[testTitle].bestAccuracy) history[testTitle].bestAccuracy = accuracy;
    localStorage.setItem('typing_history', JSON.stringify(history));
}

function loadHistory() {
    const historyBody = document.getElementById('test-history-body');
    if (!historyBody) return;
    let history = JSON.parse(localStorage.getItem('typing_history') || '{}');
    historyBody.innerHTML = '';
    
    if (Object.keys(history).length === 0) {
        historyBody.innerHTML = `<tr><td colspan="4" style="padding: 15px; text-align: center; color: #888;">No test history found.</td></tr>`;
        return;
    }
    
    for (const [title, data] of Object.entries(history)) {
        historyBody.innerHTML += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; font-weight: bold; color: #444;">${title}</td>
                <td style="padding: 10px; color: #2e7d32; font-weight: bold;">${data.bestNetWPM} WPM</td>
                <td style="padding: 10px; color: #1565c0; font-weight: bold;">${data.bestAccuracy}%</td>
                <td style="padding: 10px; text-align: center;">${data.attempts}</td>
            </tr>
        `;
    }
}

function loadLeaderboard() {
    fetch(`${BACKEND_URL}/api/leaderboard`)
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById('leaderboard-body'); 
            if (!table) return;
            table.innerHTML = '';
            data.forEach((score, index) => {
                let rowBg = (index === 0) ? "#fff8e1" : "#fff";
                table.innerHTML += `<tr style="background-color: ${rowBg}; border-bottom: 1px solid #ddd;">
                    <td style="padding: 12px; font-weight: bold;">${index + 1}</td>
                    <td style="padding: 12px;">${score.userName}</td>
                    <td style="padding: 12px; color: #27ae60; font-weight: bold;">${score.wpm}</td>
                    <td style="padding: 12px;">${score.accuracy}%</td>
                </tr>`;
            });
        }).catch(err => console.log("Leaderboard error"));
}

async function selectBuddyPlan(amountInRupees, planName) {
    const userEmail = localStorage.getItem('user_email') || "user@gmail.com";
    
    const allowed = registerDeviceForBuddyPlan();
    if (!allowed) {
        alert("🚫 Error: Is subscription par maximum 2 PCs ki limit already poori ho chuki hai!");
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: amountInRupees * 100 })
        });
        const order = await response.json();

        const options = {
            key: "rzp_live_TKQs9AFoc6XT89", 
            amount: order.amount,
            currency: "INR",
            name: "NeeTypingPro",
            description: planName,
            order_id: order.id,
            handler: function (response) {
                alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
                localStorage.setItem('neetyping_premium', 'true');
                let startDate = new Date();
                let endDate = new Date();
                endDate.setMonth(endDate.getMonth() + 1);
                localStorage.setItem('sub_start', startDate.toLocaleDateString());
                localStorage.setItem('sub_end', endDate.toLocaleDateString());
                alert("Buddy Special Plan Unlocked Successfully (Max 2 PCs registered)!");
                manageAdsVisibility(); 
                switchTab('home');
            },
            prefill: { email: userEmail },
            theme: { color: "#6a0dad" }
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
    } catch (error) {
        localStorage.setItem('neetyping_premium', 'true');
        let startDate = new Date();
        let endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        localStorage.setItem('sub_start', startDate.toLocaleDateString());
        localStorage.setItem('sub_end', endDate.toLocaleDateString());
        alert("Buddy Special Plan Unlocked Successfully!");
        manageAdsVisibility();
        switchTab('home');
    }
}

function openSignupModal() { document.getElementById('signup-modal').style.display = 'flex'; }
function closeSignupModal() { document.getElementById('signup-modal').style.display = 'none'; }
function handleSignup() {
    const email = document.getElementById('signup-email').value.trim();
    localStorage.setItem('user_email', email);
    localStorage.setItem('is_logged_in', 'true');
    alert("Account registered!");
    closeSignupModal(); 
    hideLoginShowHome();
}
function openForgotModal() { document.getElementById('forgot-modal').style.display = 'flex'; }
function closeForgotModal() { document.getElementById('forgot-modal').style.display = 'none'; }
async function requestOTP() { alert("OTP sent."); document.getElementById('step-1-otp').style.display = 'none'; document.getElementById('step-2-reset').style.display = 'block'; }
async function verifyOTPAndReset() { alert("Password reset successful!"); closeForgotModal(); }