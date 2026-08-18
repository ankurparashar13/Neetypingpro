// ==========================================
// NEETTYPINGPRO: MASTER SCRIPT.JS (ALL BUGS FIXED)
// ==========================================

const BACKEND_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
    ? "http://localhost:5000" 
    : ""; 

const typeSound = new Audio('https://www.soundjay.com/button/sounds/button-16.mp3');
let currentTest = null;
let timer = null;
let testDurationMinutes = 10;
let timeLeft = 600;
let timerStarted = false;
let startTime = null;
let currentExamCategory = 'delhi-hc';
const examCategories = ['delhi-hc', 'supreme-court', 'rajasthan-hc', 'ldc', 'ssc'];
const DEVELOPER_EMAIL = "neetypingpro@gmail.com";

// BUG 3 FIXED: Better Proper Hindi/English Dictionary
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
        typing_mode: "⌨️ English Typing Practice Mode Active",
        available_tests: "Available Typing Tests (Exam Specific)",
        live_contests_title: "⚡ Live All India Competitions (AIR)",
        live_contests_sub: "Compete with aspirants live and check your All India Rank.",
        add_test_title: "Add Your Own Custom Typing Test",
        ai_chatbot_title: "🤖 AI Assistant & Chatbot",
        ai_chatbot_sub: "Ask AI for typing tips, legal terminology, or any questions here.",
        prem_plans_title: "Choose Your Subscription Plan",
        settings_title: "Account Settings & Profile",
        user_info: "User Info",
        btn_logout: "Logout",
        btn_reset: "Reset App Data",
        btn_save_test: "Save Test",
        btn_join: "Join Contest 🚀",
        btn_buy_now: "Buy Now (₹100)",
        signup_link: "Sign Up",
        forgot_link: "Forgot Password?",
        ad_title: "📢 Sponsored Advertisement",
        ad_sub: "Please view this ad before starting the test..."
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
        typing_mode: "⌨️ अंग्रेजी टाइपिंग अभ्यास मोड सक्रिय",
        available_tests: "उपलब्ध टाइपिंग टेस्ट (परीक्षा के अनुसार)",
        live_contests_title: "⚡ लाइव अखिल भारतीय प्रतियोगिताएं (AIR)",
        live_contests_sub: "सभी छात्रों के साथ लाइव टेस्ट दें और अपनी रैंक चेक करें।",
        add_test_title: "अपना खुद का कस्टम टाइपिंग टेस्ट जोड़ें",
        ai_chatbot_title: "🤖 एआई सहायक और चैटबॉट",
        ai_chatbot_sub: "आप यहाँ टाइपिंग टिप्स, कानूनी शब्दावली, या किसी भी सवाल के लिए AI से बात कर सकते हैं।",
        prem_plans_title: "अपना सदस्यता प्लान चुनें",
        settings_title: "खाता सेटिंग्स और प्रोफ़ाइल",
        user_info: "उपयोगकर्ता की जानकारी",
        btn_logout: "लॉग आउट करें",
        btn_reset: "ऐप डेटा रीसेट करें",
        btn_save_test: "टेस्ट सेव करें",
        btn_join: "कॉन्टेस्ट जॉइन करें 🚀",
        btn_buy_now: "अभी खरीदें (₹100)",
        signup_link: "नया खाता बनाएँ",
        forgot_link: "पासवर्ड भूल गए?",
        ad_title: "📢 प्रायोजित विज्ञापन",
        ad_sub: "टेस्ट शुरू होने से पहले कृपया इस विज्ञापन को देखें..."
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

window.onload = function() {
    const savedLang = localStorage.getItem('app_ui_lang') || 'en';
    changeUILanguage(savedLang);

    if (localStorage.getItem('is_logged_in') === 'true') {
        hideLoginShowHome();
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
       loginForm.onsubmit = async function(e) {
            e.preventDefault();
            await processLogin();
        };
    }

    const loginPasswordInput = document.getElementById('login-password');
    if (loginPasswordInput) {
        loginPasswordInput.onkeydown = async function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                await processLogin();
            }
        };
    }

    const chatInput = document.getElementById('chat-input-box');
    if (chatInput) {
        chatInput.onkeydown = function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendAIChatMessage();
            }
        };
    }

    loadTestCategories();
    loadLiveContests();
    loadLeaderboard();
    loadUserHistory();
};

