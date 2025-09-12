// Importing utility function for preloading images
import { preloadImages } from "../../utils.js";

// Registering Flip plugin
gsap.registerPlugin(Flip);

// Constants for class names
const POSITION_CLASSES = {
  NORTH: "pos-north",
  SOUTH: "pos-south",
  WEST: "pos-west",
  EAST: "pos-east",
};

// Selecting DOM elements
const gridElement = document.querySelector(".grid");
const gridItems = Array.from(gridElement.querySelectorAll(".grid__item"));
const gridImages = gridElement.querySelectorAll(".grid__img");
const fullscreenElement = document.querySelector(".fullscreen");

// Flag to track fullscreen mode
let isFullscreen = false;

// Animation defaults
const animationDefaults = { duration: 1, ease: "expo.inOut" };

// Flip the clicked image and animate its movement
const flipImage = (gridItem, gridImage) => {
  gsap.set(gridItem, { zIndex: 99 });
  const state = Flip.getState(gridImage, { props: "borderRadius" });

  if (isFullscreen) {
    // Move back to original parent
    gridItem.appendChild(gridImage);
  } else {
    // Move into fullscreen container
    fullscreenElement.appendChild(gridImage);
  }

  Flip.from(state, {
    ...animationDefaults,
    absolute: true,
    prune: true,
    onComplete: () => {
      gsap.set(gridItem, { zIndex: "auto" });
      isFullscreen = !isFullscreen;

      if (!isFullscreen) {
        resetOtherItems();
      }
    },
  });
};

// Reset all other images to their original grid positions
const resetOtherItems = () => {
  const state = Flip.getState(gridItems);

  gridItems.forEach((item) => {
    item.classList.remove(...Object.values(POSITION_CLASSES));
    gsap.to(item, { rotation: 0, duration: 0.5 });
  });

  Flip.from(state, {
    ...animationDefaults,
    scale: true,
    prune: true,
  });
};

const toggleImage = (ev) => {
  const gridImage = ev.target;
  const gridItem = gridItems[gridImage.dataset.index];

  // If currently fullscreen and the clicked image is the one in fullscreen -> close it
  if (isFullscreen && fullscreenElement.contains(gridImage)) {
    flipImage(gridItem, gridImage);
    return;
  }

  // If something else is already fullscreen -> block clicks
  if (isFullscreen) return;

  // Otherwise open this image fullscreen
  flipImage(gridItem, gridImage);
};

// Initialize event listeners for grid images
const initEvents = () => {
  gridImages.forEach((gridImage, index) => {
    gridImage.dataset.index = index;
    gridImage.addEventListener("click", toggleImage);
  });
};

// Preload images then initialize
preloadImages(".grid__img").then(() => {
  document.body.classList.remove("loading");
  initEvents();
});
