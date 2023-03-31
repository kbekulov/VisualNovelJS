const background = document.querySelector(".background");

function fadeIn(element, duration) {
  let opacity = 0;
  const interval = 10;
  const step = interval / (duration / 1000);

  const fadeInInterval = setInterval(() => {
    opacity += step;
    if (opacity >= 1) {
      clearInterval(fadeInInterval);
      opacity = 1;
    }
    element.style.opacity = opacity;
  }, interval);
}

fadeIn(background, 2000);

// start typewriter here!
const container = document.querySelector(".container");
const flippingPage = document.getElementById("flipping-page");

const text = `Elegant facades adorned with intricate carvings, worn cobblestone streets, and ornate fountains coexisted with occasional glass-and-steel office skyscrapers that seemed to intrude upon the scene, like unwelcome guests at a sophisticated soiree.
The sunlight danced on the river's surface, causing the water to shimmer and sparkle like a thousand tiny diamonds.

The beauty of these late summer weeks was ephemeral, however, as autumn was eager to step early into the scene, heralding the arrival of rains and melancholic landscapes.

Lynleit sat in the riverside cafe, sipping her iced coffee and listening to the sounds of the city. She watched as people passed by, their faces tired and drawn from work and the suffocating heat. The sky was clear but a dark blanket of rainclouds was slowly approaching in the distance. A storm loomed on the horizon, casting an eerie pallor over the city, and she could feel the weight of the impending rain pressing down on her. The air was thick with the smell of damp earth and the faint odour of cigarette smoke wafting in from a nearby table. As she gazed out at the river, she couldn't help but feel a sense of dread about the future. She knew that a rain was coming, and with it, the unsettling unknown.

She reached up to adjust a tiny device in her ear, listening intently, with her eyes lost in the distance. Occasionally, she hummed in response to the person on the other end of the call.`;

const paragraphs = text.split("\n");

let currentParagraph = 0;
let index = 0;
let textElement;

function clearPreviousParagraphs() {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function createParagraph() {
  const paragraph = document.createElement("p");
  container.appendChild(paragraph);
  return paragraph;
}

function typeText() {
  textElement = createParagraph();
  const typeInterval = setInterval(() => {
    if (index < paragraphs[currentParagraph].length) {
      const char = paragraphs[currentParagraph].charAt(index);
      textElement.textContent += char;
      index++;

      // Check if the text overflows the container's boundaries
      if (container.scrollHeight > container.clientHeight) {
        clearPreviousParagraphs();
        textElement = createParagraph();
        textElement.textContent = char;
      }
    } else {
      clearInterval(typeInterval);
      flippingPage.style.display = "block";
      index = 0;
    }
  }, 50);
}

typeText();

function nextParagraph() {
  if (currentParagraph < paragraphs.length - 1) {
    currentParagraph++;
    flippingPage.style.display = "none";
    textElement.style.opacity = "1";
    typeText();
  }
}

document.addEventListener("click", nextParagraph);
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    nextParagraph();
  }
});
