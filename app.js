const container = document.getElementById('container');
const historyModal = document.getElementById('history-modal');
const historyContent = document.getElementById('history-content');
const historyLink = document.getElementById('history-link');

let textArray = [];
let pageIndex = 0;
let sentenceIndex = 0;
let timeout;

historyLink.addEventListener('click', () => {
  historyModal.style.display = 'block';
  container.style.display = 'none';
});

historyModal.addEventListener('click', () => {
  historyModal.style.display = 'none';
  container.style.display = 'block';
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    processInput();
  }
});

document.addEventListener('click', processInput);

function processInput() {
  clearTimeout(timeout);
  if (sentenceIndex < textArray[pageIndex].length) {
    typeSentence(textArray[pageIndex][sentenceIndex]);
  } else if (pageIndex < textArray.length - 1) {
    pageIndex++;
    updateContainer();
  }
}

async function fetchText() {
  try {
    const response = await fetch('text.txt');
    const text = await response.text();
    const paragraphs = text.split('\n\n');
    textArray = paragraphs.map(paragraph => paragraph.split('. '));
    updateContainer();
  } catch (err) {
    console.error(err);
  }
}

function updateContainer() {
  container.innerHTML = '';
  sentenceIndex = 0;
  typeSentence(textArray[pageIndex][sentenceIndex]);
}

function typeSentence(sentence) {
  let index = 0;
  const p = document.createElement('p');
  container.appendChild(p);

  function type() {
    if (index < sentence.length) {
      p.innerHTML += sentence[index++];
      timeout = setTimeout(type, 50);
    } else {
      sentenceIndex++;
      if (sentenceIndex < textArray[pageIndex].length) {
        const nextP = document.createElement('p');
        container.appendChild(nextP);
        p.style.opacity = 0.5;
        historyContent.innerHTML += `<p>${sentence}.</p>`;
        typeSentence(textArray[pageIndex][sentenceIndex]);
      } else {
        historyContent.innerHTML += `<p>${sentence}.</p>`;
      }
    }
  }
  type();
}

fetchText();
