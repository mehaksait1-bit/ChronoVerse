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

const FONT_FAMILIES = ['"Orbitron"', "Georgia", "system-ui"];

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

async function preloadFonts() {
  await document.fonts.ready;

  await Promise.all(
    FONT_FAMILIES.flatMap((family) =>
      ["400", "500", "700"].map((weight) =>
        document.fonts.load(`${weight} 16px ${family}`).catch(() => undefined)
      )
    )
  );
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
      await load();
      done += 1;
      onProgress(Math.round((done / total) * 100));
    })
  );
}

/**
 * Preload fonts, images, and scene JS modules.
 * Three.js textures/models are tracked separately via PreloadSceneAssets + useProgress.
 */
export async function preloadStaticAssets(onProgress) {
  let fontsDone = false;
  let imagesPct = 0;
  let modulesPct = 0;

  const report = () => {
    const fontsWeight = fontsDone ? 15 : 0;
    const imagesWeight = imagesPct * 0.1;
    const modulesWeight = modulesPct * 0.25;
    onProgress(Math.min(40, Math.round(fontsWeight + imagesWeight + modulesWeight)));
  };

  const fontsPromise = preloadFonts().then(() => {
    fontsDone = true;
    report();
  });

  const imagesPromise = preloadImages((pct) => {
    imagesPct = pct;
    report();
  });

  const modulesPromise = preloadSceneModules((pct) => {
    modulesPct = pct;
    report();
  });

  await Promise.all([fontsPromise, imagesPromise, modulesPromise]);
  onProgress(40);
}
