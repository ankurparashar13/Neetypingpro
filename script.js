// ==========================================
// AP-TYPING-PRO: COMPLETE MASTER SCRIPT.JS (PRODUCTION READY)
// ==========================================

// --- Dynamic Backend URL Configuration ---
const BACKEND_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
    ? "http://localhost:5000" 
    : ""; // Live server par relative path ya aapka live backend domain aayega

const typeSound = new Audio('https://www.soundjay.com/button/sounds/button-16.mp3');
const defaultTests = [];

// 📝 Standard Court Exam Level Paragraphs
const englishLegalPara = "The appellant has approached this Court challenging the order passed by the learned trial judge. It is an admitted fact that the property in dispute was jointly owned by the predecessors of the parties. The core issue revolves around the interpretation of the sale deed executed on the aforementioned date. The respondent's counsel vehemently argued that the limitation period had already expired, rendering the suit non-maintainable. However, referring to the precedents set by the Apex Court in similar matters, it is evident that the cause of action is a continuous one. Furthermore, the documentary evidence presented, including the mutation records and the revenue receipts, corroborate the appellant's claim of continuous possession. The learned trial court erred in dismissing these crucial pieces of evidence without assigning adequate reasons. Therefore, in the interest of justice and equity, this court finds it imperative to re-examine the evidentiary value of the documents on record. The injunction previously granted shall continue to operate until the final disposal of this appeal. ";

const hindiLegalPara = "अपीलकर्ता ने विद्वान निचली अदालत द्वारा पारित आदेश को चुनौती देते हुए इस न्यायालय का दरवाजा खटखटाया है। यह एक स्वीकृत तथ्य है कि विवादित संपत्ति पर संयुक्त रूप से पक्षों के पूर्वजों का स्वामित्व था। मुख्य मुद्दा पूर्वोक्त तिथि पर निष्पादित बिक्री विलेख की व्याख्या के इर्द-गिर्द घूमता है। प्रतिवादी के वकील ने जोरदार तर्क दिया कि सीमा अवधि पहले ही समाप्त हो चुकी है। हालांकि, सर्वोच्च न्यायालय द्वारा स्थापित मिसालों का हवाला देते हुए, यह स्पष्ट है कि कार्रवाई का कारण निरंतर है। इसके अलावा, प्रस्तुत किए गए दस्तावेजी साक्ष्य, जिसमें म्यूटेशन रिकॉर्ड और राजस्व रसीदें शामिल हैं, अपीलकर्ता के निरंतर कब्जे के दावे की पुष्टि करते हैं। निचली अदालत ने बिना पर्याप्त कारण बताए इन महत्वपूर्ण साक्ष्यों को खारिज करने में गलती की है। ";

for (let i = 1; i <= 50; i++) {
    // 1. English Legal Tests (First 10 Free, rest Premium)
    defaultTests.push({
        id: i,
        language: "english",
        category: "Legal",
        title: `High Court Civil & Criminal Judgement Draft - ${i}`,
        content: englishLegalPara.repeat(10).trim(),
        isPremium: (i > 10)
    });
    
    // 2. English General Tests
    defaultTests.push({
        id: i + 50,
        language: "english",
        category: "General",
        title: `Editorial Essay on Socio-Economic Development - ${i}`,
        content: `Digital transformation and global economic policies play a vital role in socio-economic development. The implementation of robust infrastructure is strictly required to maintain the steady growth of the developing sectors. `.repeat(50).trim(),
        isPremium: (i > 10)
    });

    // 3. Hindi Legal Tests
    defaultTests.push({
        id: i + 100,
        language: "hindi",
        category: "Legal",
        title: `न्यायालय सिविल और आपराधिक निर्णय ड्राफ्ट - ${i}`,
        content: hindiLegalPara.repeat(10).trim(),
        isPremium: (i > 10)
    });

    // 4. Hindi General Tests
    defaultTests.push({
        id: i + 150,
        language: "hindi",
        category: "General",
        title: `सामाजिक-आर्थिक विकास पर संपादकीय निबंध - ${i}`,
        content: `किसी भी राष्ट्र के सामाजिक-आर्थिक विकास में डिजिटल परिवर्तन और पारदर्शी नीतियां बहुत ही महत्वपूर्ण भूमिका निभाती हैं। बुनियादी ढांचे का विकास एक सतत प्रक्रिया है। `.repeat(50).trim(),
        isPremium: (i > 10)
    });
}

