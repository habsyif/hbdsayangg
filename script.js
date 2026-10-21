// ==========================================================================
// 1. FLOATING HEARTS & SAKURA PETALS BACKGROUND
// ==========================================================================
function createHearts() {
    const container = document.getElementById('hearts-container');
    if (!container) return;

    const symbols = ['🩷', '🌸', '🤍', '✨', '🎀', '🌷'];
    const count = 24;

    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = symbols[i % symbols.length];
        heart.classList.add('heart');
        heart.style.left = (Math.random() * 96 + 2) + 'vw';
        heart.style.fontSize = (16 + Math.random() * 14) + 'px';
        heart.style.animationDelay = (Math.random() * 8) + 's';
        heart.style.animationDuration = (10 + Math.random() * 14) + 's';
        container.appendChild(heart);
    }
}
createHearts();

// ==========================================================================
// 2. FLOATING BACKGROUND MUSIC CONTROL
// ==========================================================================
function toggleBgMusic() {
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    const musicLabel = document.getElementById('music-label');
    if (!bgMusic) return;

    if (bgMusic.paused) {
        bgMusic.volume = 0.55;
        bgMusic.play().then(() => {
            if (musicBtn) musicBtn.classList.add('playing');
            if (musicLabel) musicLabel.innerText = 'Musik Menyala 🎶';
            sessionStorage.setItem('bday_music_playing', '1');
        }).catch(err => console.log('Autoplay blocked:', err));
    } else {
        bgMusic.pause();
        if (musicBtn) musicBtn.classList.remove('playing');
        if (musicLabel) musicLabel.innerText = 'Putar Musik 🎵';
        sessionStorage.setItem('bday_music_playing', '0');
    }
}

// Auto-resume music if user already started it in this session
document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    const musicLabel = document.getElementById('music-label');

    if (bgMusic && sessionStorage.getItem('bday_music_playing') === '1') {
        bgMusic.volume = 0.55;
        bgMusic.play().then(() => {
            if (musicBtn) musicBtn.classList.add('playing');
            if (musicLabel) musicLabel.innerText = 'Musik Menyala 🎶';
        }).catch(() => {});
    }

    updateVisitedCards();
    startRelationshipTimer();
});

// ==========================================================================
// 2B. LIVE RELATIONSHIP TIMER (SINCE 26 FEBRUARI 2026)
// ==========================================================================
// Tanggal jadian: 26 Februari 2026 (Bulan di JavaScript dimulai dari 0 = Januari, 1 = Februari)
const RELATIONSHIP_START_DATE = new Date(2026, 1, 26, 0, 0, 0);

function startRelationshipTimer() {
    const daysEl = document.getElementById('timer-days');
    const hoursEl = document.getElementById('timer-hours');
    const minutesEl = document.getElementById('timer-minutes');
    const secondsEl = document.getElementById('timer-seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    function updateTimer() {
        const now = new Date();
        const diffMs = Math.max(0, now - RELATIONSHIP_START_DATE);

        const totalSeconds = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        daysEl.innerText = days;
        hoursEl.innerText = String(hours).padStart(2, '0');
        minutesEl.innerText = String(minutes).padStart(2, '0');
        secondsEl.innerText = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

// ==========================================================================
// 3. PASSCODE & LOCK SCREEN LOGIC (INDEX.HTML)
// ==========================================================================
function startJourney() {
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    const musicLabel = document.getElementById('music-label');

    if (bgMusic && bgMusic.paused) {
        bgMusic.volume = 0.55;
        bgMusic.play().then(() => {
            if (musicBtn) musicBtn.classList.add('playing');
            if (musicLabel) musicLabel.innerText = 'Musik Menyala 🎶';
            sessionStorage.setItem('bday_music_playing', '1');
        }).catch(() => {});
    }

    const modal = document.getElementById('modal-passcode');
    if (modal) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            const input = document.getElementById('passcode-input');
            if (input) input.focus();
        }, 120);
    }
}

