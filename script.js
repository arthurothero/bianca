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
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");

const playlist = ["src/musica1.mp3", "src/musica2.mp3", "src/musica3.mp3"];

let current = 0;
let started = false;
let isMuted = false;

function playMusic(index) {
  current = index % playlist.length;
  music.src = playlist[current];
  if (started) music.play();
}

music.addEventListener("ended", () => {
  playMusic(current + 1);
});

document.addEventListener(
  "click",
  async () => {
    if (!started) {
      music.src = playlist[current];
      music.volume = 0.3;

      try {
        await music.play();
        started = true;
      } catch {
        console.log("bloqueado autoplay");
      }
    }
  },
  { once: true },
);

toggle.addEventListener("click", async () => {
  if (!started) {
    await startMusic();
  }

  isMuted = !isMuted;
  music.muted = isMuted;
  toggle.textContent = isMuted ? "🔇" : "🔊";
});

btnNext.addEventListener("click", () => {
  playMusic(current + 1);
});

btnPrev.addEventListener("click", () => {
  playMusic(current - 1 < 0 ? playlist.length - 1 : current - 1);
});

document
  .querySelectorAll(".reveal:not(.visible)")
  .forEach((el) => observer.observe(el));

const SUPABASE_URL = "https://anbawllurpsygcucemtx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuYmF3bGx1cnBzeWdjdWNlbXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMTA4MzcsImV4cCI6MjA5NTU4NjgzN30.qfdmfimR6lQnqy_JRI_To8wxJxGJzFTVNK1i3JhC8a4";

const cartaTexto = document.getElementById("cartaTexto");
const cartaEnviar = document.getElementById("cartaEnviar");
const cartaCount = document.getElementById("cartaCount");
const cartaFormWrap = document.getElementById("cartaFormWrap");
const cartaSucesso = document.getElementById("cartaSucesso");
const cartasLista = document.getElementById("cartasLista");

cartaTexto?.addEventListener("input", () => {
  cartaCount.textContent = cartaTexto.value.length;
});

cartaEnviar?.addEventListener("click", async () => {
  const mensagem = cartaTexto.value.trim();
  if (!mensagem) return;

  cartaEnviar.disabled = true;
  cartaEnviar.textContent = "Enviando... 💌";

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/cartas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ mensagem }),
    });

    if (!res.ok) throw new Error("Erro ao enviar");

    cartaFormWrap.style.display = "none";
    cartaSucesso.classList.remove("hidden");

    carregarCartas();
  } catch (err) {
    console.error(err);
    cartaEnviar.disabled = false;
    cartaEnviar.textContent = "Enviar carta 💌";
    alert("Não consegui enviar, tenta de novo 😢");
  }
});

async function carregarCartas() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/cartas?select=mensagem,created_at&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      },
    );

    const data = await res.json();

    if (!data.length) {
      cartasLista.innerHTML = `<p class="carta-vazia">Nenhuma cartinha ainda... 🥺</p>`;
      return;
    }

    cartasLista.innerHTML = data
      .map((c) => {
        const data_formatada = new Date(c.created_at).toLocaleDateString(
          "pt-BR",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          },
        );
        return `
        <div class="carta-item">
          <p class="carta-item-texto">${escapeHtml(c.mensagem)}</p>
          <span class="carta-item-data">💌 ${data_formatada}</span>
        </div>
      `;
      })
      .join("");
  } catch (err) {
    console.error(err);
    cartasLista.innerHTML = `<p class="carta-vazia">Erro ao carregar as cartas 😢</p>`;
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

carregarCartas();
