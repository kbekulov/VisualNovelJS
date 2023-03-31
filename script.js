let textChunks = [];
let currentChunkIndex = 0;
let isTyping = false;
let isCompleted = false;

function typeText(text, callback) {
  const characters = text.split('');
  let currentCharacterIndex = 0;

  isTyping = true;
  isCompleted = false;

  const intervalId = setInterval(() => {
    const currentText = characters.slice(0, currentCharacterIndex + 1).join('');
    const isLastCharacter = currentCharacterIndex === characters.length - 1;

    document.getElementById('content').textContent = currentText;

    if (isLastCharacter) {
      isTyping = false;
      clearInterval(intervalId);
      if (typeof callback === 'function') {
        callback();
      }
    } else {
      currentCharacterIndex++;
    }
  }, 50);
}

function completeText() {
  if (isTyping && !isCompleted) {
    isCompleted = true;
    const currentText = document.getElementById('content').textContent;
    document.getElementById('content').textContent = textChunks[currentChunkIndex];
  }
}

function updateContent() {
  if (currentChunkIndex < textChunks.length) {
    if (isTyping) {
      completeText();
    } else {
      const textChunk = textChunks[currentChunkIndex];
      typeText(textChunk, () => {
        currentChunkIndex++;
      });
    }
  } else {
    console.error('Chunk index is out of range');
  }
}

// ... (fetch and splitTextIntoChunks functions remain unchanged)

fetch('text.txt')
  .then(response => response.text())
  .then(data => {
    textChunks = splitTextIntoChunks(data, 200);
    updateContent();
  })
  .catch(error => {
    console.error('Error fetching text:', error);
  });

document.body.addEventListener('click', () => {
  completeText();
  if (!isTyping) {
    currentChunkIndex++;
    updateContent();
  }
});

document.body.addEventListener('keyup', (event) => {
  if (event.code === 'Space') {
    completeText();
    if (!isTyping) {
      currentChunkIndex++;
      updateContent();
    }
  }
});