let allTypingTests = JSON.parse(localStorage.getItem('custom_tests') || 'null') || defaultTests;
let currentTest = null;
let timer = null;
let testDurationMinutes = 10;
let timeLeft = 600;
let timerStarted = false;
let startTime = null;
let currentTestFolder = 'free'; // Default folder view ('free' or 'premium')

const DEVELOPER_EMAIL = "ankurparashar1312@gmail.com";

// ==========================================
// UNIQUE DEVICE FINGERPRINTING FOR LOGIN LIMIT
// ==========================================
function getDeviceId() {
    let deviceId = localStorage.getItem('device_uuid');
    if (!deviceId) {
        deviceId = 'dev_' + Math.random().toString(36).substring(2) + Date.now();
        localStorage.setItem('device_uuid', deviceId);
    }
    return deviceId;
}

// ==========================================
// INITIALIZATION & AUTHENTICATION
// ==========================================
window.onload = function() {
    if (localStorage.getItem('is_logged_in') === 'true') {
        hideLoginShowHome();
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
       loginForm.onsubmit = async function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value.trim();
            const deviceId = getDeviceId();

            try {
                const response = await fetch(`${BACKEND_URL}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, deviceId })
                });

                const data = await response.json();

                if (data.success) {
                    alert("Login successful! 🎉");
                    localStorage.setItem('user_email', email);
                    localStorage.setItem('is_logged_in', 'true');
                    localStorage.setItem('user_data', JSON.stringify(data.user));

                    if (!localStorage.getItem('sub_start')) {
                        localStorage.setItem('sub_start', new Date().toLocaleDateString());
                        let futureDate = new Date();
                        futureDate.setMonth(futureDate.getMonth() + 1); // Default 1 month
                        localStorage.setItem('sub_end', futureDate.toLocaleDateString());
                    }

                    hideLoginShowHome(); 
                } else {
                    alert(data.error || "Login failed! Device limit may have been reached.");
                }
            } catch (err) {
                console.error("Login request error:", err);
                alert("Server error during login. Kripya fir se koshish karein.");
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

// ==========================================
// TAB SWITCHING & FOLDER NAVIGATION
// ==========================================
function switchTab(tabName) {
    if (timer) clearInterval(timer);

    const typingPage = document.getElementById('typing-page');
    const appSection = document.getElementById('app-section');

    if (typingPage) typingPage.style.display = 'none';
    if (appSection) appSection.style.display = 'flex';

    const tabHome = document.getElementById('tab-home');
    const tabTypingTests = document.getElementById('tab-typing-tests');
    const tabContests = document.getElementById('tab-contests');
    const tabAddTest = document.getElementById('tab-add-test');
    const tabPremium = document.getElementById('tab-premium');
    const tabSettings = document.getElementById('tab-settings');

    if (tabHome) tabHome.style.display = 'none';
    if (tabTypingTests) tabTypingTests.style.display = 'none';
    if (tabContests) tabContests.style.display = 'none';
    if (tabAddTest) tabAddTest.style.display = 'none';
    if (tabPremium) tabPremium.style.display = 'none';
    if (tabSettings) tabSettings.style.display = 'none';

    if (tabName === 'home' || tabName === 'tab-home') {
        if (tabHome) tabHome.style.display = 'block';
    } 
    else if (tabName === 'typing' || tabName === 'tab-typing-tests' || tabName === 'typing-tests') {
        if (tabTypingTests) tabTypingTests.style.display = 'block';
        loadTestCategories(); 
    } 
    else if (tabName === 'contests' || tabName === 'tab-contests') {
        if (tabContests) tabContests.style.display = 'block';
    }
    else if (tabName === 'add-test' || tabName === 'tab-add-test') {
        if (tabAddTest) tabAddTest.style.display = 'block';
    } 
    else if (tabName === 'premium' || tabName === 'tab-premium') {
        if (tabPremium) tabPremium.style.display = 'block';
    } 
    else if (tabName === 'settings' || tabName === 'tab-settings') {
        if (tabSettings) tabSettings.style.display = 'block';
        if (typeof loadSettingsProfile === 'function') loadSettingsProfile();
    }
    manageAdsVisibility();
}

function switchTestFolder(folderType) {
    currentTestFolder = folderType;
    const btnFree = document.getElementById('btn-folder-free');
    const btnPrem = document.getElementById('btn-folder-premium');

    if (folderType === 'free') {
        if (btnFree) btnFree.style.border = '3px solid #000';
        if (btnPrem) btnPrem.style.border = 'none';
    } else {
        if (btnPrem) btnPrem.style.border = '3px solid #000';
        if (btnFree) btnFree.style.border = 'none';
    }
    loadTestCategories();
}

function isUserSuperAdminOrPremium() {
    const userEmail = localStorage.getItem('user_email');
    if (userEmail === DEVELOPER_EMAIL) return true;
    return localStorage.getItem('aptypro_premium') === 'true';
}

// ==========================================
// SMART AD DISPLAY CONTROLLER (Free vs Pro)
// ==========================================
function manageAdsVisibility() {
    const isPrem = isUserSuperAdminOrPremium();
    const adBoxes = document.querySelectorAll('#result-ad-box, .sidebar-ad-box');

    adBoxes.forEach(adBox => {
        if (isPrem) {
            adBox.style.display = 'none'; // Pro users ke liye ad hide ho jayega
        } else {
            adBox.style.display = 'block'; // Free users ke liye ad dikhega
        }
    });
}

// ==========================================
// TEST LOADING & MANAGEMENT (FREE VS PREMIUM FOLDERS)
// ==========================================
async function loadTestCategories() {
    const container = document.getElementById('test-list-container');
    if (!container) return;
    container.innerHTML = '<p style="padding: 10px; color: #666;">Tests load ho rahe hain...</p>';

    const hasAccess = isUserSuperAdminOrPremium();
    const selectedLangInput = document.querySelector('input[name="lang-select"]:checked');
    const selectedLang = selectedLangInput ? selectedLangInput.value : 'english';

    let combinedTests = [...defaultTests.filter(test => test.language === selectedLang)];

    try {
        const response = await fetch(`${BACKEND_URL}/api/tests`);
        const dbTests = await response.json();
        
        dbTests.forEach(test => {
            combinedTests.unshift({
                id: test._id,
                language: 'english',
                category: test.isPremium ? 'Legal (Pro)' : 'General',
                title: test.title,
                content: test.content,
                isPremium: test.isPremium,
                isDbTest: true
            });
        });
    } catch (err) {
        console.log("Database tests fetch karne mein error:", err);
    }

    // Filter based on active folder tab (Free Tests vs Premium Tests)
    if (currentTestFolder === 'free') {
        combinedTests = combinedTests.filter(t => !t.isPremium);
    } else {
        combinedTests = combinedTests.filter(t => t.isPremium);
    }

    container.innerHTML = '';

    if (combinedTests.length === 0) {
        container.innerHTML = `<p style="padding: 20px; color: #888;">Is folder mein koi test uplabdh nahi hai.</p>`;
        return;
    }

    combinedTests.forEach((test) => {
        const isLocked = test.isPremium && !hasAccess;

        const card = document.createElement('div');
        card.className = `test-card ${isLocked ? 'locked' : 'unlocked'}`;
        card.style.cssText = "padding: 15px; margin: 10px 0; background: #fff; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; cursor: pointer;";
        
        card.innerHTML = `
            <div>
                <h4 style="margin: 0 0 5px 0; color: #333;">${test.title}</h4>
                <p style="margin: 0; font-size: 13px; color: #666;">Category: ${test.category} | Words: ~${test.content.split(/\s+/).length}</p>
            </div>
            <span>${isLocked ? '🔒 [PRO LOCKED]' : (test.isPremium ? '💎 [PREMIUM TEST]' : '🟢 [FREE TEST - WITH AD]')}</span>
        `;
        
        card.onclick = () => {
            if (isLocked) {
                alert("Yeh test PRO users ke liye hai! Kripya Premium plan kharidein.");
                switchTab('premium');
            } else {
                handleTestClick(test);
            }
        };

        container.appendChild(card);
    });
}

// ==========================================
// PRE-TEST MANDATORY AD LOGIC FOR FREE TESTS
// ==========================================
function handleTestClick(test) {
    const isPrem = isUserSuperAdminOrPremium();

    // Agar user Premium hai ya test Premium folder ka hai, toh koi ad nahi chalega
    if (isPrem || test.isPremium) {
        startTest(test);
    } else {
        // Free user ke liye pre-test ad modal dikhayein
        showPreTestAd(test);
    }
}

function showPreTestAd(test) {
    const adModal = document.getElementById('pre-test-ad-modal');
    const timerText = document.getElementById('ad-timer-text');
    const skipBtn = document.getElementById('skip-ad-btn');

    if (!adModal) {
        startTest(test);
        return;
    }

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
    startTypingTest(test);
}

function startTypingTest(test) {
    currentTest = test;
    const examToggle = document.getElementById('exam-mode-toggle');
    const isExamMode = examToggle ? examToggle.checked : false;
    
    if (isExamMode) {
        let elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => console.log("Fullscreen blocked"));
        }
    }
    const appSection = document.getElementById('app-section');
    const typingPage = document.getElementById('typing-page');
    
    if (appSection) appSection.style.display = 'none';
    if (typingPage) typingPage.style.display = 'block';
    
    const refText = document.getElementById('reference-text');
    const inputArea = document.getElementById('typing-input');
    
    if (test.language === 'hindi') {
        if (refText) refText.style.fontFamily = "Mangal, 'Noto Sans Devanagari', sans-serif";
        if (inputArea) {
            inputArea.style.fontFamily = "Mangal, 'Noto Sans Devanagari', sans-serif";
            inputArea.setAttribute("lang", "hi");
            inputArea.placeholder = "यहाँ टाइप करना शुरू करें...";
        }
    } else {
        if (refText) refText.style.fontFamily = "monospace";
        if (inputArea) {
            inputArea.style.fontFamily = "monospace";
            inputArea.setAttribute("lang", "en");
            inputArea.placeholder = "Start typing here...";
        }
    }
    
    if (refText) refText.innerText = test.content;
    
    if (inputArea) {
        inputArea.value = '';
        inputArea.disabled = false;
        inputArea.focus();
    }
    
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
    if (timeSpan) {
        timeSpan.innerText = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
}

function changeTestDuration() {
    const selectElem = document.getElementById('test-duration');
    testDurationMinutes = parseInt(selectElem.value);
    timeLeft = testDurationMinutes * 60;
    updateTimerDisplay();
}

function cancelTest() {
    const confirmCancel = confirm("Kya aap test cancel karna chahte hain?");
    if (confirmCancel) {
        if (timer) clearInterval(timer);
        timerStarted = false;
        switchTab('home');
    }
}

// ==========================================
// TYPING & TIMER EXECUTION
// ==========================================
const typingInput = document.getElementById('typing-input');
if (typingInput) {
    typingInput.onkeydown = function(e) {
        const examToggle = document.getElementById('exam-mode-toggle');
        const soundToggle = document.getElementById('sound-toggle');
        const backspaceToggle = document.getElementById('backspace-toggle');
        
        const isExamMode = examToggle ? examToggle.checked : false;
        const isSoundOn = soundToggle ? soundToggle.checked : false;
        const backspaceAllowed = backspaceToggle ? backspaceToggle.checked : true;

        if (isSoundOn) {
            typeSound.currentTime = 0; 
            typeSound.play().catch(err => console.log("Sound error:", err));
        }

        if (e.key === 'Backspace' && (!backspaceAllowed || isExamMode)) {
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
        
        const maxWords = typedWords.length;
        for (let i = 0; i < maxWords; i++) {
            const orig = originalWords[i] || '';
            const typed = typedWords[i] || '';

            const cleanOrig = orig.replace(/[.,;!?'"]/g, '');
            const cleanTyped = typed.replace(/[.,;!?'"]/g, '');

            if (orig === typed) {
                origHTML += `<span class="correct-text">${orig} </span>`;
                if (typed) typedHTML += `<span class="correct-text">${typed} </span>`;
            } 
            else if (orig === "" || typed === "") {
                fullMistakes++;
                if (orig) origHTML += `<span class="mistake-text">${orig} </span>`;
                if (typed) typedHTML += `<span class="mistake-text">${typed} </span>`;
            } 
            else if (orig.toLowerCase() === typed.toLowerCase()) {
                halfMistakes++;
                origHTML += `<span class="mistake-text">${orig} </span>`;
                typedHTML += `<span class="mistake-text">${typed} </span>`;
            }
            else if (cleanOrig.toLowerCase() === cleanTyped.toLowerCase()) {
                halfMistakes++;
                origHTML += `<span class="mistake-text">${orig} </span>`;
                typedHTML += `<span class="mistake-text">${typed} </span>`;
            }
            else {
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

        // AI Weakness Report Generator Logic
        const aiBox = document.getElementById('res-ai-analysis');
        if (aiBox) {
            if (errors === 0) {
                aiBox.innerText = "AI Insight: Outstanding! Zero errors detected. Your keyboard mastery and finger placement are near perfect.";
            } else if (accuracy > 90) {
                aiBox.innerText = `AI Insight: Great job! Total errors: ${errors}. Minor slips detected on fast keystrokes. Focus slightly more on accuracy over speed.`;
            } else {
                aiBox.innerText = `AI Insight: Warning! High error count (${errors}). Your typing rhythm is breaking on complex punctuation or long words. Practice slower with backspace disabled.`;
            }
        }

        saveHistory(currentTest.title, netWPM, accuracy);
        if (typeof loadLeaderboard === 'function') {
            loadLeaderboard();
        }

        manageAdsVisibility(); // Modal open hone par ads control check karega
        document.getElementById('result-modal').style.display = 'flex';
    } catch (error) {
        console.error("Test submit me error aaya:", error);
        alert("Thodi technical dikkat aayi hai. Kripya page refresh kar lein.");
    }
}

function closeResultModal() {
    document.getElementById('result-modal').style.display = 'none';
    switchTab('home');
}

// ==========================================
// BACKEND SYNC: ADD TEST & DATABASE TESTS
// ==========================================
async function submitNewTest() {
    const titleInput = document.getElementById('new-test-title') || document.getElementById('custom-test-title');
    const contentInput = document.getElementById('new-test-content') || document.getElementById('custom-test-content');
    const premiumInput = document.getElementById('new-test-premium');

    const title = titleInput ? titleInput.value.trim() : '';
    const content = contentInput ? contentInput.value.trim() : '';
    const isPremium = premiumInput ? premiumInput.checked : false;
    const currentUserEmail = localStorage.getItem('user_email') || DEVELOPER_EMAIL;

    if (!title || !content) {
        alert("Bhai, कृपया Title aur Content dono bharein!");
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/add-test`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title, 
                content, 
                isPremium, 
                createdByEmail: currentUserEmail 
            })
        });
        
        const data = await response.json();
        if(data.success) {
            alert("Test successfully add ho gaya database mein! 🚀");
            if (titleInput) titleInput.value = '';
            if (contentInput) contentInput.value = '';
            if (premiumInput) premiumInput.checked = false;
            
            loadTestCategories();
            switchTab('typing-tests');
        } else {
            alert("Error: Test save nahi ho paya.");
        }
    } catch (err) {
        console.log("Server error:", err);
        alert("Server से connect nahi ho pa raha hai.");
    }
}