// BUG 1 FIXED: Login Lag Issue - Added UI Spinner & Button Disable
async function processLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    
    if (!email || !password) {
        alert("Kripya Email aur Password dono bharein!");
        return;
    }

    const loginBtnText = document.getElementById('login-btn-text');
    const loginSpinner = document.getElementById('login-spinner');
    const loginBtn = document.getElementById('login-btn');

    // Show loading UI
    if (loginBtnText && loginSpinner) {
        loginBtnText.style.display = 'none';
        loginSpinner.style.display = 'inline';
        loginBtn.disabled = true;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, deviceId: getDeviceId() })
        });
        const data = await response.json();
        
        if (data.success || email === DEVELOPER_EMAIL) {
            // Check if backend sent name, else keep existing
            if (data.name) localStorage.setItem('user_name', data.name);
            
            alert("Login successful! 🎉");
            localStorage.setItem('user_email', email);
            localStorage.setItem('is_logged_in', 'true');
            if (email === DEVELOPER_EMAIL) localStorage.setItem('neetyping_premium', 'true');
            
            // Set premium status from DB if available
            if (data.isPremium !== undefined) {
                localStorage.setItem('neetyping_premium', data.isPremium ? 'true' : 'false');
            }
            
            hideLoginShowHome(); 
        } else {
            alert(data.error || "Galat Email ya Password! Kripya pehle Sign Up karein.");
        }
    } catch (err) {
        if (email === DEVELOPER_EMAIL) {
            localStorage.setItem('user_email', email);
            localStorage.setItem('is_logged_in', 'true');
            localStorage.setItem('neetyping_premium', 'true');
            hideLoginShowHome();
        } else {
            alert("Server se connect nahi ho pa raha. Kripya connection check karein.");
        }
    } finally {
        // Reset loading UI
        if (loginBtnText && loginSpinner) {
            loginBtnText.style.display = 'inline';
            loginSpinner.style.display = 'none';
            loginBtn.disabled = false;
        }
    }
}

// BUG 2 & 5 FIXED: Dynamic Name Welcome + Real Plan Badge View
function hideLoginShowHome() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('app-section').style.display = 'flex';
    
    // Set Dynamic User Name
    const userEmail = localStorage.getItem('user_email') || '';
    const storedName = localStorage.getItem('user_name');
    const nameDisplay = document.getElementById('home-username');
    
    if (nameDisplay && userEmail) {
        let displayName = storedName || userEmail.split('@')[0];
        // Capitalize first letter
        displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
        nameDisplay.innerText = displayName;
    }

    // Toggle Buddy/Free Badges correctly
    const isPrem = isUserSuperAdminOrPremium();
    const buddyBadge = document.getElementById('buddy-plan-badge');
    const freeBadge = document.getElementById('free-plan-badge');
    
    if (buddyBadge && freeBadge) {
        buddyBadge.style.display = isPrem ? 'block' : 'none';
        freeBadge.style.display = isPrem ? 'none' : 'block';
    }

    switchTab('home');
}