function updatePinDots(val) {
    const dots = document.querySelectorAll('#pin-dots .pin-dot');
    dots.forEach((dot, idx) => {
        if (idx < val.length) {
            dot.classList.add('filled');
            dot.innerText = '🩷';
        } else {
            dot.classList.remove('filled');
            dot.innerText = '🤍';
        }
    });
}

function pressDigit(digit) {
    const inputField = document.getElementById('passcode-input');
    if (!inputField) return;
    if (inputField.value.length < 8) {
        inputField.value += digit;
        autoCheckPasscode();
    }
}

function backspaceDigit() {
    const inputField = document.getElementById('passcode-input');
    if (!inputField) return;
    inputField.value = inputField.value.slice(0, -1);
    autoCheckPasscode();
}

function clearDigits() {
    const inputField = document.getElementById('passcode-input');
    if (!inputField) return;
    inputField.value = '';
    autoCheckPasscode();
}

function toggleHint() {
    const hintBox = document.getElementById('hint-box');
    if (hintBox) {
        hintBox.classList.toggle('hidden');
    }
}

function autoCheckPasscode() {
    const inputField = document.getElementById('passcode-input');
    if (!inputField) return;

    // Hanya izinkan angka Maksimal 8 digit
    inputField.value = inputField.value.replace(/[^0-9]/g, '').slice(0, 8);
    const input = inputField.value;
    const box = document.getElementById('passcode-box');
    const errorMsg = document.getElementById('error-msg');

    updatePinDots(input);

    if (errorMsg) errorMsg.style.display = 'none';

    if (input.length === 8) {
        if (input === '26022026' || input === '22102008') {
            // Animasi sukses singkat sebelum masuk ke menu.html
            setTimeout(() => {
                window.location.href = 'menu.html';
            }, 220);
        } else {
            if (errorMsg) errorMsg.style.display = 'block';
            if (box) {
                box.classList.remove('shake');
                void box.offsetWidth;
                box.classList.add('shake');
            }
            setTimeout(() => {
                inputField.value = '';
                updatePinDots('');
            }, 380);
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
}

// ==========================================================================
// 4. MENU CARDS & PROGRESS TRACKER (MENU.HTML)
// ==========================================================================
function getVisitedPages() {
    try {
        return JSON.parse(localStorage.getItem('bday_visited_pages') || '[]');
    } catch {
        return [];
    }
}

function markPageVisited(targetUrl) {
    try {
        const visited = getVisitedPages();
        if (!visited.includes(targetUrl)) {
            visited.push(targetUrl);
            localStorage.setItem('bday_visited_pages', JSON.stringify(visited));
        }
    } catch {}
}

function updateVisitedCards() {
    const visited = getVisitedPages();
    const map = {
        'h1.html': 'card-h1',
        'h2.html': 'card-h2',
        'h3.html': 'card-h3',
        'h4.html': 'card-h4'
    };

    let count = 0;
    Object.keys(map).forEach(url => {
        if (visited.includes(url)) {
            count++;
            const cardEl = document.getElementById(map[url]);
            if (cardEl) cardEl.classList.add('visited');
        }
    });

    const countEl = document.getElementById('opened-count');
    if (countEl) {
        countEl.innerText = `${count} / 4`;
    }
}

function showCardModal(title, desc, targetUrl, iconSymbol) {
    const titleEl = document.getElementById('modal-card-title');
    const descEl = document.getElementById('modal-card-desc');
    const iconEl = document.getElementById('modal-card-icon');
    const btn = document.getElementById('modal-card-btn');

    if (titleEl) titleEl.innerText = title;
    if (descEl) descEl.innerText = desc;
    if (iconEl && iconSymbol) iconEl.innerText = iconSymbol;

    if (btn) {
        btn.onclick = function () {
            markPageVisited(targetUrl);
            window.location.href = targetUrl;
        };
    }

    const modal = document.getElementById('modal-card');
    if (modal) modal.classList.remove('hidden');
}
