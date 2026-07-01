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

const albumMemorias = [
  {
    src: "src/princesa.jfif",
    caption: "Nesse dia você achou que não tava bonita, mas você esquece que sua beleza não depende de dia bom ou dia ruim. Você é linda em qualquer versão sua.",
  },
  {
    src: "src/elaetudo.mp4",
    caption: "O jeito que você ri de qualquer besteira que eu faço.",
  },
  {
    src: "src/bibi4.jfif",
    caption: "Essa foto me lembra o quanto seu sorriso é o mais bonito que eu já vi.",
  },
  {
    src: "src/bianca6.jfif",
    caption: "Um momento que foi rápido, mas ficou guardado na minha cabeça eternamente.",
  },
  {
    src: "src/rawrr.jfif",
    caption: "Você sendo você, do jeitinho que eu mais gosto.",
  },
  {
    src: "src/euteamomuito2.jfif",
    caption: "Uma das fotos que eu mais olho quando bate saudade.",
  },
  {
    src: "src/bebe.jfif",
    caption: "Seu jeitinho de bebê que me faz querer te proteger pra sempre. Seu sorriso é a mesma coisa de quando você era bebê, e eu amo isso.",
  },
  {
    src: "src/beijos.mp4",
    caption: "Seu beijo é o mais confortável que eu já recebi na vida, e é o que mais me apaixona.",
  },
  {
    src: "src/pintura.jfif",
    caption: "Uma mulher realmente bonita não é aquela de quem se elogia uma parte específica - pernas, braços, mas aquela cuja beleza toda é tão completa que você nem consegue admirar só um pedaço dela.",
  },
];
 
const albumHeart = document.getElementById("albumHeart");
const albumGrid = document.getElementById("albumGrid");
const albumProgress = document.getElementById("albumProgress");
 
let albumRevelados = 0;
 
function ehVideo(src) {
  return /\.(mp4|mov|webm)$/i.test(src);
}
 
function revelarMemoria() {
  if (albumRevelados >= albumMemorias.length) return;
 
  const memoria = albumMemorias[albumRevelados];
 
  const midiaHTML = ehVideo(memoria.src)
    ? `<video src="${memoria.src}" autoplay muted loop playsinline></video>`
    : `<img src="${memoria.src}" alt="Memória secreta" />`;
 
  const card = document.createElement("div");
  card.className = "album-card";
  card.innerHTML = `
    ${midiaHTML}
    <p>${memoria.caption}</p>
  `;
 
  albumGrid.appendChild(card);
  albumRevelados++;
 
  albumProgress.textContent = `${albumRevelados} de ${albumMemorias.length} descobertas`;
 
  if (albumRevelados >= albumMemorias.length) {
    albumHeart.disabled = true;
    albumHeart.textContent = "💌";
 
    const final = document.createElement("div");
    final.className = "album-final";
    final.innerHTML = `<p>Você descobriu o álbum secreto inteiro 🥹 e olha que isso foi só uma parte de tudo que eu guardo sobre você.</p>`;
    albumGrid.appendChild(final);
  }
}
 
albumHeart?.addEventListener("click", revelarMemoria);