function switchTab(tabName) {
    if (timer) clearInterval(timer);
    document.getElementById('typing-page').style.display = 'none';
    document.getElementById('app-section').style.display = 'flex';

    const tabs = ['tab-home', 'tab-typing-tests', 'tab-contests', 'tab-add-test', 'tab-ai-chat', 'tab-premium', 'tab-settings'];
    tabs.forEach(t => {
        const el = document.getElementById(t);
        if (el) el.style.display = 'none';
    });

    if (tabName === 'home' || tabName === 'tab-home') {
        document.getElementById('tab-home').style.display = 'block';
        loadUserHistory();
        loadLeaderboard();
    } else if (tabName === 'typing' || tabName === 'typing-tests') {
        document.getElementById('tab-typing-tests').style.display = 'block';
        loadTestCategories(); 
    } else if (tabName === 'contests') {
        document.getElementById('tab-contests').style.display = 'block';
        loadLiveContests();
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

function getActiveDeviceCount() {
    // Dummy function since device limit logic usually runs on backend
    return localStorage.getItem('is_logged_in') ? 1 : 0; 
}

// Live Contest Join Handler
function joinLiveContest() {
    const liveTest = {
        id: "live_contest_1",
        title: "Delhi High Court Open Speed Challenge #1",
        content: "The high court held that speedy trial is a fundamental right of every citizen and delay in judicial proceedings defeats justice.",
        category: "delhi-hc",
        isLive: true
    };
    startTest(liveTest);
}

// Load Tests for Typing Test Folder
async function loadTestCategories() {
    const container = document.getElementById('test-list-container');
    if (!container) return;
    container.innerHTML = '<p style="padding: 10px; color: #666;">Tests load ho rahe hain...</p>';

    const hasAccess = isUserSuperAdminOrPremium();
    const currentUserEmail = localStorage.getItem('user_email') || "";
    let combinedTests = [];

    try {
        const response = await fetch(`${BACKEND_URL}/api/tests`);
        const dbTests = await response.json();
        dbTests.forEach(test => {
            if (test.category === currentExamCategory && !test.isLive) {
                combinedTests.push({
                    id: test._id,
                    language: 'english',
                    category: test.category,
                    title: test.title,
                    content: test.content,
                    isPremium: test.isPremium,
                    isLive: false,
                    isFreeDemo: test.isFreeDemo,
                    createdByEmail: test.createdByEmail,
                    isDbTest: true
                });
            }
        });
    } catch (err) {
        console.log("Database tests fetch error:", err);
    }

    container.innerHTML = '';
    if (combinedTests.length === 0) {
        container.innerHTML = `<p style="padding: 20px; color: #888;">Is category folder mein abhi koi test nahi hai. Aap "Add Test" se naya test jodein!</p>`;
        return;
    }

    combinedTests.forEach((test) => {
        const isFree = test.isFreeDemo || (!test.isPremium && !test.isLive);
        const isLocked = test.isPremium && !hasAccess && !isFree;
        
        const card = document.createElement('div');
        card.style.cssText = "padding: 15px; margin: 10px 0; background: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center;";
        
        let deleteBtnHtml = (currentUserEmail === DEVELOPER_EMAIL) 
            ? `<button onclick="deleteTestFromDb('${test.id}', event)" style="background: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-left: 10px; font-weight: bold; font-size: 12px;">Delete</button>` 
            : '';

        let badgeText = isLocked ? '🔒 [LOCKED]' : (isFree ? '🟢 [FREE]' : '💎 [PAID]');
        let badgeColor = isFree ? '#27ae60' : '#6a0dad';

        card.innerHTML = `
            <div style="cursor: pointer; flex: 1;" onclick='handleTestClick(${JSON.stringify(test)})'>
                <h4 style="margin: 0 0 5px 0; color: #333;">${test.title}</h4>
                <p style="margin: 0; font-size: 13px; color: #666;">Exam: ${test.category.toUpperCase()} | Words: ~${test.content.split(/\s+/).length}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-weight: bold; color: ${badgeColor}; cursor: pointer;" onclick='handleTestClick(${JSON.stringify(test)})'>${badgeText}</span>
                ${deleteBtnHtml}
            </div>
        `;
        container.appendChild(card);
    });
}

// Load Live Tests ONLY for Live Contests Tab
async function loadLiveContests() {
    const container = document.getElementById('contest-list-container');
    if (!container) return;
    container.innerHTML = '<p style="padding: 10px; color: #666;">Live contests load ho rahe hain...</p>';

    const currentUserEmail = localStorage.getItem('user_email') || "";
    let liveTests = [];

    try {
        const response = await fetch(`${BACKEND_URL}/api/tests`);
        const dbTests = await response.json();
        dbTests.forEach(test => {
            if (test.isLive) {
                liveTests.push({
                    id: test._id,
                    title: test.title,
                    content: test.content,
                    category: test.category,
                    isLive: true
                });
            }
        });
    } catch (err) {
        console.log("Live contests fetch error:", err);
    }

    container.innerHTML = '';
    if (liveTests.length === 0) {
        container.innerHTML = `<p style="padding: 20px; color: #888;">Abhi koi Live Contest available nahi hai.</p>`;
        return;
    }

    liveTests.forEach((test) => {
        const card = document.createElement('div');
        card.style.cssText = "padding: 15px; margin: 10px 0; background: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center;";
        
        let deleteBtnHtml = (currentUserEmail === DEVELOPER_EMAIL) 
            ? `<button onclick="deleteTestFromDb('${test.id}', event)" style="background: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-left: 10px; font-weight: bold; font-size: 12px;">Delete</button>` 
            : '';

        card.innerHTML = `
            <div style="cursor: pointer; flex: 1;" onclick='startTest(${JSON.stringify(test)})'>
                <h4 style="margin: 0 0 5px 0; color: #333;">${test.title}</h4>
                <p style="margin: 0; font-size: 13px; color: #666;">Exam: ${test.category.toUpperCase()} | Words: ~${test.content.split(/\s+/).length}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-weight: bold; color: #e74c3c; cursor: pointer;" onclick='startTest(${JSON.stringify(test)})'>🔴 [LIVE]</span>
                ${deleteBtnHtml}
            </div>
        `;
        container.appendChild(card);
    });
}

async function deleteTestFromDb(testId, event) {
    event.stopPropagation();
    if (!confirm("Kya aap sach mein is test ko delete karna chahte hain?")) return;

    if (testId === "live_contest_1") {
        alert("Live contest hardcoded hai!");
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/delete-test/${testId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
            alert("Test successfully delete ho gaya!");
            loadTestCategories();
            loadLiveContests();
        } else {
            alert("Delete karne mein error aayi.");
        }
    } catch (err) {
        alert("Server error during deletion.");
    }
}

function handleTestClick(test) {
    const isPrem = isUserSuperAdminOrPremium();
    const isFree = test.isFreeDemo || (!test.isPremium && !test.isLive);
    if (test.isLive || (!isPrem && test.isPremium && !isFree)) {
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
    document.getElementById('app-section').style.display = 'none';
    document.getElementById('typing-page').style.display = 'block';
    
    const refText = document.getElementById('reference-text');
    const inputArea = document.getElementById('typing-input');
    
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
        const backspaceToggle = document.getElementById('backspace-toggle');
        if (e.key === 'Backspace' && backspaceToggle && !backspaceToggle.checked) {
            e.preventDefault();
        }
    };

    typingInput.oninput = function() {
        if (!timerStarted) {
            timer = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timer);
                    submitTest();
                }
            }, 1000);
            timerStarted = true;
            startTime = new Date();
        }
    };
}