function loadTestsFromDatabase() {
    loadTestCategories();
}

function saveCustomTest() {
    submitNewTest();
}

// ==========================================
// PROFILE, SETTINGS & HISTORY LOGIC
// ==========================================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

function loadSettingsProfile() {
    const userEmail = localStorage.getItem('user_email') || DEVELOPER_EMAIL;
    const isPrem = isUserSuperAdminOrPremium();
    const isDeveloper = (userEmail === DEVELOPER_EMAIL); 
    
    const profileEmail = document.getElementById('profile-email');
    const profileSubStatus = document.getElementById('profile-sub-status');
    const profileSubStart = document.getElementById('profile-sub-start');
    const profileSubEnd = document.getElementById('profile-sub-end');

    if (profileEmail) profileEmail.innerText = userEmail;
    if (profileSubStatus) profileSubStatus.innerText = isPrem ? "PRO ACTIVE (Unlimited Access)" : "Free Plan";
    
    if (isDeveloper) {
        if (profileSubStart) profileSubStart.innerText = "Always Active";
        if (profileSubEnd) profileSubEnd.innerText = "Lifetime (Super Admin Access)";
    } else {
        if (profileSubStart) profileSubStart.innerText = localStorage.getItem('sub_start') || "N/A";
        if (profileSubEnd) profileSubEnd.innerText = localStorage.getItem('sub_end') || "N/A";
    }
    
    loadHistory(); 
}

