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

const text = `This is the first paragraph.
It will be typed out one character at a time.

When you click or press the spacebar, the next paragraph will begin.

If the text doesn't fit into the container, the previous paragraphs will be deleted, and typing will proceed from a clean container.
`;

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
