// Constants
const TYPEWRITER_DELAY_MS = 50;
const TYPEWRITER_FAST_DELAY_MS = 5;

// Helper function to fetch and parse text
async function getText(url) {
  const response = await fetch(url);
  const text = await response.text();
  const sentences = text.match(/[^.!?]+[.!?]+/g).map(sentence => sentence.trim());
  return sentences;
}

// Typewriter effect
async function typeSentence(element, sentence, delay) {
  let isFast = false;

  const handleClick = () => {
    isFast = true;
  };

  const handleKeyDown = (event) => {
    if (event.code === 'Space') {
      isFast = true;
      event.preventDefault();
    }
  };

  document.addEventListener('click', handleClick);
  document.addEventListener('keydown', handleKeyDown);

  for (let i = 0; i < sentence.length; i++) {
    const char = sentence[i];
    element.innerHTML += char;
    await sleep(isFast ? TYPEWRITER_FAST_DELAY_MS : delay);
  }

  document.removeEventListener('click', handleClick);
  document.removeEventListener('keydown', handleKeyDown);
}

// Main function
async function initializePage() {
  const container = document.querySelector(".container");
  const sentences = await getText("text.txt");
  const paragraphs = [];

  for (const sentence of sentences) {
    const paragraph = document.createElement("p");
    paragraphs.push(paragraph);

    await typeSentence(paragraph, sentence, TYPEWRITER_DELAY_MS);

    container.appendChild(paragraph);

    while (isOverflowing(container)) {
      const removedParagraph = paragraphs.shift();
      container.removeChild(removedParagraph);
    }

    await new Promise((resolve) => {
      const continueTyping = () => {
        document.removeEventListener("click", continueTyping);
        document.removeEventListener("keydown", spacebarHandler);
        resolve();
      };

      const spacebarHandler = (event) => {
        if (event.code === "Space") {
          continueTyping();
          event.preventDefault();
        }
      };

      document.addEventListener("click", continueTyping);
      document.addEventListener("keydown", spacebarHandler);
    });
  }
}

function isOverflowing(element) {
  return element.scrollHeight > element.clientHeight;
}

// Start the script when the DOM is ready
document.addEventListener('DOMContentLoaded', initializePage);

// Sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}