async function logoutUser() {
    const confirmLogout = confirm("Kya aap logout karna chahte hain?");
    if (confirmLogout) {
        const email = localStorage.getItem('user_email');
        const deviceId = getDeviceId();

        if (email) {
            try {
                await fetch(`${BACKEND_URL}/api/logout`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, deviceId })
                });
            } catch (e) {
                console.error("Logout sync error", e);
            }
        }

        localStorage.removeItem('is_logged_in');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_data');
        location.reload();
    }
}

function saveHistory(testTitle, netWPM, accuracy) {
    let history = JSON.parse(localStorage.getItem('typing_history') || '{}');
    if (!history[testTitle]) { history[testTitle] = { attempts: 0, bestNetWPM: 0, bestAccuracy: 0 }; }
    history[testTitle].attempts += 1;
    if (netWPM > history[testTitle].bestNetWPM) { history[testTitle].bestNetWPM = netWPM; }
    if (accuracy > history[testTitle].bestAccuracy) { history[testTitle].bestAccuracy = accuracy; }
    localStorage.setItem('typing_history', JSON.stringify(history));

    fetch(`${BACKEND_URL}/api/save-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userName: localStorage.getItem('user_email') || "Test User",
            wpm: netWPM,
            accuracy: accuracy
        })
    })
    .then(res => res.json())
    .then(data => console.log("Database mein score chala gaya:", data))
    .catch(err => console.log("Database error:", err));
}

function loadHistory() {
    const historyBody = document.getElementById('test-history-body');
    if (!historyBody) return;
    let history = JSON.parse(localStorage.getItem('typing_history') || '{}');
    historyBody.innerHTML = '';
    
    if (Object.keys(history).length === 0) {
        historyBody.innerHTML = `<tr><td colspan="4" style="padding: 15px; text-align: center; color: #888;">No test history found. Start typing!</td></tr>`;
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

// ==========================================
// LEADERBOARD SYSTEM
// ==========================================
function loadLeaderboard() {
    fetch(`${BACKEND_URL}/api/leaderboard`)
        .then(res => res.json())
        .then(data => {
            const leaderboardTable = document.getElementById('leaderboard-body'); 
            if (!leaderboardTable) return;
            
            leaderboardTable.innerHTML = '';
            
            data.forEach((score, index) => {
                let rowBg = (index === 0) ? "#fff8e1" : "#fff";
                let rankMedal = (index === 0) ? "🥇 1" : (index === 1) ? "🥈 2" : (index === 2) ? "🥉 3" : (index + 1);

                const row = `<tr style="background-color: ${rowBg}; border-bottom: 1px solid #ddd;">
                    <td style="padding: 12px; font-weight: bold; font-size: 16px;">${rankMedal}</td>
                    <td style="padding: 12px; font-weight: 500;">${score.userName}</td>
                    <td style="padding: 12px; color: #27ae60; font-weight: bold; font-size: 18px;">${score.wpm}</td>
                    <td style="padding: 12px;">${score.accuracy}%</td>
                </tr>`;
                leaderboardTable.innerHTML += row;
            });
        })
        .catch(err => console.log("Leaderboard load karne mein error:", err));
}

// ==========================================
// PREMIUM & RAZORPAY PAYMENT LOGIC (UPDATED PLANS)
// ==========================================
async function selectPlan(amountInRupees, planName) {
    const userEmail = localStorage.getItem('user_email') || "user@gmail.com";
    const amountInPaise = amountInRupees * 100;
    
    try {
        const response = await fetch(`${BACKEND_URL}/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: amountInPaise })
        });
        
        if (!response.ok) throw new Error("Server offline");
        const order = await response.json();

        const options = {
            key: "rzp_test_TFneVtXlBSsmMM", 
            amount: order.amount,
            currency: "INR",
            name: "ApTypingPro",
            description: planName,
            order_id: order.id,
            handler: function (response) {
                alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
                localStorage.setItem('aptypro_premium', 'true');
                
                let startDate = new Date();
                let endDate = new Date();
                
                // Sabhi plans ab 1 Month (30 Days) ke liye valid rahenge
                endDate.setMonth(endDate.getMonth() + 1);

                localStorage.setItem('sub_start', startDate.toLocaleDateString());
                localStorage.setItem('sub_end', endDate.toLocaleDateString());

                alert("Pro Access Unlocked Successfully!");
                manageAdsVisibility(); // Payment ke baad turant ads gayab ho jayenge
                switchTab('home');
            },
            prefill: { email: userEmail },
            theme: { color: "#6a0dad" }
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();

    } catch (error) {
        alert("Payment server se connect nahi ho paya! Kripya check karein ki server chal raha hai.");
        console.error("Payment Error:", error);
    }
}

