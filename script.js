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
async function typeSentence(element, sentence, delay, fastDelay) {
  let isFast = false;
  let isPaused = false;

  const handleClick = () => {
    isFast = true;
    if (isPaused) {
      isPaused = false;
    }
  };

  const handleKeyDown = (event) => {
    if (event.code === 'Space') {
      isFast = true;
      if (isPaused) {
        isPaused = false;
      }
      event.preventDefault();
    }
  };

  document.addEventListener('click', handleClick);
  document.addEventListener('keydown', handleKeyDown);

  for (let i = 0; i < sentence.length; i++) {
    if (isPaused) {
      await sleep(50);
      continue;
    }
    const char = sentence[i];
    element.innerHTML += char;
    await sleep(isFast ? fastDelay : delay);
  }

  isPaused = true;

  document.removeEventListener('click', handleClick);
  document.removeEventListener('keydown', handleKeyDown);

  return isPaused;
}

// Main function
async function initializePage() {
  const container = document.querySelector(".container");
  const sentences = await getText("text.txt");

  let currentParagraph = document.createElement("p");
  container.appendChild(currentParagraph);

  for (const sentence of sentences) {
    const isPaused = await typeSentence(currentParagraph, sentence, TYPEWRITER_DELAY_MS, TYPEWRITER_FAST_DELAY_MS);

    while (isPaused) {
      await sleep(50);
    }

    if (isOverflowing(container)) {
      container.removeChild(container.firstChild);
      currentParagraph = document.createElement("p");
      container.appendChild(currentParagraph);
    } else {
      currentParagraph = document.createElement("p");
      container.appendChild(currentParagraph);
    }
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
