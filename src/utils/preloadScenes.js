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
  await withTimeout(document.fonts.ready, 3000);
}

async function preloadImages(onItem) {
  let done = 0;
  const total = STATIC_IMAGES.length;

  await Promise.all(
    STATIC_IMAGES.map(async (src) => {
      await loadImage(src);
      done += 1;
      onItem(done / total);
    })
  );
}

export async function preloadSceneModules(onProgress) {
  let done = 0;
  const total = SCENE_LOADERS.length;

  await Promise.all(
    SCENE_LOADERS.map(async (load) => {
      try {
        await load();
      } catch {
        // Scene chunk failed — still advance so loading never hangs
      }
      done += 1;
      onProgress(Math.round((done / total) * 100));
    })
  );
}

/**
 * Preload scene modules first (required), then fonts/images in parallel.
 * Never throws — production must not hang on optional assets.
 */
export async function preloadStaticAssets(onProgress) {
  let fontsDone = false;
  let imagesPct = 0;
  let modulesPct = 0;

  const report = () => {
    const fontsWeight = fontsDone ? 10 : 0;
    const imagesWeight = imagesPct * 0.1;
    const modulesWeight = modulesPct * 0.3;
    onProgress(Math.min(40, Math.round(fontsWeight + imagesWeight + modulesWeight)));
  };

  await preloadSceneModules((pct) => {
    modulesPct = pct;
    report();
  });

  onProgress(40);

  await Promise.all([
    preloadFonts().then(() => {
      fontsDone = true;
      report();
    }),
    preloadImages((pct) => {
      imagesPct = pct;
      report();
    }),
  ]).catch(() => undefined);

  onProgress(40);
}