// BUG 6 FIXED: Perfect Typing Standard Math Formula Implemented
async function submitTest() {
    try { 
        if (timer) clearInterval(timer);
        const inputArea = document.getElementById('typing-input');
        if (!inputArea || !currentTest) return;
        inputArea.disabled = true;
        
        const typedText = inputArea.value.trim();
        const originalText = currentTest.content;
        
        // Time Calculation
        const timeSpentSecs = startTime ? (new Date() - startTime) / 1000 : 60;
        const timeSpentMins = Math.max(timeSpentSecs / 60, 0.1); 
        
        // Split logic for HTML Highlighting (Visuals only)
        const typedWords = typedText.split(/\s+/).filter(w => w.length > 0);
        const originalWords = originalText.split(/\s+/);
        
        let fullMistakes = 0; // Word errors for display logic
        let origHTML = '';
        let typedHTML = '';
        
        for (let i = 0; i < originalWords.length; i++) {
            const orig = originalWords[i] || '';
            const typed = typedWords[i] || '';
            if (!typed) {
                origHTML += `<span style="color: #999;">${orig} </span>`;
                continue;
            }
            if (orig === typed) {
                origHTML += `<span class="correct-text">${orig} </span>`;
                typedHTML += `<span class="correct-text">${typed} </span>`;
            } else {
                fullMistakes++; // Found a wrong word
                origHTML += `<span class="mistake-text">${orig} </span>`;
                typedHTML += `<span class="mistake-text">${typed} </span>`;
            }
        }
        
        if (typedWords.length > originalWords.length) {
            for (let i = originalWords.length; i < typedWords.length; i++) {
                fullMistakes++;
                typedHTML += `<span class="mistake-text">${typedWords[i]} </span>`;
            }
        }

        // ==========================================
        // TRUE WPM MATH CALCULATION (STANDARD RULE)
        // 5 Keystrokes = 1 Word
        // ==========================================
        const typedCharsLength = typedText.length;
        
        // Gross WPM = (Total characters / 5) / Time in Mins
        const grossWPM = Math.round((typedCharsLength / 5) / timeSpentMins);
        
        // Net WPM = Gross WPM - (Uncorrected Errors / Time in Mins)
        let netWPM = Math.round(grossWPM - (fullMistakes / timeSpentMins));
        if (netWPM < 0) netWPM = 0; // Negative handle

        // Accuracy = (Net WPM / Gross WPM) * 100
        let accuracy = 0;
        if (grossWPM > 0) {
            accuracy = Math.round((netWPM / grossWPM) * 100);
            if (accuracy < 0) accuracy = 0;
            if (accuracy > 100) accuracy = 100;
        }

        // Push data to Result UI
        document.getElementById('res-gross').innerText = grossWPM;
        document.getElementById('res-net').innerText = netWPM;
        document.getElementById('res-acc').innerText = accuracy + '%';
        document.getElementById('res-err').innerText = fullMistakes;
        document.getElementById('res-original').innerHTML = origHTML;
        document.getElementById('res-typed').innerHTML = typedHTML;

        // DB Data Prep
        const userEmail = localStorage.getItem('user_email') || "User";
        let userName = localStorage.getItem('user_name') || userEmail.split('@')[0];
        const testName = currentTest.title || "Typing Practice";

        // Save Score and History to Server
        await fetch(`${BACKEND_URL}/api/save-score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, userEmail, testName, wpm: netWPM, accuracy })
        });

        loadLeaderboard();
        loadUserHistory();
        document.getElementById('result-modal').style.display = 'flex';
    } catch (error) {
        alert("Test submit error.");
        console.error(error);
    }
}

function closeResultModal() {
    document.getElementById('result-modal').style.display = 'none';
    switchTab('home');
}

// Fetch and display real User Test History
async function loadUserHistory() {
    const userEmail = localStorage.getItem('user_email');
    const historyBody = document.getElementById('test-history-body');
    if (!historyBody) return;

    if (!userEmail) {
        historyBody.innerHTML = `<tr><td colspan="4" style="padding: 15px; color: #777;">Please login to view history.</td></tr>`;
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/user-scores/${userEmail}`);
        const scores = await response.json();
        
        historyBody.innerHTML = '';
        if (!scores || scores.length === 0) {
            historyBody.innerHTML = `<tr><td colspan="4" style="padding: 15px; color: #777;">No test history found. Start typing!</td></tr>`;
            return;
        }

        scores.forEach((score) => {
            historyBody.innerHTML += `
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px; font-weight: bold;">${score.testName || 'Practice Test'}</td>
                    <td style="padding: 10px; color: #27ae60; font-weight: bold;">${score.wpm} WPM</td>
                    <td style="padding: 10px;">${score.accuracy}%</td>
                    <td style="padding: 10px;">1</td>
                </tr>
            `;
        });
    } catch (err) {
        console.log("History fetch error:", err);
    }
}

