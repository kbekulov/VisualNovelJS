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

async function fetchText() {
  const response = await fetch("text.txt");
  const text = await response.text();
  return text;
}

async function init() {
  const text = await fetchText();
  const paragraphs = text.split("\n").filter((line) => line.trim() !== "");
  const container = document.querySelector(".container");

  let currentParagraph = 0;
  let index = 0;
  let textElement;
  let typingInProgress = false;

  function createParagraph() {
    const paragraph = document.createElement("p");
    container.appendChild(paragraph);
    return paragraph;
  }

  function fadeOutPreviousParagraphs() {
    const paragraphs = container.querySelectorAll("p");
    paragraphs.forEach((paragraph, index) => {
      paragraph.style.opacity = index < currentParagraph ? "0.5" : "1";
    });
  }

  function clearPreviousParagraphs() {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  function typeText() {
    textElement = createParagraph();
    typingInProgress = true;

    const typeInterval = setInterval(() => {
      if (index < paragraphs[currentParagraph].length) {
        textElement.textContent += paragraphs[currentParagraph].charAt(index);
        index++;

        if (container.scrollHeight > container.clientHeight) {
          clearPreviousParagraphs();
          textElement = createParagraph();
          textElement.textContent = paragraphs[currentParagraph].charAt(index - 1);
        }
      } else {
        clearInterval(typeInterval);
        typingInProgress = false;
        index = 0;
      }
    }, 50);
  }

  function nextParagraph() {
    if (typingInProgress) return;

    if (currentParagraph < paragraphs.length - 1) {
      currentParagraph++;
      fadeOutPreviousParagraphs();
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

  typeText();
}

init();
