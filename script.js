function initializePage() {
  const order = getQueryParam('order', 1);
  window.history.replaceState({}, document.title, window.location.pathname + `?order=${order}`);
  fetch('text.txt')
    .then(response => response.text())
    .then(data => {
      const sentences = data.match(/[^.!?]+[.!?]+/g).map(sentence => sentence.trim());
      let currentIndex = (order - 1) % sentences.length;
      let previousIndices = [];
      let currentText = '';
      let currentIndexInText = 0;
      let isTyping = true;
      let isSentenceEnd = false;

      const contentElement = document.getElementById('content');

      function updateDisplayedContent() {
        let displayedText = '';
        for (let i = 0; i < previousIndices.length; i++) {
          const sentence = sentences[previousIndices[i]];
          displayedText += sentence;
          if (i < previousIndices.length - 1) {
            displayedText += '<br>';
          }
        }
        displayedText += currentText.substring(0, currentIndexInText).replace(/\n/g, '<br>');
        contentElement.innerHTML = displayedText;
      }

      const intervalId = setInterval(() => {
        if (!isTyping) {
          clearInterval(intervalId);
          return;
        }

        if (currentIndexInText >= sentences[currentIndex].length) {
          if (isSentenceEnd) {
            isTyping = false;
            setTimeout(() => {
              isTyping = true;
              isSentenceEnd = false;
              currentIndex = (currentIndex + 1) % sentences.length;
              previousIndices.push(currentIndex);
              currentIndexInText = 0;

              if (previousIndices.length > MAX_LINES) {
                const startIndex = previousIndices.length - MAX_LINES;
                previousIndices = previousIndices.slice(startIndex);
              }

              updateDisplayedContent();
            }, TYPEWRITER_END_PAUSE_MS);
          } else {
            isSentenceEnd = true;
          }
          return;
        }

        currentText += sentences[currentIndex][currentIndexInText];
        currentIndexInText++;

        if (sentences[currentIndex][currentIndexInText - 1] === '.' || sentences[currentIndex][currentIndexInText - 1] === '?' || sentences[currentIndex][currentIndexInText - 1] === '!') {
          isSentenceEnd = true;
        } else if (isSentenceEnd && sentences[currentIndex][currentIndexInText - 1].match(/\w/)) {
          isSentenceEnd = false;
        }

        updateDisplayedContent();
      }, TYPEWRITER_DELAY_MS);

      document.addEventListener('click', () => {
        if (isSentenceEnd) {
          isTyping = true;
          isSentenceEnd = false;
          currentIndex = (currentIndex + 1) % sentences.length;
          previousIndices.push(currentIndex);
          currentIndexInText = 0;

          if (previousIndices.length > MAX_LINES) {
            const startIndex = previousIndices.length - MAX_LINES;
            previousIndices = previousIndices.slice(startIndex);
          }

          updateDisplayedContent();
        }
      });

      document.addEventListener('keydown', event => {
        if (event.code === 'Space') {
          if (isSentenceEnd) {
            isTyping = true;
            isSentenceEnd = false;
            currentIndex = (currentIndex + 1) % sentences.length;
            previousIndices.push(currentIndex);
            currentIndexInText = 0;

            if (previousIndices.length > MAX_LINES) {
              const startIndex = previousIndices.length - MAX_LINES;
              previousIndices = previousIndices.slice(startIndex);
            }

            updateDisplayedContent();
            event.preventDefault();
          }
        }
      });

      updateDisplayedContent();
    })
    .catch(error => {
      console.error('Error fetching text:', error);
    });
}

