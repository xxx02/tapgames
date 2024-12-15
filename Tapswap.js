// ==UserScript==
// @name         TapSwap AutoClicker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks the coin button multiple times when the control button is clicked.
// @author       CS
// @icon         https://www.softportal.com/en/scr/1089/icons/icon_src.png
// @match        *://*.tapswap.club/*
// @grant        none
// ==/UserScript==

let isClicking = false;
let clickInterval;
let button;

// Wait for the button to be available in the DOM
function findButton() {
  button = document.querySelector("#ex1-layer > img");
  if (button) {
    console.log("Button found!");
  } else {
    console.log("Button not found yet, retrying...");
  }
}

function getRandomCoordinateInCircle(radius) {
  let x, y;
  do {
    x = Math.random() * 2 - 1;
    y = Math.random() * 2 - 1;
  } while (x * x + y * y > 1);
  return {
    x: Math.round(x * radius),
    y: Math.round(y * radius)
  };
}

function triggerEvent(element, eventType, properties) {
  const event = new MouseEvent(eventType, properties);
  element.dispatchEvent(event);
}

function startClicking() {
  if (!button) {
    console.error("Button not found!");
    return;
  }

  const rect = button.getBoundingClientRect();
  const radius = Math.min(rect.width, rect.height) / 2;

  function simulateClick() {
    const { x, y } = getRandomCoordinateInCircle(radius);
    const clientX = rect.left + radius + x;
    const clientY = rect.top + radius + y;

    const commonProperties = {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: clientX,
      clientY: clientY,
      screenX: clientX,
      screenY: clientY,
      pageX: clientX,
      pageY: clientY,
      pointerId: 1,
      pointerType: "touch",
      isPrimary: true,
      width: 1,
      height: 1,
      pressure: 0.5,
      button: 0,
      buttons: 1
    };

    triggerEvent(button, 'pointerdown', commonProperties);
    triggerEvent(button, 'mousedown', commonProperties);
    triggerEvent(button, 'pointerup', { ...commonProperties, pressure: 0 });
    triggerEvent(button, 'mouseup', commonProperties);
    triggerEvent(button, 'click', commonProperties);
  }

  clickInterval = setInterval(simulateClick, Math.random() * 20 + 10); // Simulate clicks with random delay
  isClicking = true;
}

function stopClicking() {
  clearInterval(clickInterval);
  isClicking = false;
  console.log("Clicking stopped");
}

function toggleClicking() {
  if (isClicking) {
    stopClicking();
  } else {
    startClicking();
  }
}

// Create a new button to control the start/stop of the click simulation
const controlButton = document.createElement('button');
controlButton.textContent = '▶️';
controlButton.style.position = 'fixed';
controlButton.style.bottom = '10px';
controlButton.style.right = '10px';
controlButton.style.padding = '10px';
controlButton.style.backgroundColor = 'transparent';
controlButton.style.color = 'white';
controlButton.style.border = 'none';
controlButton.style.fontSize = '40px';
controlButton.style.cursor = 'pointer';
controlButton.style.zIndex = '9999';

document.body.appendChild(controlButton);

controlButton.addEventListener('click', () => {
  toggleClicking();
  if (isClicking) {
    controlButton.textContent = '⏸️';
  } else {
    controlButton.textContent = '▶️';
  }
});

// Use MutationObserver to detect when the button is added to the DOM
const observer = new MutationObserver(findButton);
observer.observe(document.body, { childList: true, subtree: true });

// Run the function initially to check if the button is already there
findButton();
