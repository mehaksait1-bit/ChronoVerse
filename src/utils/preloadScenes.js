import heroImage from "../assets/hero.png";

export const SCENE_IDS = [
  "intro",
  "prehistoric",
  "egypt",
  "medieval",
  "modern",
  "future",
  "beyond",
];

export const SCENE_LOADERS = [
  () => import("../scenes/IntroScene"),
  () => import("../scenes/PrehistoricEra"),
  () => import("../scenes/AncientEgypt"),
  () => import("../scenes/MedievalKingdom"),
  () => import("../scenes/ModernWorld"),
  () => import("../scenes/Future2200"),
  () => import("../scenes/BeyondTime"),
];

const STATIC_IMAGES = [heroImage, "/favicon.svg"];

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(resolve, ms)),
  ]);
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

async function preloadFonts() {
  await withTimeout(document.fonts.ready, 2000);
}

async function preloadImages() {
  await Promise.all(STATIC_IMAGES.map(loadImage));
}

export async function preloadSceneModules(onProgress) {
  let done = 0;
  const total = SCENE_LOADERS.length;

  await Promise.all(
    SCENE_LOADERS.map(async (load) => {
      try {
        await withTimeout(load(), 5000);
      } catch {
        // Continue even if a chunk fails
      }
      done += 1;
      onProgress(Math.round((done / total) * 100));
    })
  );
}

export async function preloadStaticAssets(onProgress) {
  await preloadSceneModules((pct) => {
    onProgress(Math.min(90, Math.round(pct * 0.9)));
  });

  onProgress(95);

  await Promise.all([preloadFonts(), preloadImages()]).catch(() => undefined);

  onProgress(100);
}
