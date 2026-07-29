// ---- Data: replace src/caption/category with your own photos ----
const photos = [
  { src: "https://picsum.photos/seed/forest1/600/400", caption: "Pine ridge, dawn", category: "nature" },
  { src: "https://picsum.photos/seed/city1/600/400", caption: "Crosswalk rush", category: "city" },
  { src: "https://picsum.photos/seed/portrait1/600/400", caption: "Portrait, window light", category: "people" },
  { src: "https://picsum.photos/seed/river1/600/400", caption: "River bend", category: "nature" },
  { src: "https://picsum.photos/seed/skyline1/600/400", caption: "Skyline, blue hour", category: "city" },
  { src: "https://picsum.photos/seed/market1/600/400", caption: "Market stall", category: "people" },
  { src: "https://picsum.photos/seed/mountain1/600/400", caption: "Ridge line", category: "nature" },
  { src: "https://picsum.photos/seed/alley1/600/400", caption: "Back alley, noon", category: "city" },
  { src: "https://picsum.photos/seed/hands1/600/400", caption: "Hands at work", category: "people" },
];

const gallery = document.getElementById("gallery");
const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";
let currentIndex = 0;

// Build the grid
function renderGallery() {
  gallery.innerHTML = "";
  photos.forEach((photo, i) => {
    const frame = document.createElement("div");
    frame.className = "frame";
    frame.dataset.category = photo.category;
    frame.dataset.index = String(i + 1).padStart(2, "0");
    frame.innerHTML = `
      <img src="${photo.src}" alt="${photo.caption}" loading="lazy">
      <div class="cap">${photo.caption}</div>
    `;
    frame.addEventListener("click", () => openLightbox(i));
    gallery.appendChild(frame);
  });
  applyFilter(currentFilter);
}

function applyFilter(category) {
  currentFilter = category;
  const frames = gallery.querySelectorAll(".frame");
  frames.forEach((frame, i) => {
    const matches = category === "all" || photos[i].category === category;
    frame.classList.toggle("hidden", !matches);
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilter(btn.dataset.category);
  });
});

// ---- Lightbox ----
const lightbox = document.getElementById("lightbox");
const lbImage = document.getElementById("lbImage");
const lbCaption = document.getElementById("lbCaption");
const lbCounter = document.getElementById("lbCounter");

function visibleIndices() {
  return photos
    .map((p, i) => i)
    .filter((i) => currentFilter === "all" || photos[i].category === currentFilter);
}

function openLightbox(index) {
  currentIndex = index;
  showImage();
  lightbox.classList.add("open");
}

function closeLightbox() {
  lightbox.classList.remove("open");
}

function showImage() {
  const photo = photos[currentIndex];
  lbImage.src = photo.src;
  lbImage.alt = photo.caption;
  lbCaption.textContent = photo.caption;

  const visible = visibleIndices();
  const posInVisible = visible.indexOf(currentIndex) + 1;
  lbCounter.textContent = `FRAME ${posInVisible} / ${visible.length}`;
}

function step(direction) {
  const visible = visibleIndices();
  const pos = visible.indexOf(currentIndex);
  const nextPos = (pos + direction + visible.length) % visible.length;
  currentIndex = visible[nextPos];
  showImage();
}

document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbPrev").addEventListener("click", () => step(-1));
document.getElementById("lbNext").addEventListener("click", () => step(1));

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

renderGallery();
