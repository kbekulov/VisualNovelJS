const WORDS_PER_CHUNK = 200;
const TYPEWRITER_DELAY_MS = 50;
const TYPEWRITER_END_PAUSE_MS = 1000;

function getQueryParam(name, defaultValue) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || defaultValue;
}

function updateContent(order) {
  fetch('text.txt')
    .then(response => response.text())
    .then(data => {
      const contentElement = document.getElementById('content');
      const sentences = data.match(/[^.!?]+[.!?]+/g).map(sentence => sentence.trim());
      const chunks = [];
      let currentChunk = '';

      sentences.forEach(sentence => {
        if ((currentChunk + ' ' + sentence).split(' ').length <= WORDS_PER_CHUNK) {
          currentChunk += ' ' + sentence;
        } else {
          chunks.push(currentChunk.trim());
          currentChunk = sentence;
        }
      });

      if (currentChunk !== '') {
        chunks.push(currentChunk.trim());
      }

      let currentChunkIndex = (order - 1) % chunks.length;
      let currentText = '';
      let currentIndex = 0;
      let isTyping = true;
      let isSentenceEnd = false;

      const intervalId = setInterval(() => {
        if (!isTyping) {
          clearInterval(intervalId);
          return;
        }

        if (currentIndex >= chunks[currentChunkIndex].length) {
          if (isSentenceEnd) {
            isTyping = false;
            setTimeout(() => {
              isTyping = true;
              isSentenceEnd = false;
              currentChunkIndex = (currentChunkIndex + 1) % chunks.length;
              currentIndex = 0;
            }, TYPEWRITER_END_PAUSE_MS);
          } else {
            isSentenceEnd = true;
          }
          return;
        }

        currentText += chunks[currentChunkIndex][currentIndex];
        currentIndex++;

        if (chunks[currentChunkIndex][currentIndex - 1] === '.' || chunks[currentChunkIndex][currentIndex - 1] === '?' || chunks[currentChunkIndex][currentIndex - 1] === '!') {
          isSentenceEnd = true;
        } else if (isSentenceEnd && chunks[currentChunkIndex][currentIndex - 1].match(/\w/)) {
          isSentenceEnd = false;
        }

        contentElement.innerHTML = currentText.replace(/\n/g, '<br>');
      }, TYPEWRITER_DELAY_MS);

      document.addEventListener('click', () => {
        if (isSentenceEnd) {
          isTyping = true;
          isSentenceEnd = false;
          currentChunkIndex = (currentChunkIndex + 1) % chunks.length;
          currentIndex = 0;
        }
      });

      document.addEventListener('keydown', event => {
        if (event.code === 'Space') {
          if (isSentenceEnd) {
            isTyping = true;
            isSentenceEnd = false;
            currentChunkIndex = (currentChunkIndex + 1) % chunks.length;
            currentIndex = 0;
            event.preventDefault();
          }
        }
      });
    })
    .catch(error => {
      console.error('Error fetching text:', error);
    });
}

function initializePage() {
  const order = getQueryParam('order', 1);
  window.history.replaceState({}, document.title, window.location.pathname + `?order=${order}`);
  updateContent(order);
}

initializePage();
