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

const container = document.querySelector(".container");
const flippingPage = document.getElementById("flipping-page");

const text = `This is a sample text.
It will be typed out letter by letter.
Press the spacebar or click anywhere on the screen to continue typing the text.`;

const paragraphs = text.split('\n');
let currentParagraph = 0;
let index = 0;
let typingInProgress = false;

function createParagraph() {
  const paragraph = document.createElement("p");
  container.appendChild(paragraph);
  return paragraph;
}

let textElement = createParagraph();

function typeText() {
  if (!typingInProgress && currentParagraph < paragraphs.length) {
    if (currentParagraph > 0) {
      container.querySelectorAll("p")[currentParagraph - 1].style.opacity = "0.5";
    }

    typingInProgress = true;

    const typeInterval = setInterval(() => {
      if (index < paragraphs[currentParagraph].length) {
        const char = paragraphs[currentParagraph].charAt(index);
        textElement.textContent += char;
        index++;
      } else {
        clearInterval(typeInterval);
        typingInProgress = false;

        if (currentParagraph < paragraphs.length - 1) {
          index = 0;
          currentParagraph++;
          textElement = createParagraph();
        } else {
          flippingPage.style.display = "block";
        }
      }
    }, 50);

    return typeInterval;
  }
  return null;
}

function handleUserInteraction() {
  if (typingInProgress) {
    clearInterval(typeText());
    textElement.textContent = paragraphs[currentParagraph];
    index = paragraphs[currentParagraph].length;
  } else {
    typeText();
  }
}

document.body.addEventListener("click", handleUserInteraction);

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    handleUserInteraction();
    event.preventDefault(); // Prevent scrolling when spacebar is pressed
  }
});

typeText();
