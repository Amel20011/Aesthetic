// ========== PARTICLE SYSTEM ==========
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = `rgba(192, 207, 224, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animateParticles);
}

// Initialize particles
initParticles();
animateParticles();

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ========== GUEST NAME FROM URL ==========
function getGuestNameFromURL() {
    const params = new URLSearchParams(window.location.search);
    const guestName = params.get('to');
    
    if (guestName) {
        document.getElementById('guestName').textContent = guestName;
        
        // Determine title based on name
        const lastChar = guestName.charAt(guestName.length - 1);
        // Simple heuristic - adjust as needed
        document.getElementById('guestTitle').textContent = 'Bapak/Ibu/Saudara/i';
    }
}

getGuestNameFromURL();

// ========== COVER PAGE TRANSITION ==========
const cover = document.getElementById('cover');
const mainContent = document.getElementById('mainContent');
const openBtn = document.getElementById('openBtn');

openBtn.addEventListener('click', (e) => {
    // Create ripple effect
    const ripple = openBtn.querySelector('.ripple');
    const rect = openBtn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';

    // Transition
    setTimeout(() => {
        cover.classList.add('fade-out');
        mainContent.classList.remove('hidden');
        mainContent.classList.add('show');
        
        // Start falling flowers
        startFallingFlowers();
        
        // Trigger scroll reveals
        setTimeout(observeElements, 100);
    }, 300);
});

// ========== FALLING FLOWERS ==========
function startFallingFlowers() {
    const container = document.getElementById('fallingFlowers');
    
    function createFlower() {
        const flower = document.createElement('div');
        flower.className = 'falling-flower';
        flower.innerHTML = '🌸';
        flower.style.left = Math.random() * 100 + '%';
        flower.style.fontSize = (Math.random() * 20 + 15) + 'px';
        flower.style.animation = `fall ${Math.random() * 2 + 3}s linear`;
        
        container.appendChild(flower);
        
        setTimeout(() => flower.remove(), 5000);
    }

    // Create flowers at intervals
    const flowerInterval = setInterval(createFlower, 300);
    
    // Stop after 30 seconds
    setTimeout(() => clearInterval(flowerInterval), 30000);
}

// ========== SCROLL REVEAL ANIMATION ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = `revealUp 0.8s ease-out forwards`;
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

function observeElements() {
    document.querySelectorAll('.fade-up').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

// ========== COUNTDOWN TIMER ==========
function updateCountdown() {
    const weddingDate = new Date('2026-07-05T08:00:00').getTime();
    
    function countdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '0';
            document.getElementById('minutes').textContent = '0';
            document.getElementById('seconds').textContent = '0';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    countdown();
    setInterval(countdown, 1000);
}

updateCountdown();

// ========== RSVP FORM ==========
const rsvpBtn = document.getElementById('rsvpBtn');
const rsvpName = document.getElementById('rsvpName');
const rsvpMessage = document.getElementById('rsvpMessage');
const ucapanFeed = document.getElementById('ucapanFeed');

// Load existing responses from localStorage
function loadResponses() {
    const responses = JSON.parse(localStorage.getItem('weddingResponses') || '[]');
    displayResponses(responses);
}

function saveResponse(response) {
    const responses = JSON.parse(localStorage.getItem('weddingResponses') || '[]');
    responses.unshift(response);
    localStorage.setItem('weddingResponses', JSON.stringify(responses));
    displayResponses(responses);
}

function displayResponses(responses) {
    ucapanFeed.innerHTML = '';

    if (responses.length === 0) {
        ucapanFeed.innerHTML = '<div class="ucapan-empty">Belum ada ucapan. Jadilah yang pertama mengirim ucapan dan doa! 💝</div>';
        return;
    }

    responses.forEach(response => {
        const card = document.createElement('div');
        card.className = 'ucapan-card';
        card.innerHTML = `
            <div class="ucapan-name">${response.name}</div>
            <div class="ucapan-message">${response.message}</div>
        `;
        ucapanFeed.appendChild(card);
    });
}

rsvpBtn.addEventListener('click', () => {
    const name = rsvpName.value.trim();
    const message = rsvpMessage.value.trim();
    const attendance = document.querySelector('input[name="attendance"]:checked').value;

    if (!name) {
        alert('Mohon isi nama Anda terlebih dahulu');
        rsvpName.focus();
        return;
    }

    if (!message) {
        alert('Mohon isi ucapan dan doa Anda');
        rsvpMessage.focus();
        return;
    }

    // Create response object
    const response = {
        name: name,
        message: message,
        attendance: attendance,
        timestamp: new Date().toISOString()
    };

    // Save and display
    saveResponse(response);

    // Clear form
    rsvpName.value = '';
    rsvpMessage.value = '';

    // Show success message
    const successMsg = document.createElement('div');
    successMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #4a7ab5, #1a3a6b);
        color: white;
        padding: 30px 50px;
        border-radius: 50px;
        font-family: 'Cinzel', serif;
        font-size: 1.2rem;
        z-index: 1000;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.5s ease-out;
    `;
    successMsg.textContent = '✓ Ucapan terkirim. Terima kasih! 💝';
    document.body.appendChild(successMsg);

    setTimeout(() => successMsg.remove(), 3000);

    // Scroll to ucapan section
    document.querySelector('.ucapan').scrollIntoView({ behavior: 'smooth' });
});

// Load responses on page load
loadResponses();

// ========== FAMILY PHOTO LIGHTBOX ==========
const familyPhoto = document.getElementById('familyPhoto');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxOverlay = document.getElementById('lightboxOverlay');

familyPhoto.addEventListener('click', () => {
    lightboxImg.src = familyPhoto.src;
    lightbox.classList.add('active');
});

lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

lightboxOverlay.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

// ========== MUSIC CONTROL ==========
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
let isMusicPlaying = false;

musicBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicBtn.classList.remove('active');
        musicBtn.querySelector('.music-icon').textContent = '♪';
        isMusicPlaying = false;
    } else {
        bgMusic.play();
        musicBtn.classList.add('active');
        musicBtn.querySelector('.music-icon').textContent = '♬';
        isMusicPlaying = true;
    }
});

// Auto-play music on first interaction
document.addEventListener('click', () => {
    if (!isMusicPlaying && bgMusic.paused) {
        bgMusic.play();
        musicBtn.classList.add('active');
        musicBtn.querySelector('.music-icon').textContent = '♬';
        isMusicPlaying = true;
    }
}, { once: true });

// ========== SMOOTH SCROLL BEHAVIOR ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========== WINDOW LOAD ==========
window.addEventListener('load', () => {
    // Initial fade-up animation for cover elements
    document.querySelectorAll('.cover-label, .cover-title, .cover-couple, .cover-guest, .cover-photo-frame, .cover-text, .cover-btn').forEach((el, index) => {
        el.style.animation = `fadeInUp 1s ease-out ${0.1 * index}s backwards`;
    });
});