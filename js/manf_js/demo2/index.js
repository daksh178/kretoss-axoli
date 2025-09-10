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
const gridItems = Array.from(gridElement.querySelectorAll(".grid__item")); // Convert NodeList to Array
const gridImages = gridElement.querySelectorAll(".grid__img");
const fullscreenElement = document.querySelector(".fullscreen");

// Flag to track fullscreen mode
let isFullscreen = false;

// Animation defaults
const animationDefaults = { duration: 1, ease: "expo.inOut" };

// Function to flip the clicked image and animate its movement
const flipImage = (gridItem, gridImage) => {
  gsap.set(gridItem, { zIndex: 99 });
  const state = Flip.getState(gridImage, { props: "borderRadius" });

  if (isFullscreen) {
    // Move back to original parent
    gridItem.appendChild(gridImage);
  } else {
    fullscreenElement.appendChild(gridImage);
  }

  Flip.from(state, {
    ...animationDefaults,
    absolute: true,
    prune: true,
    onComplete: () => {
      gsap.set(gridItem, { zIndex: "auto" });
      isFullscreen = !isFullscreen;

      // After changing fullscreen state, reset other images if closing
      if (!isFullscreen) {
        resetOtherItems();
      }
    },
  });
};

// Function to reset all other images to their original grid positions
const resetOtherItems = () => {
  const state = Flip.getState(gridItems);

  gridItems.forEach((item) => {
    // Remove any temporary classes
    item.classList.remove(...Object.values(POSITION_CLASSES));
    // Reset rotation smoothly
    gsap.to(item, { rotation: 0, duration: 0.5 });
  });

  Flip.from(state, {
    ...animationDefaults,
    scale: true,
    prune: true,
  });
};

// Click event handler for the grid images
const toggleImage = (ev) => {
  const gridImage = ev.target;
  const gridItem = gridItems[gridImage.dataset.index];

  flipImage(gridItem, gridImage);
  // Do not move other items on open
};

// Function to initialize event listeners for grid images
const initEvents = () => {
  gridImages.forEach((gridImage, index) => {
    // Save the index of the image
    gridImage.dataset.index = index;
    // Add click event listener to the image
    gridImage.addEventListener("click", toggleImage);
  });
};

// Preloading images and initializing setup when complete
preloadImages(".grid__img").then(() => {
  // Remove the loading class from the body
  document.body.classList.remove("loading");
  // Initialize event listeners
  initEvents();
});