// ==========================================
// AUTH MODALS (SIGNUP & FORGOT PASSWORD)
// ==========================================
function openSignupModal() { 
    const modal = document.getElementById('signup-modal');
    if (modal) modal.style.display = 'flex'; 
}

function closeSignupModal() { 
    const modal = document.getElementById('signup-modal');
    if (modal) modal.style.display = 'none'; 
}

function handleSignup() {
    const email = document.getElementById('signup-email').value.trim();
    const pass = document.getElementById('signup-password').value.trim();
    if (!email || !pass) { alert("Kripya email aur password bharein!"); return; }
    
    localStorage.setItem('user_email', email);
    localStorage.setItem('is_logged_in', 'true');
    localStorage.setItem('sub_start', new Date().toLocaleDateString());
    let futureDate = new Date(); 
    futureDate.setMonth(futureDate.getMonth() + 1);
    localStorage.setItem('sub_end', futureDate.toLocaleDateString());
    
    alert("Account successfully created & registered!");
    closeSignupModal(); 
    hideLoginShowHome();
}

function openForgotModal() { 
    const modal = document.getElementById('forgot-modal');
    if (modal) modal.style.display = 'flex'; 
}

function closeForgotModal() {
    const modal = document.getElementById('forgot-modal');
    if (modal) modal.style.display = 'none';
    const step1 = document.getElementById('step-1-otp');
    const step2 = document.getElementById('step-2-reset');
    if (step1) step1.style.display = 'block';
    if (step2) step2.style.display = 'none';
}