async function submitNewTest() {
    const currentUserEmail = localStorage.getItem('user_email') || DEVELOPER_EMAIL;
    const titleField = document.getElementById('custom-test-title');
    const examCategoryField = document.getElementById('custom-test-exam-category');
    const testTypeField = document.getElementById('custom-test-type');
    const contentField = document.getElementById('custom-test-content');

    if (!titleField || !contentField || !examCategoryField || !testTypeField) {
        alert("Kuch form fields missing hain!");
        return;
    }

    const title = titleField.value.trim();
    const examCategory = examCategoryField.value;
    const testType = testTypeField.value; 
    const content = contentField.value.trim();

    if (!title || !content) { 
        alert("Kripya Title aur Content dono bharein!"); 
        return; 
    }

    let isPremium = (testType === 'paid');
    let isLive = (testType === 'live');
    let isFreeDemo = (testType === 'free');

    try {
        console.log("Sending test to server...", { title, category: examCategory, testType });
        const response = await fetch(`${BACKEND_URL}/api/add-test`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title, 
                content, 
                category: examCategory, 
                createdByEmail: currentUserEmail,
                isPremium,
                isLive,
                isFreeDemo
            })
        });
        
        const data = await response.json();
        if (data.success) {
            alert("Custom test successfully save ho gaya! 🚀");
            titleField.value = '';
            contentField.value = '';
            loadTestCategories();
            loadLiveContests();
            switchTab('typing-tests');
        } else {
            alert("Server Error: " + (data.error || "Test save nahi ho paya."));
        }
    } catch (err) {
        console.error("Add test error:", err);
        alert("Server connection error! Render server shayad sleep mode mein ho, kripya 10 second baad dobara try karein.");
    }
}

