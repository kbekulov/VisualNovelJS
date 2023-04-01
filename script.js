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
    await sleep(isFast ? fastDelay : delay);
  }

  document.removeEventListener('click', handleClick);
  document.removeEventListener('keydown', handleKeyDown);

  return new Promise((resolve) => {
    const continueTyping = () => {
      document.removeEventListener('click', continueTyping);
      document.removeEventListener('keydown', spacebarHandler);
      resolve();
    };

    const spacebarHandler = (event) => {
      if (event.code === 'Space') {
        continueTyping();
        event.preventDefault();
      }
    };

    document.addEventListener('click', continueTyping);
    document.addEventListener('keydown', spacebarHandler);
  });
}

// Main function
async function initializePage() {
  const container = document.querySelector(".container");
  const sentences = await getText("text.txt");

  let currentParagraph = document.createElement("p");
  container.appendChild(currentParagraph);

  for (const sentence of sentences) {
    await typeSentence(currentParagraph, sentence, TYPEWRITER_DELAY_MS, TYPEWRITER_FAST_DELAY_MS);

    if (isOverflowing(container)) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
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