async function requestOTP() {
    const email = document.getElementById('forgot-email').value.trim();
    if (!email) { alert("Pehle apna email enter karein!"); return; }

    try {
        const response = await fetch(`${BACKEND_URL}/send-otp`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ email: email })
        });
        if (response.ok) {
            document.getElementById('step-1-otp').style.display = 'none';
            document.getElementById('step-2-reset').style.display = 'block';
        } else { alert("Error sending OTP. Email check karein."); }
    } catch (error) { alert("Server connect nahi ho pa raha hai."); console.error(error); }
}

async function verifyOTPAndReset() {
    const email = document.getElementById('forgot-email').value.trim();
    const otp = document.getElementById('forgot-otp').value.trim();
    const newPass = document.getElementById('forgot-new-password').value.trim();

    if (!otp || !newPass) { alert("Kripya OTP aur naya password dono daalein!"); return; }

    try {
        const response = await fetch(`${BACKEND_URL}/verify-otp-reset`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ email, otp, newPassword: newPass })
        });
        const data = await response.json();
        if (data.success) {
            alert("Aapka password successfully badal gaya hai! Ab aap login kar sakte hain.");
            localStorage.setItem('user_password', newPass); 
            closeForgotModal();
        } else { alert("Galat OTP! Kripya sahi OTP daalein."); }
    } catch (error) { alert("Server error."); console.error(error); }
}

// ==========================================
// ANTI-CHEATING SECURITY RESTRICTIONS
// ==========================================
const typingPageElem = document.getElementById('typing-page');
if (typingPageElem) {
    typingPageElem.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
}

const typingBoxElem = document.getElementById('typing-input');
if (typingBoxElem) {
    typingBoxElem.addEventListener('paste', e => e.preventDefault());
    typingBoxElem.addEventListener('copy', e => e.preventDefault());
    typingBoxElem.addEventListener('cut', e => e.preventDefault());
}

const referenceBoxElem = document.getElementById('reference-text');
if (referenceBoxElem) {
    referenceBoxElem.style.userSelect = 'none';
    referenceBoxElem.style.webkitUserSelect = 'none';
}