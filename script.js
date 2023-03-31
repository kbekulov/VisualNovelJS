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

// Fetch text from txt file
async function fetchText() {
  const response = await fetch("text.txt");
  const text = await response.text();
  return text;
}

async function init() {
  const text = await fetchText();
  const paragraphs = text
    .split("\n")
    .filter((line) => line.trim() !== "");

  // Rest of the code from the previous script.js

  const container = document.querySelector(".container");

  let currentParagraph = 0;
  let index = 0;
  let textElement;

  function fadeOutPreviousParagraphs() {
    const paragraphs = container.querySelectorAll("p");
    paragraphs.forEach((paragraph, index) => {
      if (index < currentParagraph) {
        paragraph.style.opacity = "0.5";
      } else {
        paragraph.style.opacity = "1";
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
}

init();
