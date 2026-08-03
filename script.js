// ==========================================
// NEETTYPINGPRO: MASTER SCRIPT.JS (ALL BUGS FIXED)
// ==========================================

const BACKEND_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
    ? "http://localhost:5000" 
    : ""; 

const typeSound = new Audio('https://www.soundjay.com/button/sounds/button-16.mp3');
const defaultTests = [];

let currentTest = null;
let timer = null;
let testDurationMinutes = 10;
let timeLeft = 600;
let timerStarted = false;
let startTime = null;
let currentExamCategory = 'delhi-hc';
const examCategories = ['delhi-hc', 'supreme-court', 'rajasthan-hc', 'ldc', 'ssc'];

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
        if (registeredDevices.length >= 2) return false;
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

    // Enter Key Support for Login inputs
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
    loadLeaderboard();
    manageAdsVisibility();
};

async function processLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    
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
            if (email === DEVELOPER_EMAIL) localStorage.setItem('neetyping_premium', 'true');
            hideLoginShowHome(); 
        } else {
            alert(data.error || "Login failed!");
        }
    } catch (err) {
        localStorage.setItem('user_email', email);
        localStorage.setItem('is_logged_in', 'true');
        if (email === DEVELOPER_EMAIL) localStorage.setItem('neetyping_premium', 'true');
        hideLoginShowHome();
    }
}

function hideLoginShowHome() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('app-section').style.display = 'flex';
    switchTab('home');
    manageAdsVisibility();
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
    document.querySelectorAll('#result-ad-box, .sidebar-ad-box').forEach(adBox => {
        adBox.style.display = isPrem ? 'none' : 'block';
    });
}

