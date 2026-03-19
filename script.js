const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.16 },
);

function toggleCollage() {
  const collage = document.querySelector(".hero-collage");
  const tip = document.querySelector(".collage-tip");

  collage.classList.toggle("expanded");

  if (collage.classList.contains("expanded")) {
    tip.classList.add("hidden");
  }
}

function startFireworks() {
  const canvas = document.getElementById("fireworks-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];

  function createFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.6;

    for (let i = 0; i < 40; i++) {
      particles.push({
        x,
        y,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 3 + 1,
        life: 80,
      });
    }
  }

  function animate() {
    ctx.fillStyle = "rgba(255, 248, 248, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.life--;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${Math.random() * 360}, 80%, 70%)`;
      ctx.fill();

      if (p.life <= 0) particles.splice(i, 1);
    });

    requestAnimationFrame(animate);
  }

  setInterval(createFirework, 1200);

  animate();
}

const music = document.getElementById("bgMusic");
const toggle = document.getElementById("musicToggle");

const playlist = ["src/musica1.mp3", "src/musica2.mp3", "src/musica3.mp3"];

let current = 0;
let started = false;
let isMuted = false;

music.addEventListener("ended", () => {
  current = (current + 1) % playlist.length;
  music.src = playlist[current];
  music.play();
});

async function startMusic() {
  if (started) return;

  music.src = playlist[current];
  music.volume = 0.3;

  try {
    await music.play();
    started = true;
  } catch {
    console.log("bloqueado autoplay");
  }
}

toggle.addEventListener("click", async () => {
  if (!started) {
    await startMusic();
  }

  isMuted = !isMuted;
  music.muted = isMuted;
  toggle.textContent = isMuted ? "🔇" : "🔊";
});

document.addEventListener("click", startMusic, { once: true });

document
  .querySelectorAll(".reveal:not(.visible)")
  .forEach((el) => observer.observe(el));