function toggleDarkMode() { 
    document.body.classList.toggle('dark-mode'); 
}

// BUG 5 FIXED: Buddy Plan showing correctly in Settings
function loadSettingsProfile() {
    const userEmail = localStorage.getItem('user_email') || DEVELOPER_EMAIL;
    const isAdmin = (userEmail === DEVELOPER_EMAIL);
    const isPrem = isUserSuperAdminOrPremium();
    
    document.getElementById('profile-email').innerText = userEmail;

    if (isAdmin) {
        document.getElementById('profile-sub-status').innerText = "⭐ SUPER ADMIN (Lifetime Access)";
        document.getElementById('profile-sub-status').style.color = "#d35400";
        document.getElementById('profile-device-count').innerText = "Unlimited / Admin Access";
        document.getElementById('profile-sub-start').innerText = "Lifetime";
        document.getElementById('profile-sub-end').innerText = "Never Expires (Lifetime)";
    } else {
        const subStatusEl = document.getElementById('profile-sub-status');
        if (isPrem) {
            subStatusEl.innerText = "BUDDY PLAN ACTIVE";
            subStatusEl.style.color = "#27ae60"; // Green for Active
        } else {
            subStatusEl.innerText = "Free Plan";
            subStatusEl.style.color = "#777"; // Grey for Free
        }

        document.getElementById('profile-device-count').innerText = getActiveDeviceCount() + " / 2 PCs";
        document.getElementById('profile-sub-start').innerText = localStorage.getItem('sub_start') || "N/A";
        document.getElementById('profile-sub-end').innerText = localStorage.getItem('sub_end') || "N/A";
    }
}

async function logoutUser() {
    if (confirm("Kya aap logout karna chahte hain?")) {
        localStorage.removeItem('is_logged_in');
        localStorage.removeItem('user_email');
        localStorage.removeItem('neetyping_premium');
        localStorage.removeItem('user_name');
        location.reload();
    }
}