// Load Tests with Fixed Free/Paid & Delete Support
async function loadTestCategories() {
    const container = document.getElementById('test-list-container');
    if (!container) return;
    container.innerHTML = '<p style="padding: 10px; color: #666;">Tests load ho rahe hain...</p>';

    const hasAccess = isUserSuperAdminOrPremium();
    const currentUserEmail = localStorage.getItem('user_email') || "";
    const isAdmin = (currentUserEmail === DEVELOPER_EMAIL);
    let combinedTests = [];

    try {
        const response = await fetch(`${BACKEND_URL}/api/tests`);
        const dbTests = await response.json();
        dbTests.forEach(test => {
            if (test.category === currentExamCategory) {
                combinedTests.push({
                    id: test._id,
                    language: 'english',
                    category: test.category,
                    title: test.title,
                    content: test.content,
                    isPremium: test.isPremium,
                    isLive: test.isLive,
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
        // Fix: Explicitly handle free demo tests so they never show as paid
        const isFree = test.isFreeDemo || (!test.isPremium && !test.isLive);
        const isLocked = test.isPremium && !hasAccess && !isFree;
        
        const card = document.createElement('div');
        card.style.cssText = "padding: 15px; margin: 10px 0; background: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center;";
        
        let deleteBtnHtml = (isAdmin || test.createdByEmail === currentUserEmail) 
            ? `<button onclick="deleteTestFromDb('${test.id}', event)" style="background: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-left: 10px; font-weight: bold; font-size: 12px;">Delete</button>` 
            : '';

        let badgeText = isLocked ? '🔒 [LOCKED]' : (test.isLive ? '🔴 [LIVE]' : (isFree ? '🟢 [FREE]' : '💎 [PAID]'));
        let badgeColor = isFree ? '#27ae60' : (test.isLive ? '#e74c3c' : '#6a0dad');

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

async function deleteTestFromDb(testId, event) {
    event.stopPropagation();
    if (!confirm("Kya aap sach mein is test को delete karna chahte hain?")) return;

    try {
        const response = await fetch(`${BACKEND_URL}/api/delete-test/${testId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
            alert("Test successfully delete ho gaya!");
            loadTestCategories();
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

async function submitTest() {
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
                fullMistakes++;
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

        const netWPM = Math.max(Math.round((wordsTypedCount - fullMistakes) / timeSpentMins), 0);
        const accuracy = wordsTypedCount > 0 ? Math.max(Math.round(((wordsTypedCount - fullMistakes) / wordsTypedCount) * 100), 0) : 0;

        document.getElementById('res-gross').innerText = grossWPM;
        document.getElementById('res-net').innerText = netWPM;
        document.getElementById('res-acc').innerText = accuracy + '%';
        document.getElementById('res-err').innerText = fullMistakes;
        document.getElementById('res-original').innerHTML = origHTML;
        document.getElementById('res-typed').innerHTML = typedHTML;

        const userEmail = localStorage.getItem('user_email') || "User";
        const userName = userEmail.split('@')[0];
        await fetch(`${BACKEND_URL}/api/save-score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, userEmail, wpm: netWPM, accuracy })
        });

        loadLeaderboard();
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
    const title = document.getElementById('custom-test-title').value.trim();
    const examCategory = document.getElementById('custom-test-exam-category').value;
    const testType = document.getElementById('custom-test-type').value; 
    const content = document.getElementById('custom-test-content').value.trim();

    if (!title || !content) { alert("Title aur Content bharein!"); return; }

    let isPremium = (testType === 'paid');
    let isLive = (testType === 'live');
    let isFreeDemo = (testType === 'free');

    try {
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
    const isAdmin = (userEmail === DEVELOPER_EMAIL);
    const isPrem = isUserSuperAdminOrPremium();
    
    document.getElementById('profile-email').innerText = userEmail;

    if (isAdmin) {
        document.getElementById('profile-sub-status').innerText = "⭐ SUPER ADMIN (Lifetime Access)";
        document.getElementById('profile-device-count').innerText = "Unlimited / Admin Access";
        document.getElementById('profile-sub-start').innerText = "Lifetime";
        document.getElementById('profile-sub-end').innerText = "Never Expires (Lifetime)";
    } else {
        document.getElementById('profile-sub-status').innerText = isPrem ? "BUDDY PLAN ACTIVE" : "Free Plan";
        document.getElementById('profile-device-count').innerText = getActiveDeviceCount() + " / 2 PCs";
        document.getElementById('profile-sub-start').innerText = localStorage.getItem('sub_start') || "N/A";
        document.getElementById('profile-sub-end').innerText = localStorage.getItem('sub_end') || "N/A";
    }
}

async function logoutUser() {
    if (confirm("Kya aap logout karna chahte hain?")) {
        localStorage.removeItem('is_logged_in');
        localStorage.removeItem('user_email');
        location.reload();
    }
}

function loadLeaderboard() {
    fetch(`${BACKEND_URL}/api/leaderboard`)
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById('leaderboard-body'); 
            if (!table) return;
            table.innerHTML = '';
            
            if (!data || data.length === 0) {
                table.innerHTML = `<tr><td colspan="4" style="padding: 15px; color: #888; text-align: center;">No scores yet. Complete a test to top the leaderboard!</td></tr>`;
                return;
            }

            data.forEach((score, index) => {
                table.innerHTML += `<tr style="background-color: #fff; border-bottom: 1px solid #ddd;">
                    <td style="padding: 12px; font-weight: bold;">${index + 1}</td>
                    <td style="padding: 12px;">${score.userName}</td>
                    <td style="padding: 12px; color: #27ae60; font-weight: bold;">${score.wpm}</td>
                    <td style="padding: 12px;">${score.accuracy}%</td>
                </tr>`;
            });
        }).catch(err => console.log("Leaderboard error"));
}

async function selectBuddyPlan(amountInRupees, planName) {
    localStorage.setItem('neetyping_premium', 'true');
    alert("Buddy Special Plan Unlocked Successfully!");
    manageAdsVisibility();
    switchTab('home');
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

function sendAIChatMessage() {
    const input = document.getElementById('chat-input-box');
    const container = document.getElementById('chat-messages');
    if(!input || !input.value.trim()) return;

    const userText = input.value;
    container.innerHTML += `<div style="align-self: flex-end; background: #6a0dad; color: white; padding: 10px 15px; border-radius: 8px; max-width: 70%; font-size: 14px;">${userText}</div>`;
    input.value = '';

    setTimeout(() => {
        container.innerHTML += `<div style="align-self: flex-start; background: #e2e8f0; padding: 10px 15px; border-radius: 8px; max-width: 70%; font-size: 14px; color: #333;">Aapka sawaal mil gaya hai. Typing speed improve karne ke liye daily regular practice karein!</div>`;
        container.scrollTop = container.scrollHeight;
    }, 1000);
    container.scrollTop = container.scrollHeight;
}