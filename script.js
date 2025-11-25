/* New honest AF lines */
const lines = [
  "Funny how someone I never met can feel more real than people in front of me.",
  "You read text. I read the person behind the text.",
  "We argue. We misread. But we still choose to stay. That matters.",
  "I don’t know your voice. But I know your silence.",
  "If your smile is anything like the way you care… I’m already gone.",
  "You overthink a lot. Min overthinks losing you.",
  "Not perfect. Not easy. Still worth it.",
  "Distance tests people. We’re still here.",
  "Three years isn’t long when the end point is home.",
  "When I finally see you laugh… that’s the day this waiting makes sense."
];

const stickers = [
  "image_1.png", "image_2.png", "image_3.png", "image_4.png", "image_5.png",
  "image_6.png", "image_7.png", "image_8.png", "image_9.png", "image_10.png"
];

const captions = [
  "Still here with each other",
  "Even when it’s messy",
  "We keep trying",
  "That’s what matters",
  "Closer than distance thinks",
  "We make it work",
  "You’re worth the effort",
  "I choose you",
  "Every single time",
  "This is only the start"
];

const messageEl = document.getElementById('message');
const polaroidWrap = document.querySelector('.polaroid-wrap');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const finalText = document.getElementById('finalText');
const confettiCanvas = document.getElementById('confettiCanvas');

let idx = 0;
let finished = false;

function createLineElement(text) {
  const el = document.createElement('div');
  el.className = 'line chars';
  el.style.whiteSpace = 'pre-wrap';
  el.style.textAlign = 'center';
  messageEl.appendChild(el);
  return el;
}

function typeTextInto(el, text, speed = 30) {
  return new Promise(resolve => {
    el.textContent = "";
    let i = 0;
    let lastTime = 0;

    const step = (time) => {
      if (!lastTime) lastTime = time;
      const delta = time - lastTime;

      if (delta >= speed) {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          lastTime = time;
          // Auto scroll to bottom of message container
          messageEl.scrollTop = messageEl.scrollHeight;
        } else {
          el.classList.add('show');
          resolve();
          return;
        }
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

async function runSequence() {
  messageEl.innerHTML = "";
  for (let i = 0; i < lines.length; i++) {
    const ln = createLineElement(lines[i]);
    await typeTextInto(ln, lines[i], 27);
    await new Promise(r => setTimeout(r, 250));
    if (i === 0) {
      const p = document.querySelector('.polaroid');
      if (p) {
        p.classList.add('center');
        setTimeout(() => p.classList.remove('center'), 700);
      }
    }
  }
  nextBtn.disabled = false;
}

function createPolaroid(index) {
  const div = document.createElement('div');
  div.className = 'polaroid';
  div.id = 'polaroid'; // Maintain ID for CSS if needed, though class is better
  div.innerHTML = `
      <img id="sticker" src="${stickers[index]}" alt="Photo ${index + 1}">
      <div class="caption" id="caption">${captions[index]}</div>
    `;
  return div;
}

// Initial render
polaroidWrap.innerHTML = '';
polaroidWrap.appendChild(createPolaroid(0));


function showIndex(i) {
  idx = i;
  // Logic for transition will be handled in event listeners
  // This function might be deprecated or repurposed
}

function updatePolaroid(newIndex, direction) {
  const oldPolaroid = polaroidWrap.querySelector('.polaroid');
  const newPolaroid = createPolaroid(newIndex);

  // Initial state for new polaroid
  newPolaroid.style.opacity = '0';
  newPolaroid.style.transform = direction === 'next' ? 'rotate(10deg) translateX(50px)' : 'rotate(-10deg) translateX(-50px)';

  polaroidWrap.appendChild(newPolaroid);

  // Trigger reflow
  void newPolaroid.offsetWidth;

  // Animate in
  newPolaroid.style.opacity = '1';
  newPolaroid.style.transform = 'rotate(-3deg)'; // Default rotation

  // Animate out old
  if (oldPolaroid) {
    oldPolaroid.style.transform = direction === 'next' ? 'rotate(-15deg) translateX(-100px) translateY(20px)' : 'rotate(15deg) translateX(100px) translateY(20px)';
    oldPolaroid.style.opacity = '0';
    setTimeout(() => {
      if (oldPolaroid.parentNode) oldPolaroid.parentNode.removeChild(oldPolaroid);
    }, 450);
  }

  prevBtn.hidden = idx === 0;
}


nextBtn.addEventListener('click', () => {
  if (idx < stickers.length - 1) {
    idx++;
    updatePolaroid(idx, 'next');
    prevBtn.hidden = idx === 0;
  } else finishSequence();
});

prevBtn.addEventListener('click', () => {
  if (idx > 0) {
    idx--;
    updatePolaroid(idx, 'prev');
    prevBtn.hidden = idx === 0;
  }
});

function finishSequence() {
  if (finished) return;
  finished = true;
  nextBtn.disabled = true;
  prevBtn.hidden = true;
  finalText.style.opacity = 1;

  startConfetti();
  // Effect on the last polaroid
  const lastP = polaroidWrap.querySelector('.polaroid');
  if (lastP) lastP.style.boxShadow = '0 20px 46px rgba(255,70,130,.18)';
}

/* Confetti replaced with Ducks 🦆 */
function startConfetti() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiCanvas.style.display = 'block';

  const ctx = confettiCanvas.getContext('2d');
  const pieces = [];

  for (let i = 0; i < 60; i++) {
    pieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      size: 20 + Math.random() * 40, // Random size between 20px and 60px
      vx: -2 + Math.random() * 4,
      vy: 2 + Math.random() * 6,
      rot: Math.random() * 360,
      rotSpeed: -5 + Math.random() * 10,
      life: 150 + Math.random() * 100
    });
  }

  function frame() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (let p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      p.vy += 0.06;
      p.life--;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);

      ctx.font = `${p.size}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🦆", 0, 0);

      ctx.restore();
    }
    const alive = pieces.filter(p => p.life > 0);
    if (alive.length === 0) {
      confettiCanvas.style.display = 'none';
      return;
    }
    requestAnimationFrame(frame);
  }
  frame();
}

// Preload Images
stickers.forEach(src => {
  const img = new Image();
  img.src = src;
});

// Swipe Gestures
let touchStartX = 0;
let touchEndX = 0;

polaroidWrap.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

polaroidWrap.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  if (touchEndX < touchStartX - 50) {
    // Swipe Left (Next)
    if (!nextBtn.disabled && idx < stickers.length - 1) {
      nextBtn.click();
    }
  }
  if (touchEndX > touchStartX + 50) {
    // Swipe Right (Prev)
    if (!prevBtn.hidden) {
      prevBtn.click();
    }
  }
}


window.addEventListener('load', () => {
  nextBtn.disabled = true;
  prevBtn.hidden = true;
  finalText.style.opacity = 0;
  // Initial render already done
  runSequence();
});