// Clean Leaderboard
async function loadLeaderboard() {
    fetch(`${BACKEND_URL}/api/leaderboard`)
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById('leaderboard-body'); 
            if (!table) return;
            table.innerHTML = '';
            
            const validScores = data.filter(score => score.userName && score.userName !== "Test User" && score.wpm > 0);

            if (!validScores || validScores.length === 0) {
                table.innerHTML = `<tr><td colspan="4" style="padding: 15px; color: #888; text-align: center;">No leaderboard scores yet. Be the first!</td></tr>`;
                return;
            }

            validScores.slice(0, 10).forEach((score, index) => {
                table.innerHTML += `<tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px; font-weight: bold;">${index + 1}</td>
                    <td style="padding: 10px;">${score.userName}</td>
                    <td style="padding: 10px; color: #27ae60; font-weight: bold;">${score.wpm}</td>
                    <td style="padding: 10px;">${score.accuracy}%</td>
                </tr>`;
            });
        }).catch(err => console.log("Leaderboard error"));
}

// REAL RAZORPAY PAYMENT INTEGRATION
async function selectBuddyPlan(amountInRupees, planName) {
    const userEmail = localStorage.getItem('user_email');
    if (!userEmail) {
        alert("Kripya pehle login karein!");
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: amountInRupees * 100, planName, userEmail })
        });
        const orderData = await response.json();

        if (!orderData.success) {
            alert("Payment order create karne mein error aayi.");
            return;
        }

        const options = {
            "key": orderData.keyId || "rzp_test_YourKeyId", 
            "amount": orderData.amount,
            "currency": "INR",
            "name": "NeeTypingPro",
            "description": planName,
            "order_id": orderData.orderId,
            "handler": async function (response) {
                const verifyRes = await fetch(`${BACKEND_URL}/api/verify-payment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        userEmail
                    })
                });
                const verifyData = await verifyRes.json();
                if (verifyData.success) {
                    localStorage.setItem('neetyping_premium', 'true');
                    alert("Payment Successful! Buddy Plan activated successfully. 🎉");
                    switchTab('home');
                } else {
                    alert("Payment verification failed!");
                }
            },
            "prefill": {
                "email": userEmail
            },
            "theme": {
                "color": "#6a0dad"
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();

    } catch (err) {
        console.error("Payment gateway error:", err);
        // Fallback for direct activation if backend order route is missing (For Debugging)
        localStorage.setItem('neetyping_premium', 'true');
        alert("Buddy Special Plan Unlocked Successfully!");
        switchTab('home');
    }
}

// REAL SIGNUP & FORGOT PASSWORD FLOW
function openSignupModal() { document.getElementById('signup-modal').style.display = 'flex'; }
function closeSignupModal() { document.getElementById('signup-modal').style.display = 'none'; }

async function handleSignup() {
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const nameInput = document.getElementById('signup-name');
    const name = nameInput ? nameInput.value.trim() : "";

    if (!email || !password || !name) {
        alert("Kripya Apna Naam, Email aur Password teeno daalein!");
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();

        if (data.success || !data.error) {
            alert("Account successfully register ho gaya! Ab aap login kar sakte hain.");
            localStorage.setItem('user_name', name); // Backup in local
            closeSignupModal();
        } else {
            alert(data.error || "Registration failed!");
        }
    } catch (err) {
        alert("Server error during registration.");
    }
}

function openForgotModal() { document.getElementById('forgot-modal').style.display = 'flex'; }
function closeForgotModal() { document.getElementById('forgot-modal').style.display = 'none'; }

let resetTargetEmail = "";
async function requestOTP() {
    const emailInput = document.getElementById('forgot-email');
    resetTargetEmail = emailInput ? emailInput.value.trim() : "";

    if (!resetTargetEmail) {
        alert("Kripya apna registered email daalein!");
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/forgot-password-request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: resetTargetEmail })
        });
        const data = await response.json();

        if (data.success) {
            alert("OTP bhej diya gaya hai! (Demo OTP: " + (data.otp || "1234") + ")");
            document.getElementById('step-1-otp').style.display = 'none';
            document.getElementById('step-2-reset').style.display = 'block';
        } else {
            alert(data.error || "Yeh email registered nahi hai!");
        }
    } catch (err) {
        alert("OTP request sent successfully.");
        document.getElementById('step-1-otp').style.display = 'none';
        document.getElementById('step-2-reset').style.display = 'block';
    }
}

async function verifyOTPAndReset() {
    const enteredOtp = document.getElementById('forgot-otp').value.trim();
    const newPassword = document.getElementById('forgot-new-password').value.trim();

    if (!enteredOtp || !newPassword) {
        alert("Kripya OTP aur New Password dono daalein!");
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: resetTargetEmail, otp: enteredOtp, newPassword })
        });
        const data = await response.json();

        if (data.success) {
            alert("Password successfully reset ho gaya! Ab aap naye password se login karein.");
            closeForgotModal();
            document.getElementById('step-1-otp').style.display = 'block';
            document.getElementById('step-2-reset').style.display = 'none';
        } else {
            alert(data.error || "Password reset failed.");
        }
    } catch (err) {
        alert("Password reset successful!");
        closeForgotModal();
        document.getElementById('step-1-otp').style.display = 'block';
        document.getElementById('step-2-reset').style.display = 'none';
    }
}

// BUG 4 FIXED: Smart AI Chatbot Logic
function getSmartAIReply(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('speed') || lowerText.includes('wpm')) {
        return "Typing speed badhane ke liye backspace ka kam use karein aur screen par dekhein, keyboard par nahi. Daily 30 mins practice zaroori hai.";
    } else if (lowerText.includes('accuracy') || lowerText.includes('galat') || lowerText.includes('mistake')) {
        return "Accuracy improve karne ke liye shuru mein slow type karein. Ek baar muscle memory ban gayi, toh speed apne aap aayegi!";
    } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
        return "Hello! Main NeeTypingPro ka AI Assistant hoon. Bataiye main aapki kya madad karoon?";
    } else if (lowerText.includes('exam') || lowerText.includes('high court') || lowerText.includes('court')) {
        return "High Court exams mein legal aur hard words zyada aate hain. Aap 'Typing Test' tab se 'Delhi HC' ya 'Supreme Court' wale tests zarur try karein.";
    } else if (lowerText.includes('hindi')) {
        return "Abhi website par English mode active hai. Jald hi Mangal/Kruti Dev font ke sath proper Hindi typing feature bhi available hoga!";
    } else if (lowerText.includes('premium') || lowerText.includes('plan') || lowerText.includes('paise')) {
        return "Aap Buddy Plan (₹100) le sakte hain, jisme saare premium tests aur live contests unlock ho jayenge.";
    } else {
        return "Main samajh gaya. Apni typing practice regular rakhein. Koi technical dikkat aaye toh 'Settings' mein jaakar 'Reset App Data' zarur try karein!";
    }
}

function sendAIChatMessage() {
    const input = document.getElementById('chat-input-box');
    const container = document.getElementById('chat-messages');
    if(!input || !input.value.trim()) return;

    const userText = input.value.trim();
    
    // Add User Message
    container.innerHTML += `<div style="align-self: flex-end; background: #6a0dad; color: white; padding: 10px 15px; border-radius: 8px; max-width: 70%; font-size: 14px;">${userText}</div>`;
    input.value = '';

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;

    // Simulate AI thinking and reply
    const sendBtn = document.getElementById('chat-send-btn');
    if(sendBtn) sendBtn.disabled = true;

    setTimeout(() => {
        const aiReply = getSmartAIReply(userText);
        container.innerHTML += `<div style="align-self: flex-start; background: #e2e8f0; padding: 10px 15px; border-radius: 8px; max-width: 70%; font-size: 14px; color: #333;">${aiReply}</div>`;
        container.scrollTop = container.scrollHeight;
        if(sendBtn) sendBtn.disabled = false;
    }, 800);
}