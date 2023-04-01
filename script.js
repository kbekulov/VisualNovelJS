// Constants
const TYPEWRITER_DELAY_MS = 25;
const TYPEWRITER_FAST_DELAY_MS = 0.2;

// Helper function to fetch and parse text
async function getText(url) {
  const response = await fetch(url);
  const text = await response.text();
  const sentences = text.match(/[^.!?]+[.!?]+/g).map(sentence => sentence.trim());
  return sentences;
}

// Typewriter effect
async function typeSentence(element, sentence, delay, fastDelay, isLast) {
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

  // Append the icon at the end of the sentence if it's the last one
  if (isLast) {
    const icon = document.createElement("img");
    icon.src = "icon_url_here"; // Replace with the actual URL of your icon
    icon.classList.add("icon");
    element.appendChild(icon);
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
  const paragraphs = [];

  for (const [index, sentence] of sentences.entries()) {
    const paragraph = document.createElement("p");
    paragraphs.push(paragraph);

    const isLast = index === sentences.length - 1;
    await typeSentence(paragraph, sentence, TYPEWRITER_DELAY_MS, TYPEWRITER_FAST_DELAY_MS, isLast);

    container.appendChild(paragraph);

    while (isOverflowing(container)) {
      const removedParagraph = paragraphs.shift();
      container.removeChild(removedParagraph);
      container.removeChild(container.firstChild);
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
