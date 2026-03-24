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
    music.src = playlist[current];
    music.volume = 0.3;

    try {
      await music.play();
      started = true;
    } catch {
      console.log("bloqueado autoplay");
      return;
    }
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

const storyForm = document.getElementById("storyForm");
const storyGrid = document.getElementById("storyGrid");

storyForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const titulo = document.getElementById("storyTitle").value.trim();
  const subtitulo = document.getElementById("storySubtitle").value.trim();
  const descricao = document.getElementById("storyDescription").value.trim();
  const imagemInput = document.getElementById("storyImage");

  if (!imagemInput || !imagemInput.files || !imagemInput.files[0]) {
    alert("Selecione uma imagem.");
    return;
  }

  const file = imagemInput.files[0];

  const formData = new FormData();
  formData.append("titulo", titulo);
  formData.append("subtitulo", subtitulo);
  formData.append("descricao", descricao);
  formData.append("imagem", file);

  const response = await fetch("http://localhost:8080/memorias", {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    alert("Erro ao salvar memória");
    return;
  }

  storyForm.reset();
  await carregarMemorias();
});

async function carregarMemorias() {
  const response = await fetch("http://localhost:8080/memorias");
  const memorias = await response.json();

  storyGrid.innerHTML = "";

  memorias.forEach((m, index) => {
    const article = document.createElement("article");
    article.className =
      index % 2 === 0
        ? "story-item reveal visible"
        : "story-item reverse reveal visible";

    article.innerHTML = `
      <div class="story-dot"></div>
      <figure class="story-photo">
        <img src="${m.imagemUrl}" alt="${m.titulo}">
      </figure>
      <div class="story-copy">
        <span>${m.subtitulo}</span>
        <h3>${m.titulo}</h3>
        <p>${m.descricao}</p>
      </div>
    `;

    storyGrid.appendChild(article);
  });
}

carregarMemorias();

document
  .querySelectorAll(".reveal:not(.visible)")
  .forEach((el) => observer.observe(el));
