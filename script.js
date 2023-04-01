// Constants
const TYPEWRITER_DELAY_MS = 100;
const TYPEWRITER_FAST_DELAY_MS = 10;

// Helper function to fetch and parse text
async function getText(url) {
  const response = await fetch(url);
  const text = await response.text();
  const sentences = text.match(/[^.!?]+[.!?]+/g).map(sentence => sentence.trim());
  return sentences;
}

// Typewriter effect
async function typeSentence(element, sentence, delay) {
  return new Promise(async resolve => {
    let i = 0;
    let fastMode = false;

    const intervalId = setInterval(() => {
      element.textContent += sentence.charAt(i);
      i++;

      if (i >= sentence.length) {
        clearInterval(intervalId);
        resolve();
      }
    }, fastMode ? delay / 10 : delay);

    // Event listeners for faster typing
    const speedUpTyping = () => {
      if (!fastMode) {
        fastMode = true;
        clearInterval(intervalId);

        intervalId = setInterval(() => {
          element.textContent += sentence.charAt(i);
          i++;

          if (i >= sentence.length) {
            clearInterval(intervalId);
            resolve();
          }
        }, TYPEWRITER_FAST_DELAY_MS);
      }
    };

    document.addEventListener('click', speedUpTyping);
    document.addEventListener('keydown', event => {
      if (event.code === 'Space') {
        speedUpTyping();
        event.preventDefault();
      }
    });
  });
}

// Main function
async function initializePage() {
  const container = document.querySelector('.container');
  const sentences = await getText('text.txt');

  for (const sentence of sentences) {
    const paragraph = document.createElement('p');
    container.appendChild(paragraph);

    await typeSentence(paragraph, sentence, TYPEWRITER_DELAY_MS);

    // Check if the container is overflowing
    if (container.scrollHeight > container.clientHeight) {
      container.innerHTML = ''; // Clear the container
      container.appendChild(paragraph); // Add the current paragraph
    }

    // Wait for user input to continue
    await new Promise(resolve => {
      const continueTyping = () => {
        document.removeEventListener('click', continueTyping);
        document.removeEventListener('keydown', spacebarHandler);
        resolve();
      };

      const spacebarHandler = event => {
        if (event.code === 'Space') {
          continueTyping();
          event.preventDefault();
        }
      };

      document.addEventListener('click', continueTyping);
      document.addEventListener('keydown', spacebarHandler);
    });
  }
}

// Start the script when the DOM is ready
document.addEventListener('DOMContentLoaded', initializePage);
