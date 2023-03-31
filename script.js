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

const text = `Meanwhile, Felix strode into the bustling café, inhaling deeply and savouring the rich aroma of freshly brewed coffee beans. He took his time scanning the busy establishment, looking for any signs of suspicious activity. His excessive caution was not instinctive, but merely a formality imposed on him by his work. In the corner of his eye, he noticed a young female barista working behind the counter. He proceeded to sauntered up to the counter. With a playful smile on his face he ordered his coffee. Awaiting his spicy iced latte, he stole glances at his phone, keeping an eye on the screen. His attention was soon diverted, however, as the female barista smiled at him and asked if there was anything else she could get for him.

"Oh, just your number," Felix quipped, flashing his most charming smile.
The barista chuckled, but shook her head. "Sorry, I'm taken."

Lynleit curiously observed Felix from a distance, as he was making a fool of himself at the counter. She couldn't believe how little regard he had for the seriousness of his job.`;

const paragraphs = text
  .split("\n")
  .filter((line) => line.trim() !== ""); // Add this line to filter out empty lines

let currentParagraph = 0;
let index = 0;
let textElement;

function fadeOutPreviousParagraphs() {
  const paragraphs = container.querySelectorAll("p");
  paragraphs.forEach((paragraph, index) => {
    if (index < currentParagraph) {
      paragraph.style.opacity = "0.5";
    }
  });
}

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

let typingInProgress = false;

function typeText() {
  textElement = createParagraph();
  fadeOutPreviousParagraphs();
  typingInProgress = true;
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
      index = 0;
    }
  }, 50);
}

typeText();

function nextParagraph() {
  if (typingInProgress) {
    textElement.textContent = paragraphs[currentParagraph];
    index = paragraphs[currentParagraph].length;
    typingInProgress = false;
    return;
  }
  if (currentParagraph < paragraphs.length - 1) {
    currentParagraph++;
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